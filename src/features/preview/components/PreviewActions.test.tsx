import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithUser } from '../../../test/render';
import { PreviewActions } from './PreviewActions';

describe('PreviewActions', () => {
  it('controla o zoom e respeita o limite minimo', async () => {
    const onZoomChange = vi.fn();
    const { user } = renderWithUser(
      <PreviewActions sessionType="economica" zoom={0.5} onZoomChange={onZoomChange} />,
    );

    await user.click(screen.getByRole('button', { name: /zoom -/i }));
    await user.click(screen.getByRole('button', { name: /zoom \+/i }));
    await user.click(screen.getByRole('button', { name: /100%/i }));

    expect(onZoomChange).toHaveBeenNthCalledWith(1, 0.5);
    expect(onZoomChange).toHaveBeenNthCalledWith(2, 0.6);
    expect(onZoomChange).toHaveBeenNthCalledWith(3, 1);
  });

  it('mostra botao de alternar sessao quando handler existe', () => {
    renderWithUser(
      <PreviewActions
        sessionType="magna"
        zoom={1}
        onZoomChange={vi.fn()}
        onCycleSessionType={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /alternar sessão/i })).toBeInTheDocument();
    expect(screen.getByText(/sessão magna/i)).toBeInTheDocument();
  });
});
