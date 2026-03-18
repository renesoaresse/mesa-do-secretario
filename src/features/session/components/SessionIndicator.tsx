import React from 'react';
import type { SessionType } from '../../../types/ata';

type SessionIndicatorProps = {
  sessionType: SessionType;
};

export function SessionIndicator({ sessionType }: SessionIndicatorProps) {
  return (
    <div className="session-indicator" aria-label="Indicador de tipo de sessão">
      <span className="badge badge--session">{getSessionLabel(sessionType)}</span>
    </div>
  );
}

function getSessionLabel(type: SessionType) {
  switch (type) {
    case 'economica':
      return 'Sessão Econômica';
    case 'magna':
      return 'Sessão Magna';
    case 'conjunta':
      return 'Sessão Conjunta';
  }
}
