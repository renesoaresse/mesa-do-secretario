import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithUser } from '../../../test/render';
import { SessionTypeButton } from './SessionTypeButton';

describe('SessionTypeButton', () => {
  it('dispara onClick com o tipo informado', async () => {
    const onClick = vi.fn();
    const { user } = renderWithUser(
      <SessionTypeButton
        type="magna"
        title="Sessão Magna"
        subtitle="Solene"
        icon={<span>👑</span>}
        isActive={false}
        onClick={onClick}
      />,
    );

    await user.click(screen.getByRole('button', { name: /sessão magna/i }));
    expect(onClick).toHaveBeenCalledWith('magna');
  });

  it('reflete o estado ativo com aria-pressed', () => {
    renderWithUser(
      <SessionTypeButton
        type="economica"
        title="Sessão Econômica"
        subtitle="Regular"
        icon={<span>🪙</span>}
        isActive
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /sessão econômica/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
