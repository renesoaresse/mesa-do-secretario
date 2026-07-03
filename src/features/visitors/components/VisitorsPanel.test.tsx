import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithUser } from '../../../test/render';
import { makePreviewData, makeVisitor } from '../../../test/factories';
import { VisitorsPanel } from './VisitorsPanel';

const lojaConfig = makePreviewData().lojaConfig;

describe('VisitorsPanel', () => {
  it('integra input e lista no mesmo painel', () => {
    renderWithUser(
      <VisitorsPanel
        items={[makeVisitor({ nome: 'Visitante 1' })]}
        lojas={[]}
        lojaConfig={lojaConfig}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        onCreateLoja={vi.fn()}
      />,
    );

    expect(screen.getByPlaceholderText(/nome do visitante/i)).toBeInTheDocument();
    expect(screen.getByText('Visitante 1')).toBeInTheDocument();
  });
});
