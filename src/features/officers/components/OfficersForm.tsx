import React from 'react';
import type { Officers } from '../../../types/ata';
import { FormGroup } from '../../../components/ui/FormGroup';
import { TextInput } from '../../../components/ui/TextInput';

type Props = {
  value: Officers;
  onChange: (patch: Partial<Officers>) => void;
};

export function OfficersForm({ value, onChange }: Props) {
  return (
    <section>
      <FormGroup label="Venerável Mestre">
        <TextInput value={value.vm} onChange={(e) => onChange({ vm: e.target.value })} />
      </FormGroup>

      <div style={{ height: 10 }} />

      <FormGroup label="1º Vigilante">
        <TextInput value={value.vig1} onChange={(e) => onChange({ vig1: e.target.value })} />
      </FormGroup>

      <div style={{ height: 10 }} />

      <FormGroup label="2º Vigilante">
        <TextInput value={value.vig2} onChange={(e) => onChange({ vig2: e.target.value })} />
      </FormGroup>

      <div style={{ height: 10 }} />

      <FormGroup label="Orador">
        <TextInput value={value.or} onChange={(e) => onChange({ or: e.target.value })} />
      </FormGroup>

      <div style={{ height: 10 }} />

      <FormGroup label="Secretário">
        <TextInput value={value.sec} onChange={(e) => onChange({ sec: e.target.value })} />
      </FormGroup>
    </section>
  );
}
