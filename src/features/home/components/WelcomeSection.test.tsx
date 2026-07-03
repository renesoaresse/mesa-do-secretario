import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WelcomeSection } from './WelcomeSection';

describe('WelcomeSection', () => {
  it('renderiza titulo e versao', () => {
    render(<WelcomeSection version="0.3.0" />);
    expect(screen.getByText('Mesa do Secretário')).toBeInTheDocument();
    expect(screen.getByText('v0.3.0')).toBeInTheDocument();
  });

  it('renderiza subtitulo', () => {
    render(<WelcomeSection version="0.3.0" />);
    expect(screen.getByText('Gerador de Atas Maçônicas')).toBeInTheDocument();
  });
});
