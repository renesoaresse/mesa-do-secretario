import React from "react";
import type { DocumentDraft, DocumentType } from "../../types/ata";
import { FormGroup } from "../ui/FormGroup";
import { FormRow } from "../ui/FormRow";
import { Select } from "../ui/Select";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";

type Props = {
  draft: DocumentDraft;
  onDraftChange: (patch: Partial<DocumentDraft>) => void;
  onAdd: () => void;
  disabled?: boolean;
};

const TYPES: DocumentType[] = [
  "Prancha/Edital",
  "Ato/Decreto",
  "Ofício",
  "Comunicação",
];

export function DocumentForm({ draft, onDraftChange, onAdd, disabled }: Props) {
  return (
    <div>
      <FormGroup label="Tipo">
        <Select
          value={draft.type}
          onChange={(e) => onDraftChange({ type: e.target.value as DocumentType })}
          disabled={disabled}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </FormGroup>

      <div style={{ height: 10 }} />

      <FormRow>
        <FormGroup label="Número">
          <TextInput
            value={draft.number}
            onChange={(e) => onDraftChange({ number: e.target.value })}
            disabled={disabled}
          />
        </FormGroup>
        <FormGroup label="Origem">
          <TextInput
            value={draft.origin}
            onChange={(e) => onDraftChange({ origin: e.target.value })}
            disabled={disabled}
          />
        </FormGroup>
      </FormRow>

      <div style={{ height: 10 }} />

      <FormGroup label="Assunto">
        <TextInput
          value={draft.subject}
          onChange={(e) => onDraftChange({ subject: e.target.value })}
          disabled={disabled}
        />
      </FormGroup>

      <div style={{ height: 10 }} />

      <Button type="button" variant="primary" onClick={onAdd} disabled={disabled}>
        Adicionar
      </Button>
    </div>
  );
}
