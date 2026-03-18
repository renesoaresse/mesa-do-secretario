import React from 'react';
import { FormGroup } from '../../../components/ui/FormGroup';
import { Textarea } from '../../../components/ui/Textarea';

type Props = {
  value: string;
  onChange: (s: string) => void;
};

export function OrdemDiaTextarea({ value, onChange }: Props) {
  return (
    <section>
      <FormGroup label="Texto">
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} />
      </FormGroup>
    </section>
  );
}
