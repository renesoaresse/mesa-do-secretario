import React from 'react';

type Props = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Checkbox({ label, checked, onChange }: Props) {
  return (
    <label className="checkbox-field">
      <input
        type="checkbox"
        className="checkbox-field__input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="checkbox-field__label">{label}</span>
    </label>
  );
}
