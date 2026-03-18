import React from 'react';
import type { DocumentDraft, Documento, StatusState } from '../../../types/ata';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { StatusMessage } from '../../../components/ui/StatusMessage';
import { PdfUploadButton } from './PdfUploadButton';
import { DocumentForm } from './DocumentForm';
import { DocumentList } from './DocumentList';

type Props = {
  onPickPdf: (file: File) => void;

  draft: DocumentDraft;
  onDraftChange: (patch: Partial<DocumentDraft>) => void;
  onAddDocument: () => void;

  items: Documento[];
  onRemoveDocument: (id: string) => void;

  status: StatusState;
  disabled?: boolean;
};

export function DocumentsPanel({
  onPickPdf,
  draft,
  onDraftChange,
  onAddDocument,
  items,
  onRemoveDocument,
  status,
  disabled,
}: Props) {
  return (
    <section>
      <SectionTitle title="Documentos PDF" />

      <div style={{ marginBottom: 10 }}>
        <PdfUploadButton onPickFile={onPickPdf} disabled={disabled} />
      </div>

      <DocumentForm
        draft={draft}
        onDraftChange={onDraftChange}
        onAdd={onAddDocument}
        disabled={disabled}
      />

      <StatusMessage status={status} />

      <DocumentList items={items} onRemove={onRemoveDocument} />
    </section>
  );
}
