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
  const handleBlockedNavigation = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const anchor = target.closest('a[href]');

    if (!anchor) {
      return;
    }

    const href = anchor.getAttribute('href') ?? '';
    const isExternal =
      href.startsWith('http://') || href.startsWith('https://') || href.startsWith('javascript:');

    if (isExternal || anchor.getAttribute('target') === '_blank') {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <main className="main" onClickCapture={handleBlockedNavigation}>
      <PreviewActions sessionType={sessionType} zoom={zoom} onZoomChange={onZoomChange} />

      <DocumentPreview zoom={zoom} data={dataDocument} />
    </main>
  );
}
