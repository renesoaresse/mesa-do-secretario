import React from "react";
import { FormGroup } from "../ui/FormGroup";
import { Textarea } from "../ui/Textarea";

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
