import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionTitle } from './SectionTitle';

describe('SectionTitle', () => {
  it('renderiza o titulo sempre', () => {
    render(<SectionTitle title="Titulo" />);
    expect(screen.getByRole('heading', { name: 'Titulo' })).toBeInTheDocument();
  });

  it('renderiza o subtitulo quando informado', () => {
    render(<SectionTitle title="Titulo" subtitle="Subtitulo" />);
    expect(screen.getByText('Subtitulo')).toBeInTheDocument();
  });
});
