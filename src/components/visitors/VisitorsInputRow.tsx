import React, { useState } from "react";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";

type Props = {
  onAdd: (name: string) => void;
};

export function VisitorsInputRow({ onAdd }: Props) {
  const [value, setValue] = useState("");

  const submit = () => {
    const name = value.trim();
    if (!name) return;
    onAdd(name);
    setValue("");
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <TextInput
        placeholder="Nome do visitante"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />
      <Button type="button" variant="primary" onClick={submit}>
        Adicionar
      </Button>
    </div>
  );
}
