import React from "react";

type Props = {
  lastSavedAt: Date | null;
};

export function LastSaveInfo({ lastSavedAt }: Props) {
  const text = lastSavedAt
    ? `Última alteração: ${formatDateTime(lastSavedAt)}`
    : "Última alteração: —";

  return (
    <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
      {text}
    </div>
  );
}

function formatDateTime(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
