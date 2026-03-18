import React from 'react';

type Props = {
  items: string[];
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
      {items.map((name, idx) => (
        <li key={`${name}-${idx}`} className="dark-list-item">
          <span className="dark-list-text">{name}</span>
          <button type="button" className="mini-btn" onClick={() => onRemove(idx)}>
            Remover
          </button>
        </li>
      ))}
    </ul>
  );
}
