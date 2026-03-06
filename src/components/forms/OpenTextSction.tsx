import React from "react";
import { FormGroup } from "../ui/FormGroup";
import { Textarea } from "../ui/Textarea";

type Props = {
  label?: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
};

export function OpenTextSection({ label = '', value, onChange, placeholder }: Props) {
  return (
    <section>
      <FormGroup label={label}>
        <Textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </FormGroup>
    </section>
  );
}