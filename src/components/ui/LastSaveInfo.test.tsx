import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LastSaveInfo } from './LastSaveInfo';

describe('LastSaveInfo', () => {
  it('mostra traço quando a data nao existe', () => {
    render(<LastSaveInfo lastSavedAt={null} />);
    expect(screen.getByText(/última alteração: —/i)).toBeInTheDocument();
  });

  it('formata a data recebida', () => {
    render(<LastSaveInfo lastSavedAt={new Date('2026-03-18T19:45:00')} />);
    expect(screen.getByText('Última alteração: 18/03/2026 19:45')).toBeInTheDocument();
  });
});
