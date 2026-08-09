import React from 'react';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { FormGroup } from '../../../components/ui/FormGroup';
import { TextInput } from '../../../components/ui/TextInput';
import { Checkbox } from '../../../components/ui/Checkbox';

type Props = {
  value: number;
  onChange: (n: number) => void;
  suprimido: boolean;
  onSuprimidoChange: (suprimido: boolean) => void;
};

export function TroncoInput({ value, onChange, suprimido, onSuprimidoChange }: Props) {
  return (
    <section>
      <SectionTitle title="Tronco de Beneficência" />

      <Checkbox label="Suprimido" checked={suprimido} onChange={onSuprimidoChange} />

      {/* Suprimido: o balaústre registra apenas a supressão, sem valor arrecadado. */}
      {suprimido ? null : (
        <>
          <div style={{ height: 10 }} />
          <FormGroup label="Valor (R$)">
            <TextInput
              type="number"
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
            />
          </FormGroup>
        </>
      )}
    </section>
  );
}
