import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('aplica classes base e placeholder', () => {
    render(<Textarea aria-label="texto" placeholder="Digite aqui" value="abc" readOnly />);
    const textarea = screen.getByLabelText('texto');
    expect(textarea).toHaveClass('control', 'control-textarea');
    expect(textarea).toHaveAttribute('placeholder', 'Digite aqui');
  });

  it('propaga onChange', () => {
    const onChange = vi.fn();
    render(<Textarea aria-label="texto" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('texto'), { target: { value: 'Novo texto' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
