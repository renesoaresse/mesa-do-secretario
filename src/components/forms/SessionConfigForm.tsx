import React from "react";
import type { Grau, SessionConfig } from "../../types/ata";
import { FormGroup } from "../ui/FormGroup";
import { FormRow } from "../ui/FormRow";
import { Select } from "../ui/Select";
import { TextInput } from "../ui/TextInput";

type Props = {
  value: SessionConfig;
  onChange: (patch: Partial<SessionConfig>) => void;
};

const GRAUS: Grau[] = ["Aprendiz", "Companheiro", "Mestre"];

export function SessionConfigForm({ value, onChange }: Props) {
  return (
    <section>
      <FormRow>
        <FormGroup label="Grau">
          <Select
            value={value.grau}
            onChange={(e) => onChange({ grau: e.target.value as Grau })}
          >
            {GRAUS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup label="Nº Sessão">
          <TextInput
            type="number"
            value={value.numSessao}
            onChange={(e) => onChange({ numSessao: Number(e.target.value) })}
          />
        </FormGroup>
      </FormRow>

      <div style={{ height: 10 }} />

      <FormRow>
        <FormGroup label="Data">
          <TextInput
            type="date"
            value={value.dataISO}
            onChange={(e) => onChange({ dataISO: e.target.value })}
          />
        </FormGroup>

        <FormGroup label="Nº Presença">
          <TextInput
            type="number"
            value={value.numPresenca}
            onChange={(e) => onChange({ numPresenca: Number(e.target.value) })}
          />
        </FormGroup>
      </FormRow>

      <div style={{ height: 10 }} />

      <FormRow>
        <FormGroup label="Hora Início">
          <TextInput
            type="time"
            value={value.horaInicio}
            onChange={(e) => onChange({ horaInicio: e.target.value })}
          />
        </FormGroup>

        <FormGroup label="Hora Encerramento">
          <TextInput
            type="time"
            value={value.horaEnc}
            onChange={(e) => onChange({ horaEnc: e.target.value })}
          />
        </FormGroup>
      </FormRow>
    </section>
  );
}
