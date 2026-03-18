import React, { useRef } from 'react';
import { Button } from '../../../components/ui/Button';

type Props = {
  onPickFile: (file: File) => void;
  accept?: string;
  disabled?: boolean;
};

export function PdfUploadButton({ onPickFile, accept = 'application/pdf', disabled }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <Button type="button" onClick={() => inputRef.current?.click()} disabled={disabled}>
        Selecionar PDF
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPickFile(file);
          // reset pra permitir escolher o mesmo arquivo de novo
          e.currentTarget.value = '';
        }}
      />
    </div>
  );
}
