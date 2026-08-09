import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { PdfPasswordModal } from './PdfPasswordModal';
import { isPdfExportAvailable } from '../../../services/pdfExport';

type Props = {
  fileName: string;
};

export function PdfExportAction({ fileName }: Props) {
  const [open, setOpen] = useState(false);

  // A geração depende do printToPDF do Electron. Na versão web o botão nem aparece.
  if (!isPdfExportAvailable()) return null;

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        PDF com senha
      </Button>

      {/* Remontado a cada abertura para que nenhum resquício de senha sobreviva. */}
      {open ? <PdfPasswordModal open fileName={fileName} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
