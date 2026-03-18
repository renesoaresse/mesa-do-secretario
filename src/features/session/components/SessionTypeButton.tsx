import React from 'react';
import type { SessionType } from '../../../types/ata';

type Props = {
  type: SessionType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (type: SessionType) => void;
};

export function SessionTypeButton({ type, title, subtitle, icon, isActive, onClick }: Props) {
  return (
    <button
      type="button"
      className={`session-card ${isActive ? 'session-card--active' : ''}`}
      onClick={() => onClick(type)}
      aria-pressed={isActive}
    >
      <div className="session-card__icon" aria-hidden>
        {icon}
      </div>

      <div className="session-card__title">{title}</div>
      <div className="session-card__subtitle">{subtitle}</div>
    </button>
  );
}
