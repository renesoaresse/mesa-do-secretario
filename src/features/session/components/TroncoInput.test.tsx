import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithUser } from '../../../test/render';
import { TroncoInput } from './TroncoInput';

describe('TroncoInput', () => {
  it('emite o valor digitado quando a sessao nao esta suprimida', () => {
    const onChange = vi.fn();
    renderWithUser(
      <TroncoInput value={10} onChange={onChange} suprimido={false} onSuprimidoChange={vi.fn()} />,
    );

    fireEvent.change(screen.getByLabelText('Valor (R$)'), { target: { value: '25' } });

    expect(onChange).toHaveBeenCalledWith(25);
  });

  it('esconde o valor quando suprimido e emite a mudanca do checkbox', () => {
    const onSuprimidoChange = vi.fn();
    const { rerender } = renderWithUser(
      <TroncoInput
        value={10}
        onChange={vi.fn()}
        suprimido={false}
        onSuprimidoChange={onSuprimidoChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Suprimido'));
    expect(onSuprimidoChange).toHaveBeenCalledWith(true);

    rerender(
      <TroncoInput value={10} onChange={vi.fn()} suprimido onSuprimidoChange={onSuprimidoChange} />,
    );

    expect(screen.queryByLabelText('Valor (R$)')).not.toBeInTheDocument();
  });
});
