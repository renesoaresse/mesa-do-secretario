import React from "react";

type FormGroupProps = {
  label: string;
  children: React.ReactNode;
};

export function FormGroup({ label, children }: FormGroupProps) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: 12, marginBottom: 6, opacity: 0.8 }}>{label}</div>
      {children}
    </label>
  );
}
