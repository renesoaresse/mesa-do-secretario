import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppLayout } from './AppLayout';

describe('AppLayout', () => {
  it('renderiza sidebar e main recebidos', () => {
    render(<AppLayout sidebar={<div>Sidebar</div>} main={<div>Main</div>} />);
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
  });
});
