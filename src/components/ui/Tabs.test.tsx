import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { Tabs } from './Tabs';
import { renderWithUser } from '../../test/render';

const items = [
  { id: 'a', label: 'Aba A', content: <p>Conteudo A</p> },
  { id: 'b', label: 'Aba B', content: <p>Conteudo B</p> },
  { id: 'c', label: 'Aba C', content: <p>Conteudo C</p> },
];

describe('Tabs', () => {
  it('abre a primeira aba por padrao', () => {
    renderWithUser(<Tabs items={items} ariaLabel="Secoes" />);

    expect(screen.getByRole('tab', { name: 'Aba A' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Conteudo A')).toBeInTheDocument();
    expect(screen.queryByText('Conteudo B')).toBeNull();
  });

  it('troca o painel ao clicar em outra aba', async () => {
    const { user } = renderWithUser(<Tabs items={items} ariaLabel="Secoes" />);

    await user.click(screen.getByRole('tab', { name: 'Aba B' }));

    expect(screen.getByText('Conteudo B')).toBeInTheDocument();
    expect(screen.queryByText('Conteudo A')).toBeNull();
  });

  it('navega entre abas com as setas do teclado', async () => {
    const { user } = renderWithUser(<Tabs items={items} ariaLabel="Secoes" />);

    await user.click(screen.getByRole('tab', { name: 'Aba A' }));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('Conteudo B')).toBeInTheDocument();

    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(screen.getByText('Conteudo C')).toBeInTheDocument();
  });

  it('respeita defaultTabId', () => {
    renderWithUser(<Tabs items={items} defaultTabId="c" ariaLabel="Secoes" />);

    expect(screen.getByText('Conteudo C')).toBeInTheDocument();
  });
});
