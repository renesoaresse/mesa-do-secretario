import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeDocumento } from '../../../test/factories';
import { renderWithUser } from '../../../test/render';
import { DocumentList } from './DocumentList';

describe('DocumentList', () => {
  it('mostra fallback quando vazio', () => {
    renderWithUser(<DocumentList items={[]} onRemove={vi.fn()} />);
    expect(screen.getByText(/nenhum documento adicionado/i)).toBeInTheDocument();
  });

  it('renderiza itens e remove pelo id', async () => {
    const onRemove = vi.fn();
    const { user } = renderWithUser(
      <DocumentList
        items={[makeDocumento({ id: 'doc-77', subject: 'Convite' })]}
        onRemove={onRemove}
      />,
    );

    expect(screen.getByText('Convite')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /remover/i }));
    expect(onRemove).toHaveBeenCalledWith('doc-77');
  });
});
