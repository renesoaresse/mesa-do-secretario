import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithUser } from '../../test/render';
import { SidebarDrawer } from './SidebarDrawer';

describe('SidebarDrawer', () => {
  it('abre e fecha por clique e teclado', async () => {
    const { user } = renderWithUser(
      <SidebarDrawer title="Sessão">
        <div>Conteudo interno</div>
      </SidebarDrawer>,
    );

    const header = screen.getByRole('button', { name: /sessão/i });
    expect(header).toHaveAttribute('aria-expanded', 'true');

    await user.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'false');

    header.focus();
    await user.keyboard('{Enter}');
    expect(header).toHaveAttribute('aria-expanded', 'true');
  });
});
