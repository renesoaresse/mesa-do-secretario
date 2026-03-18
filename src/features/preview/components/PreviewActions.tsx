import React from 'react';
import type { SessionType } from '../../../types/ata';
import { Button } from '../../../components/ui/Button';
import { SessionIndicator } from '../../session/components/SessionIndicator';

type Props = {
  sessionType: SessionType;
  zoom: number; // 1 = 100%
  onZoomChange: (next: number) => void;
  onCycleSessionType?: () => void;
};

export function PreviewActions({ sessionType, zoom, onZoomChange, onCycleSessionType }: Props) {
  const zoomIn = () => onZoomChange(round2(zoom + 0.1));
  const zoomOut = () => onZoomChange(round2(Math.max(0.5, zoom - 0.1)));
  const zoomReset = () => onZoomChange(1);

  return (
    <div className="preview-toolbar" role="group" aria-label="Ações do preview">
      <Button type="button" onClick={zoomOut}>
        Zoom -
      </Button>
      <Button type="button" onClick={zoomIn}>
        Zoom +
      </Button>
      <Button type="button" onClick={zoomReset}>
        100%
      </Button>

      <span className="session-badge" title="Tipo de sessão">
        <SessionIndicator sessionType={sessionType} />
      </span>

      <div style={{ flex: 1 }} />

      {onCycleSessionType ? (
        <Button type="button" onClick={onCycleSessionType}>
          Alternar sessão
        </Button>
      ) : null}
    </div>
  );
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
