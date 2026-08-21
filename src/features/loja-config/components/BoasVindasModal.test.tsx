import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { BoasVindasModal } from './BoasVindasModal';
import { ROUTES } from '../../../router/index';

function renderModal() {
  render(
    <Router hook={useHashLocation}>
      <Route path="/">
        <BoasVindasModal open />
      </Route>
      <Route path={ROUTES.LOJA_CONFIG}>
        <p>tela de configuracao da loja</p>
      </Route>
    </Router>,
  );

  return { user: userEvent.setup() };
}

describe('BoasVindasModal', () => {
  beforeEach(() => {
    // O hash sobrevive entre testes: volta para a raiz antes de cada render.
    window.location.hash = '';
  });

  it('nao renderiza nada quando fechado', () => {
    render(
      <Router hook={useHashLocation}>
        <BoasVindasModal open={false} />
      </Router>,
    );

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('navega para a configuracao da loja pelo botao', async () => {
    const { user } = renderModal();

    await user.click(screen.getByRole('button', { name: 'Configurar dados da Loja' }));

    expect(screen.getByText('tela de configuracao da loja')).toBeInTheDocument();
  });

  it('nao oferece saida sem configurar a loja', async () => {
    const { user } = renderModal();

    expect(screen.queryByRole('button', { name: 'Fechar' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Agora não' })).toBeNull();
    expect(screen.getAllByRole('button').map((botao) => botao.textContent)).toEqual([
      'Configurar dados da Loja',
    ]);

    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog', { name: 'Bem-vindo, Irmão Secretário' })).toBeInTheDocument();
  });
});
