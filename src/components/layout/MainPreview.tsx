import React from 'react';
import type { PreviewData, SessionType } from '../../types/ata';
import { PreviewActions } from '../../features/preview/components/PreviewActions';
import { DocumentPreview } from '../../features/preview/components/DocumentPreview';

type MainPreviewProps = {
  sessionType: SessionType;
  zoom: number;
  onZoomChange: (next: number) => void;
  dataDocument: PreviewData;
};

export function MainPreview({ sessionType, zoom, onZoomChange, dataDocument }: MainPreviewProps) {
  return (
    <main className="main">
      <PreviewActions sessionType={sessionType} zoom={zoom} onZoomChange={onZoomChange} />

      <DocumentPreview zoom={zoom} data={dataDocument} />
    </main>
  );
}
