import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithUser } from '../../../test/render';
import { VisitorsPanel } from './VisitorsPanel';

describe('VisitorsPanel', () => {
  it('integra input e lista no mesmo painel', () => {
    renderWithUser(<VisitorsPanel items={['Visitante 1']} onAdd={vi.fn()} onRemove={vi.fn()} />);

    expect(screen.getByPlaceholderText(/nome do visitante/i)).toBeInTheDocument();
    expect(screen.getByText('Visitante 1')).toBeInTheDocument();
  });
});
