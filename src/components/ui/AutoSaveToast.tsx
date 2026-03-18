import React from 'react';

export function AutoSaveToast({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return <div className="autosave-toast">alterações salvas automaticamente</div>;
}
