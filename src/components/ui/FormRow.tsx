import React from "react";

type FormRowProps = {
  children: React.ReactNode;
};

export function FormRow({ children }: FormRowProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {children}
    </div>
  );
}
