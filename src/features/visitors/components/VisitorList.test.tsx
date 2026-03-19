import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithUser } from '../../../test/render';
import { VisitorList } from './VisitorList';

describe('VisitorList', () => {
  it('mostra fallback quando nao ha visitantes', () => {
    renderWithUser(<VisitorList items={[]} onRemove={vi.fn()} />);
    expect(screen.getByText(/nenhum visitante adicionado/i)).toBeInTheDocument();
  });

  it('renderiza visitantes e remove pelo indice', async () => {
    const onRemove = vi.fn();
    const { user } = renderWithUser(
      <VisitorList items={['Visitante A', 'Visitante B']} onRemove={onRemove} />,
    );

    await user.click(screen.getAllByRole('button', { name: /remover/i })[1]);
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
