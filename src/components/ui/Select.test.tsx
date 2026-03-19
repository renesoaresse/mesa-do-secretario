import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

describe('Select', () => {
  it('aplica as classes base e props recebidas', () => {
    render(
      <Select aria-label="grau" value="Aprendiz" disabled>
        <option value="Aprendiz">Aprendiz</option>
      </Select>,
    );

    const select = screen.getByLabelText('grau');
    expect(select).toHaveClass('control', 'control-select');
    expect(select).toBeDisabled();
  });

  it('propaga onChange', () => {
    const onChange = vi.fn();
    render(
      <Select aria-label="grau" defaultValue="Aprendiz" onChange={onChange}>
        <option value="Aprendiz">Aprendiz</option>
        <option value="Mestre">Mestre</option>
      </Select>,
    );

    fireEvent.change(screen.getByLabelText('grau'), { target: { value: 'Mestre' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
