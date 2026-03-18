import React from 'react';
import type { Documento } from '../../../types/ata';

type Props = {
  items: Documento[];
  onRemove: (id: string) => void;
};

export function DocumentList({ items, onRemove }: Props) {
  if (items.length === 0) {
    return (
      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.7 }}>Nenhum documento adicionado.</div>
    );
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'grid', gap: 8 }}>
      {items.map((doc) => (
        <li key={doc.id} className="dark-list-item" style={{ alignItems: 'flex-start' }}>
          <div style={{ display: 'grid', gap: 4 }}>
            <div style={{ fontSize: 12, opacity: 0.85 }}>{doc.type}</div>
            <div style={{ fontSize: 13 }}>
              <strong>{doc.number || '—'}</strong> • {doc.origin || '—'}
            </div>
            <div style={{ fontSize: 13 }}>{doc.subject || '—'}</div>
          </div>

          <button type="button" className="mini-btn" onClick={() => onRemove(doc.id)}>
            Remover
          </button>
        </li>
      ))}
    </ul>
  );
}
