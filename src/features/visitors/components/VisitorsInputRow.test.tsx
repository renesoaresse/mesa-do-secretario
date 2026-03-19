import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithUser } from '../../../test/render';
import { VisitorsInputRow } from './VisitorsInputRow';

describe('VisitorsInputRow', () => {
  it('adiciona visitante por clique e limpa o campo', async () => {
    const onAdd = vi.fn();
    const { user } = renderWithUser(<VisitorsInputRow onAdd={onAdd} />);

    const input = screen.getByPlaceholderText(/nome do visitante/i);
    await user.type(input, '  Visitante 1  ');
    await user.click(screen.getByRole('button', { name: /adicionar/i }));

    expect(onAdd).toHaveBeenCalledWith('Visitante 1');
    expect(input).toHaveValue('');
  });

  it('adiciona visitante com Enter e ignora vazio', async () => {
    const onAdd = vi.fn();
    const { user } = renderWithUser(<VisitorsInputRow onAdd={onAdd} />);
    const input = screen.getByPlaceholderText(/nome do visitante/i);

    await user.keyboard('{Enter}');
    expect(onAdd).not.toHaveBeenCalled();

    await user.type(input, 'Outro{Enter}');
    expect(onAdd).toHaveBeenCalledWith('Outro');
  });
});
