import React from 'react';
import type { MagnaFields } from '../../../types/ata';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { FormGroup } from '../../../components/ui/FormGroup';
import { TextInput } from '../../../components/ui/TextInput';

type Props = {
  visible: boolean;
  value: MagnaFields;
  onChange: (patch: Partial<MagnaFields>) => void;
};

export function MagnaFieldsForm({ visible, value, onChange }: Props) {
  if (!visible) return null;

  return (
    <section>
      <SectionTitle
        title="Campos da Sessão Magna"
        subtitle="Aparece somente quando a sessão for Magna"
      />

      <FormGroup label="Tema">
        <TextInput value={value.tema} onChange={(e) => onChange({ tema: e.target.value })} />
      </FormGroup>

      <div style={{ height: 10 }} />

      <FormGroup label="Orador Convidado">
        <TextInput
          value={value.oradorConvidado}
          onChange={(e) => onChange({ oradorConvidado: e.target.value })}
        />
      </FormGroup>

      <div style={{ height: 10 }} />

      <FormGroup label="Autoridades">
        <TextInput
          value={value.autoridades}
          onChange={(e) => onChange({ autoridades: e.target.value })}
        />
      </FormGroup>

      <div style={{ height: 10 }} />

      <FormGroup label="Ato Especial">
        <TextInput
          value={value.atoEspecial}
          onChange={(e) => onChange({ atoEspecial: e.target.value })}
        />
      </FormGroup>
    </section>
  );
}
