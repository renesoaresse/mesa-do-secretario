import React from 'react';
import { Button } from './Button';

type Props = {
  /** Presente apenas no desktop: volta para a tela principal. */
  onBack?: () => void;
  onPrint: () => void;
  onSave: () => void;
  saving?: boolean;
  /** Ação opcional renderizada entre "Imprimir" e "Salvar". */
  pdfAction?: React.ReactNode;
};

export function FooterActions({ onBack, onPrint, onSave, saving, pdfAction }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
      {onBack && (
        <Button type="button" onClick={onBack}>
          Voltar
        </Button>
      )}
      <Button type="button" onClick={onPrint}>
        Imprimir
      </Button>
      {pdfAction}
      <Button type="button" variant="primary" onClick={onSave} disabled={saving}>
        {saving ? 'Salvando...' : 'Salvar'}
      </Button>
    </div>
  );
}
