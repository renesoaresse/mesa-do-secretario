import React from 'react';
import type { PalavraBemOrdem } from '../../../types/ata';
import { PalavraColuna } from './PalavraColuna';
import { Checkbox } from '../../../components/ui/Checkbox';

type Props = {
  value: PalavraBemOrdem;
  onChange: (patch: Partial<PalavraBemOrdem>) => void;
  suprimido: boolean;
  onSuprimidoChange: (suprimido: boolean) => void;
};

export function PalavraBemDaOrdemPanel({ value, onChange, suprimido, onSuprimidoChange }: Props) {
  return (
    <section className="pbo">
      <Checkbox label="Suprimido" checked={suprimido} onChange={onSuprimidoChange} />

      {/* Suprimido: o balaústre registra apenas a supressão, sem as colunas. */}
      {suprimido ? null : (
        <div className="pbo-stack" style={{ marginTop: 10 }}>
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
      )}
    </section>
  );
}
