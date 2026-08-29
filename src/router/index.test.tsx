import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Route, Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { AppRoutes } from './index';
import { ROUTES } from './routes';
import { AtaRedirect, MODULOS_ATA_LISTA, moduloAtaDoRito, rotaDoModuloAta } from '../features/ata';
import { storage } from '../services/storage';
import { DEFAULT_LOJA_CONFIG } from '../hooks/useAtaState';
import { removeMockElectronApi } from '../test/electron';
import type { LojaConfig } from '../types/ata';

vi.mock('../app/AppEditor', () => ({
  AppEditor: ({ modulo }: { modulo: { label: string } }) => <p>tela de ata: {modulo.label}</p>,
}));

const LOJA_COMPLETA: LojaConfig = {
  ...DEFAULT_LOJA_CONFIG,
  nomeLoja: 'Loja Teste',
  rito: 'Rito Escocês Antigo e Aceito',
  numeroLoja: '29',
  dataFundacaoISO: '2020-01-01',
  temploNome: 'Templo Teste',
  enderecoTemplo: 'Rua Um, 10',
  cidadeEstado: 'Aracaju/SE',
};

function renderRota(rota: string) {
  window.location.hash = rota;

  return render(
    <Router hook={useHashLocation}>
      <AppRoutes />
    </Router>,
  );
}

describe('AppRoutes - bloqueio sem dados da loja', () => {
  beforeEach(() => {
    localStorage.clear();
    removeMockElectronApi();
    window.location.hash = '';
  });

  it.each([
    ['a tela de ata', ROUTES.ATA],
    ['as configurações', ROUTES.CONFIG],
    ['a lista de lojas', ROUTES.LOJAS],
    ['o cadastro de loja', ROUTES.LOJA_NOVA],
  ])('redireciona %s para a tela principal com o modal aberto', async (_titulo, rota) => {
    renderRota(rota);

    expect(
      await screen.findByRole('dialog', { name: 'Bem-vindo, Irmão Secretário' }),
    ).toBeInTheDocument();
    expect(screen.getByText('O que deseja fazer?')).toBeInTheDocument();
  });

  it('mantem a configuracao da loja acessivel pela URL', () => {
    renderRota(ROUTES.LOJA_CONFIG);

    expect(screen.getByRole('heading', { name: 'Configuração da Loja' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('libera as demais rotas depois que os dados da loja estao completos', async () => {
    storage.saveLojaConfig(LOJA_COMPLETA);

    renderRota(ROUTES.ATA);

    expect(
      await screen.findByText('tela de ata: Rito Escocês Antigo e Aceito'),
    ).toBeInTheDocument();
  });

  it('nao mostra o modal na tela principal quando os dados estao completos', () => {
    storage.saveLojaConfig(LOJA_COMPLETA);

    renderRota(ROUTES.HOME);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('O que deseja fazer?')).toBeInTheDocument();
  });
});

describe('AppRoutes - modulo de ata por rito', () => {
  beforeEach(() => {
    localStorage.clear();
    removeMockElectronApi();
    window.location.hash = '';
  });

  it('mantem a rota de cada rito alinhada com o slug do seu modulo', () => {
    expect(rotaDoModuloAta(moduloAtaDoRito('Rito Escocês Antigo e Aceito')!)).toBe(
      ROUTES.ATA_ESCOCES,
    );
    expect(rotaDoModuloAta(moduloAtaDoRito('Rito Adonhiramita')!)).toBe(ROUTES.ATA_ADONHIRAMITA);
    expect(rotaDoModuloAta(moduloAtaDoRito('Rito de York')!)).toBe(ROUTES.ATA_YORK);
    expect(rotaDoModuloAta(moduloAtaDoRito('Rito de Emulação')!)).toBe(ROUTES.ATA_EMULACAO);
  });

  it.each(MODULOS_ATA_LISTA.map((modulo) => [modulo.rito, modulo] as const))(
    'abre o modulo de %s a partir do rito cadastrado na loja',
    async (rito, modulo) => {
      storage.saveLojaConfig({ ...LOJA_COMPLETA, rito });

      renderRota(ROUTES.ATA);

      expect(await screen.findByText(`tela de ata: ${modulo.label}`)).toBeInTheDocument();
      expect(window.location.hash).toContain(rotaDoModuloAta(modulo));
    },
  );

  it('reencaminha a URL de um rito diferente do cadastrado na loja', async () => {
    storage.saveLojaConfig({ ...LOJA_COMPLETA, rito: 'Rito de York' });

    renderRota(ROUTES.ATA_ESCOCES);

    expect(await screen.findByText('tela de ata: Rito de York')).toBeInTheDocument();
    expect(window.location.hash).toContain(ROUTES.ATA_YORK);
  });

  // A trava vale para o endereço de qualquer outro rito, não só um deles.
  it.each([
    ['escoces', ROUTES.ATA_ESCOCES],
    ['adonhiramita', ROUTES.ATA_ADONHIRAMITA],
    ['emulacao', ROUTES.ATA_EMULACAO],
  ])('tranca a ata da loja de York contra a URL de %s', async (_slug, rota) => {
    storage.saveLojaConfig({ ...LOJA_COMPLETA, rito: 'Rito de York' });

    renderRota(rota);

    expect(await screen.findByText('tela de ata: Rito de York')).toBeInTheDocument();
    expect(window.location.hash).toContain(ROUTES.ATA_YORK);
  });

  it('reencaminha rito inexistente digitado na URL', async () => {
    storage.saveLojaConfig({ ...LOJA_COMPLETA, rito: 'Rito de Emulação' });

    renderRota('/ata/rito-que-nao-existe');

    expect(await screen.findByText('tela de ata: Rito de Emulação')).toBeInTheDocument();
    expect(window.location.hash).toContain(ROUTES.ATA_EMULACAO);
  });

  // O endereço trocado sai do histórico: voltar não devolve o rito errado.
  it('troca a URL errada sem empilhar historico', async () => {
    storage.saveLojaConfig({ ...LOJA_COMPLETA, rito: 'Rito de York' });

    // O histórico é medido já com a URL errada aberta: a troca não pode somar.
    window.location.hash = ROUTES.ATA_ESCOCES;
    const antes = window.history.length;

    render(
      <Router hook={useHashLocation}>
        <AppRoutes />
      </Router>,
    );
    await screen.findByText('tela de ata: Rito de York');

    expect(window.history.length).toBe(antes);
  });

  // O rito é campo obrigatório da loja, então a rota /ata só é liberada com um
  // rito válido; o desvio para o cadastro é a guarda de quem chega sem ele.
  it('manda para o cadastro da loja quando nao ha rito escolhido', async () => {
    storage.saveLojaConfig({ ...LOJA_COMPLETA, rito: '' });

    render(
      <Router hook={useHashLocation}>
        <AtaRedirect />
        <Route path={ROUTES.LOJA_CONFIG}>
          <p>cadastro da loja</p>
        </Route>
      </Router>,
    );

    expect(await screen.findByText('cadastro da loja')).toBeInTheDocument();
  });
});
