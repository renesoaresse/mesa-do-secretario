import { useState } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  toggleLabel: string;
};

export function PasswordInput({ value, onChange, placeholder, toggleLabel }: Props) {
  // Sempre nasce oculto; o estado morre junto com o componente.
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <input
        className="control password-field__input"
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        // Nada de gerenciador de senha, autofill ou corretor tocando neste campo.
        autoComplete="new-password"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        data-lpignore="true"
        data-1p-ignore="true"
      />
      <button
        type="button"
        className="password-field__toggle"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? `Ocultar ${toggleLabel}` : `Mostrar ${toggleLabel}`}
        aria-pressed={visible}
        tabIndex={-1}
      >
        {visible ? '🙈' : '👁'}
      </button>
    </div>
  );
}
