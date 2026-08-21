import React, { useEffect } from 'react';

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  /** Em false, o modal só sai pelas ações do próprio conteúdo: sem ✕, Esc ou clique fora. */
  dismissible?: boolean;
  children: React.ReactNode;
};

export function Modal({ open, title, onClose, dismissible = true, children }: Props) {
  useEffect(() => {
    if (!open || !dismissible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay">
      {dismissible ? (
        <button type="button" className="modal-backdrop" aria-label="Fechar" onClick={onClose} />
      ) : null}
      <div className="modal-panel" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          {dismissible ? (
            <button type="button" className="mini-btn" onClick={onClose} aria-label="Fechar">
              ✕
            </button>
          ) : null}
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
