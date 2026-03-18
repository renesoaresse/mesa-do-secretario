import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { makeDocumentDraft, makeDocumento } from '../../../test/factories';
import { renderWithUser } from '../../../test/render';
import { DocumentsPanel } from './DocumentsPanel';

describe('DocumentsPanel', () => {
  it('renderiza secao, status e lista', () => {
    renderWithUser(
      <DocumentsPanel
        onPickPdf={vi.fn()}
        draft={makeDocumentDraft()}
        onDraftChange={vi.fn()}
        onAddDocument={vi.fn()}
        items={[makeDocumento({ subject: 'Circular' })]}
        onRemoveDocument={vi.fn()}
        status={{ kind: 'info', text: 'Status atual' }}
      />,
    );

    expect(screen.getByText(/documentos pdf/i)).toBeInTheDocument();
    expect(screen.getByText('Status atual')).toBeInTheDocument();
    expect(screen.getByText('Circular')).toBeInTheDocument();
  });

  it('encaminha a acao de adicionar documento', async () => {
    const onAddDocument = vi.fn();
    const { user } = renderWithUser(
      <DocumentsPanel
        onPickPdf={vi.fn()}
        draft={makeDocumentDraft()}
        onDraftChange={vi.fn()}
        onAddDocument={onAddDocument}
        items={[]}
        onRemoveDocument={vi.fn()}
        status={null}
      />,
    );

    await user.click(screen.getByRole('button', { name: /adicionar/i }));
    expect(onAddDocument).toHaveBeenCalledTimes(1);
  });
});
