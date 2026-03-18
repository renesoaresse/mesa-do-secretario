import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithUser } from '../../../test/render';
import { PalavraColuna } from './PalavraColuna';

describe('PalavraColuna', () => {
  it('renderiza titulo, ajuda e propaga alteracao', () => {
    const onChange = vi.fn();
    renderWithUser(
      <PalavraColuna
        variant="sul"
        title="Coluna do Sul"
        help="(Companheiros)"
        placeholder="Descreva"
        value="Texto"
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Descreva'), { target: { value: 'Novo texto' } });

    expect(screen.getByText('Coluna do Sul')).toBeInTheDocument();
    expect(screen.getByText('(Companheiros)')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith('Novo texto');
  });
});
