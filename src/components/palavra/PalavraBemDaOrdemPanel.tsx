import React from "react";
import type { PalavraBemOrdem } from "../../types/ata";
import { PalavraColuna } from "./PalavraColuna";

type Props = {
  value: PalavraBemOrdem;
  onChange: (patch: Partial<PalavraBemOrdem>) => void;
};

export function PalavraBemDaOrdemPanel({ value, onChange }: Props) {
  return (
    <section className="pbo">
      <div className="pbo-stack">
        <PalavraColuna
          variant="sul"
          title="Coluna do Sul"
          help="(Companheiros)"
          placeholder="Descreva as intervenções da Coluna do Sul."
          value={value.sul}
          onChange={(v) => onChange({ sul: v })}
        />

        <PalavraColuna
          variant="norte"
          title="Coluna do Norte"
          help="(Aprendizes)"
          placeholder="Descreva as intervenções da Coluna do Norte."
          value={value.norte}
          onChange={(v) => onChange({ norte: v })}
        />

        <PalavraColuna
          variant="oriente"
          title="Coluna do Oriente"
          help="(Mestres)"
          placeholder="Descreva as intervenções da Coluna do Oriente."
          value={value.oriente}
          onChange={(v) => onChange({ oriente: v })}
        />
      </div>
    </section>
  );
}
