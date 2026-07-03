import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomeScreen } from './HomeScreen';
import { Router, Route } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

describe('HomeScreen', () => {
  it('renderiza titulo e versao', () => {
    renderWithRouter(<HomeScreen />);
    expect(screen.getByText('Mesa do Secretário')).toBeInTheDocument();
  });

  it('renderiza botao Nova Ata', () => {
    renderWithRouter(<HomeScreen />);
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
