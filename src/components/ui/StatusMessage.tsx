import React from 'react';
import type { StatusState } from '../../types/ata';

type Props = {
  status: StatusState;
};

export function StatusMessage({ status }: Props) {
  if (!status) return null;

  return (
    <div className={`status ${status.kind}`} role="status" aria-live="polite">
      {status.text}
    </div>
  );
}
