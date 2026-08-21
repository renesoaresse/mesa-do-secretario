import { useMemo, useState } from 'react';
import { TextInput } from '../../../components/ui/TextInput';
import { normalizarBusca } from '../../../utils/texto';
import type { ObreiroComCargo } from '../../loja-config/data/oficiais';

type Props = {
  obreiros: ObreiroComCargo[];
  placeholder?: string;
  onSelect: (nome: string) => void;
};

/** Busca dentro do quadro da loja; o quadro é curto, então a lista abre inteira ao focar. */
export function ObreiroCombobox({
  obreiros,
  placeholder = 'Buscar obreiro da loja...',
  onSelect,
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const busca = normalizarBusca(query);
    if (!busca) return obreiros;
    return obreiros.filter((obreiro) => normalizarBusca(obreiro.nome).includes(busca));
  }, [obreiros, query]);

  const pick = (obreiro: ObreiroComCargo) => {
    onSelect(obreiro.nome);
    setQuery('');
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <TextInput
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
      />

      {open && (
        <ul className="combo-panel">
          {obreiros.length === 0 && (
            <li className="combo-hint">Nenhum obreiro cadastrado na loja.</li>
          )}

          {obreiros.length > 0 && results.length === 0 && (
            <li className="combo-hint">Nenhum obreiro encontrado.</li>
          )}

          {results.map((obreiro) => (
            <li key={obreiro.id}>
              <button
                type="button"
                className="combo-option"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(obreiro)}
              >
                {obreiro.cargo ? `${obreiro.nome} — ${obreiro.cargo}` : obreiro.nome}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
