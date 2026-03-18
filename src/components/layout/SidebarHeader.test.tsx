import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SidebarHeader } from './SidebarHeader';

describe('SidebarHeader', () => {
  it('renderiza titulo sempre e badge/contador quando informados', () => {
    render(
      <SidebarHeader
        title="Gerador de Ata"
        badgeText={<span>Badge</span>}
        counterText="Contador: 42"
      />,
    );

    expect(screen.getByRole('heading', { name: /gerador de ata/i })).toBeInTheDocument();
    expect(screen.getByText('Badge')).toBeInTheDocument();
    expect(screen.getByText('Contador: 42')).toBeInTheDocument();
  });
});
