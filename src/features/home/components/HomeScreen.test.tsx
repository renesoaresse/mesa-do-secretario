import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { storage } from '../../../services/storage';
import { DEFAULT_LOJA_CONFIG } from '../../../hooks/useAtaState';
import { removeMockElectronApi } from '../../../test/electron';
import type { LojaConfig } from '../../../types/ata';
import { HomeScreen } from './HomeScreen';
import { Router, Route } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

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

describe('HomeScreen', () => {
  beforeEach(() => {
    localStorage.clear();
    removeMockElectronApi();
  });

  it('renderiza titulo e versao', () => {
    renderWithRouter(<HomeScreen />);
    expect(screen.getByText('Mesa do Secretário')).toBeInTheDocument();
  });

  it('renderiza botao Nova Ata', () => {
    renderWithRouter(<HomeScreen />);
    expect(screen.getByText('Nova Ata')).toBeInTheDocument();
  });

  it('recebe o secretario com as boas-vindas quando faltam dados da loja', () => {
    renderWithRouter(<HomeScreen />);

    expect(screen.getByRole('dialog', { name: 'Bem-vindo, Irmão Secretário' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Configurar dados da Loja' })).toBeInTheDocument();
  });

  it('nao exibe as boas-vindas quando so a logo esta vazia', () => {
    // A logo é opcional: com o resto preenchido, o modal não aparece.
    storage.saveLojaConfig({ ...LOJA_COMPLETA, logoDataUrl: null });

    renderWithRouter(<HomeScreen />);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('mantem as boas-vindas enquanto algum campo obrigatorio estiver vazio', () => {
    storage.saveLojaConfig({ ...LOJA_COMPLETA, cidadeEstado: '' });

    renderWithRouter(<HomeScreen />);

    expect(screen.getByRole('dialog', { name: 'Bem-vindo, Irmão Secretário' })).toBeInTheDocument();
  });

  it('nao deixa dispensar as boas-vindas sem configurar a loja', async () => {
    const user = userEvent.setup();
    renderWithRouter(<HomeScreen />);

    expect(screen.queryByRole('button', { name: 'Fechar' })).toBeNull();

    await user.keyboard('{Escape}');

    expect(screen.getByRole('dialog', { name: 'Bem-vindo, Irmão Secretário' })).toBeInTheDocument();
  });
});

function renderWithRouter(ui: React.ReactElement) {
  return render(ui, {
    wrapper: function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <Router hook={useHashLocation}>
          <Route path="/">{children}</Route>
        </Router>
      );
    },
  });
}
