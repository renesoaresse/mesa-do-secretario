import React from 'react';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { FormGroup } from '../../../components/ui/FormGroup';
import { TextInput } from '../../../components/ui/TextInput';

type Props = {
  value: number;
  onChange: (n: number) => void;
};

export function TroncoInput({ value, onChange }: Props) {
  return (
    <section>
      <SectionTitle title="Tronco de Beneficência" />
      <FormGroup label="Valor (R$)">
        <TextInput type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
      </FormGroup>
    </section>
  );
}
