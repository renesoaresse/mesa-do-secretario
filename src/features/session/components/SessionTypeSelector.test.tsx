import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithUser } from '../../../test/render';
import { SessionTypeSelector } from './SessionTypeSelector';

describe('SessionTypeSelector', () => {
  it('renderiza as opcoes de sessao', () => {
    renderWithUser(<SessionTypeSelector value="economica" onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /sessão econômica/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sessão magna/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sessão conjunta/i })).not.toBeInTheDocument();
  });

  it('chama onChange ao selecionar outra opcao', async () => {
    const onChange = vi.fn();
    const { user } = renderWithUser(<SessionTypeSelector value="economica" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /sessão magna/i }));
    expect(onChange).toHaveBeenCalledWith('magna');
  });
});
