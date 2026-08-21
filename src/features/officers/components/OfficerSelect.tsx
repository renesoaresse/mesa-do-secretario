import { useState } from 'react';
import { FormGroup } from '../../../components/ui/FormGroup';
import { Select } from '../../../components/ui/Select';
import { TextInput } from '../../../components/ui/TextInput';
import type { ObreiroComCargo } from '../../../features/loja-config/data/oficiais';

/** Valor reservado para liberar a digitação de um nome fora do quadro. */
const OUTRO = '__outro__';

type Props = {
  label: string;
  value: string;
  /** Quadro anotado com o cargo de cada irmão na gestão vigente. */
  obreiros: ObreiroComCargo[];
  /** Nome de quem ocupa este cargo na gestão vigente; vazio quando não há titular. */
  titular: string;
  onChange: (nome: string) => void;
};

function rotulo(obreiro: ObreiroComCargo, titular: string): string {
  if (obreiro.nome === titular) return `${obreiro.nome} — Titular do Cargo`;
  return obreiro.cargo ? `${obreiro.nome} — ${obreiro.cargo}` : obreiro.nome;
}

export function OfficerSelect({ label, value, obreiros, titular, onChange }: Props) {
  // O titular do cargo encabeça a lista; os demais seguem na ordem alfabética.
  const opcoes = [...obreiros].sort((a, b) => {
    if (a.nome === titular) return -1;
    if (b.nome === titular) return 1;
    return 0;
  });

  const estaNoQuadro = obreiros.some((obreiro) => obreiro.nome === value);
  // Nome digitado à mão mantém o campo livre aberto entre renders.
  const [digitando, setDigitando] = useState(value !== '' && !estaNoQuadro);

  function handleSelect(escolha: string) {
    if (escolha === OUTRO) {
      setDigitando(true);
      onChange('');
      return;
    }

    setDigitando(false);
    onChange(escolha);
  }

  return (
    <FormGroup label={label}>
      <Select value={digitando ? OUTRO : value} onChange={(e) => handleSelect(e.target.value)}>
        <option value="">Sem indicação</option>
        {opcoes.map((obreiro) => (
          <option key={obreiro.id} value={obreiro.nome}>
            {rotulo(obreiro, titular)}
          </option>
        ))}
        <option value={OUTRO}>Outro (digitar nome)</option>
      </Select>

      {digitando ? (
        <div style={{ marginTop: 6 }}>
          <TextInput
            value={value}
            onChange={(e) => onChange(e.target.value.toLocaleUpperCase('pt-BR'))}
            placeholder="NOME DO IRMÃO"
            aria-label={`${label} - nome`}
          />
        </div>
      ) : null}
    </FormGroup>
  );
}
