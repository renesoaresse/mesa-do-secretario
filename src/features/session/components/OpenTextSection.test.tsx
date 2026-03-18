import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithUser } from '../../../test/render';
import { OpenTextSection } from './OpenTextSection';

describe('OpenTextSection', () => {
  it('renderiza label e placeholder e propaga onChange', () => {
    const onChange = vi.fn();
    renderWithUser(
      <OpenTextSection
        label="Balaustre"
        placeholder="Digite aqui"
        value="Texto inicial"
        onChange={onChange}
      />,
    );

    const textarea = screen.getByPlaceholderText('Digite aqui');
    fireEvent.change(textarea, { target: { value: 'Novo texto' } });

    expect(screen.getByText('Balaustre')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith('Novo texto');
  });
});
