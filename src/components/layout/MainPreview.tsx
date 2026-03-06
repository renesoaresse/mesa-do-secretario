import React from "react";
import type { PreviewData, SessionType } from "../../types/ata";
import { PreviewActions } from "../preview/PreviewActions";
import { DocumentPreview } from "../preview/DocumentPreview";

type MainPreviewProps = {
  sessionType: SessionType;
  zoom: number;
  onZoomChange: (next: number) => void;
  dataDocument: PreviewData;
};

export function MainPreview({
  sessionType,
  zoom,
  onZoomChange,
  dataDocument,
}: MainPreviewProps) {
  return (
    <main className="main">
      <PreviewActions
        sessionType={sessionType}
        zoom={zoom}
        onZoomChange={onZoomChange}
      />

      <DocumentPreview 
        zoom={zoom}
        data={dataDocument} 
      />
    </main>
  );
}
