import React from "react";
import type { SessionType } from "../../types/ata";
import { SessionTypeButton } from "./SessionTypeButton";

type Props = {
  value: SessionType;
  onChange: (next: SessionType) => void;
};

function getTitle(type: SessionType) {
  switch (type) {
    case "economica":
      return "Sessão Econômica";
    case "magna":
      return "Sessão Magna";
    case "conjunta":
      return "Sessão Conjunta";
  }
}

function getSubtitle(type: SessionType) {
  switch (type) {
    case "economica":
      return "Regular";
    case "magna":
      return "Solene";
    case "conjunta":
      return "Especial";
  }
}

function getIcon(type: SessionType) {
  // Emojis funcionam offline, Electron-friendly.
  // Depois podemos trocar por SVG inline se você quiser.
  switch (type) {
    case "economica":
      return "🪙";
    case "magna":
      return "👑";
    case "conjunta":
      return "🤝";
  }
}

export function SessionTypeSelector({ value, onChange }: Props) {
  return (
    <section>
      <div className="session-card-grid">
        {(["economica", "magna", "conjunta"] as SessionType[]).map((type) => (
          <SessionTypeButton
            key={type}
            type={type}
            title={getTitle(type)}
            subtitle={getSubtitle(type)}
            icon={<span>{getIcon(type)}</span>}
            isActive={value === type}
            onClick={onChange}
          />
        ))}
      </div>
    </section>
  );
}
