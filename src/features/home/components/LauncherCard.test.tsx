import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LauncherCard } from './LauncherCard';
import { Router, Route } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

describe('LauncherCard', () => {
  it('renderiza botao Nova Ata', () => {
    renderWithRouter(<LauncherCard />);
    expect(screen.getByText('Nova Ata')).toBeInTheDocument();
  });
});

function renderWithRouter(ui: React.ReactElement) {
  return render(ui, {
    wrapper: function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <Router hook={useHashLocation}>
          <Route path="/">{children}</Route>
        </Router>
      );
    },
  });
}
