import React from 'react';
import type { Visitor } from '../../../types/ata';

type Props = {
  items: Visitor[];
  onRemove: (index: number) => void;
};

export function VisitorList({ items, onRemove }: Props) {
  if (items.length === 0) {
    return (
      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.7 }}>Nenhum visitante adicionado.</div>
    );
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'grid', gap: 8 }}>
      {items.map((visitor, idx) => (
        <li key={`${visitor.nome}-${idx}`} className="dark-list-item">
          <div className="dark-list-text">
            <span>{visitor.nome}</span>
            {visitor.lojaNome && <small className="visitor-loja-sub">{visitor.lojaNome}</small>}
          </div>
          <button type="button" className="mini-btn" onClick={() => onRemove(idx)}>
            Remover
          </button>
        </li>
      ))}
    </ul>
  );
}
