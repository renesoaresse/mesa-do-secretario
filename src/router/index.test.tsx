import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { AppRoutes, ROUTES } from './index';
import { storage } from '../services/storage';
import { DEFAULT_LOJA_CONFIG } from '../hooks/useAtaState';
import { removeMockElectronApi } from '../test/electron';
import type { LojaConfig } from '../types/ata';

vi.mock('../app/AppEditor', () => ({
  AppEditor: () => <p>tela de ata</p>,
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

  it('libera as demais rotas depois que os dados da loja estao completos', () => {
    storage.saveLojaConfig(LOJA_COMPLETA);

    renderRota(ROUTES.ATA);

    expect(screen.getByText('tela de ata')).toBeInTheDocument();
  });

  it('nao mostra o modal na tela principal quando os dados estao completos', () => {
    storage.saveLojaConfig(LOJA_COMPLETA);

    renderRota(ROUTES.HOME);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('O que deseja fazer?')).toBeInTheDocument();
  });
});
