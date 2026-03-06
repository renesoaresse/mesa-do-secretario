import React from "react";

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className = "", ...props }: TextInputProps) {
  return <input {...props} className={`control ${className}`.trim()} />;
}
