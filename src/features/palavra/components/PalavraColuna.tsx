import React from 'react';

type Variant = 'sul' | 'norte' | 'oriente';

type Props = {
  variant: Variant;
  title: string;
  help?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export function PalavraColuna({ variant, title, help, placeholder, value, onChange }: Props) {
  return (
    <div className={`pbo-row pbo-row--${variant}`}>
      <div className="pbo-row__header">
        <span className="pbo-row__title">{title}</span>
        {help ? <span className="pbo-row__help">{help}</span> : null}
      </div>

      <textarea
        className="pbo-row__textarea"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
