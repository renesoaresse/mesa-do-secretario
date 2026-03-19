import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('aplica classe base e props recebidas', () => {
    render(<TextInput aria-label="nome" value="Teste" readOnly />);
    const input = screen.getByLabelText('nome');
    expect(input).toHaveClass('control');
    expect(input).toHaveValue('Teste');
  });

  it('propaga onChange', () => {
    const onChange = vi.fn();
    render(<TextInput aria-label="nome" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('nome'), { target: { value: 'Novo' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
