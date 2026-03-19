import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { FooterActions } from './FooterActions';
import { renderWithUser } from '../../test/render';

describe('FooterActions', () => {
  it('dispara onPrint e onSave ao clicar nos botoes', async () => {
    const onPrint = vi.fn();
    const onSave = vi.fn();
    const { user } = renderWithUser(<FooterActions onPrint={onPrint} onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: /imprimir/i }));
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(onPrint).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('mostra estado salvando e desabilita o botao de salvar', () => {
    renderWithUser(<FooterActions onPrint={vi.fn()} onSave={vi.fn()} saving />);
    const button = screen.getByRole('button', { name: /salvando/i });
    expect(button).toBeDisabled();
  });
});
