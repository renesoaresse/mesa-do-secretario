import { useState } from 'react';
import type { BolsaProposta, BolsaPropostaTipo, Loja, LojaConfig } from '../../../types/ata';
import { Button } from '../../../components/ui/Button';
import { FormGroup } from '../../../components/ui/FormGroup';
import { Select } from '../../../components/ui/Select';
import { TextInput } from '../../../components/ui/TextInput';
import { LojaCombobox } from '../../loja-config';
import type { ObreiroComCargo } from '../../loja-config/data/oficiais';
import { ObreiroCombobox } from './ObreiroCombobox';

type LojaInput = Omit<Loja, 'id'>;

/** '' enquanto o Ir∴ Sec∴ ainda não escolheu o tipo do registro. */
type TipoEscolhido = BolsaPropostaTipo | '';

const TIPOS: Array<{ value: BolsaPropostaTipo; label: string }> = [
  { value: 'certificado', label: 'Certificado de Visitas' },
  { value: 'trabalho', label: 'Trabalhos' },
  { value: 'aumento', label: 'Aumento de Salário' },
];

type Props = {
  obreiros: ObreiroComCargo[];
  lojas: Loja[];
  lojaConfig: LojaConfig;
  onAdd: (item: BolsaProposta) => void;
  onCreateLoja: (input: LojaInput) => Loja;
};

export function BolsaPropostaInputRow({ obreiros, lojas, lojaConfig, onAdd, onCreateLoja }: Props) {
  const [obreiroNome, setObreiroNome] = useState('');
  const [tipo, setTipo] = useState<TipoEscolhido>('');
  const [titulo, setTitulo] = useState('');
  const [loja, setLoja] = useState<Loja | null>(null);
  const [dataISO, setDataISO] = useState('');

  const reset = () => {
    setObreiroNome('');
    setTipo('');
    setTitulo('');
    setLoja(null);
    setDataISO('');
  };

  // Certificado só vira coluna gravada com a loja visitada e o dia da visita.
  const certificadoCompleto = loja !== null && dataISO.length > 0;
  const podeAdicionar =
    obreiroNome.trim().length > 0 && tipo !== '' && (tipo !== 'certificado' || certificadoCompleto);

  const submit = () => {
    if (!podeAdicionar || tipo === '') return;

    onAdd({
      id: crypto.randomUUID(),
      obreiroNome: obreiroNome.trim(),
      tipo,
      certificados:
        tipo === 'certificado' && loja ? [{ lojaId: loja.id, lojaNome: loja.nome, dataISO }] : [],
      titulo: tipo === 'trabalho' ? titulo.trim() : '',
    });

    reset();
  };

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {obreiroNome ? (
        <div className="visitor-loja-chip">
          <span className="visitor-loja-chip__text">{obreiroNome}</span>
          <button
            type="button"
            className="mini-btn"
            onClick={() => setObreiroNome('')}
            aria-label="Remover obreiro escolhido"
          >
            ✕
          </button>
        </div>
      ) : (
        <ObreiroCombobox obreiros={obreiros} onSelect={setObreiroNome} />
      )}

      <FormGroup label="Tipo">
        <Select value={tipo} onChange={(e) => setTipo(e.target.value as TipoEscolhido)}>
          <option value="">Selecione o tipo</option>
          {TIPOS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </FormGroup>

      {tipo === 'trabalho' && (
        <FormGroup label="Título do trabalho">
          <TextInput
            value={titulo}
            placeholder="Ex: A Simbologia do Esquadro"
            onChange={(e) => setTitulo(e.target.value)}
          />
        </FormGroup>
      )}

      {tipo === 'certificado' && (
        <>
          {loja ? (
            <div className="visitor-loja-chip">
              <span className="visitor-loja-chip__text">{loja.nome}</span>
              <button
                type="button"
                className="mini-btn"
                onClick={() => setLoja(null)}
                aria-label="Remover loja escolhida"
              >
                ✕
              </button>
            </div>
          ) : (
            <LojaCombobox
              lojas={lojas}
              lojaConfig={lojaConfig}
              placeholder="Loja visitada (mín. 3 letras)..."
              onSelect={setLoja}
              onCreateLoja={onCreateLoja}
            />
          )}

          <FormGroup label="Data da visita">
            <TextInput type="date" value={dataISO} onChange={(e) => setDataISO(e.target.value)} />
          </FormGroup>
        </>
      )}

      <Button
        type="button"
        variant="primary"
        onClick={submit}
        disabled={!podeAdicionar}
        style={{ width: '100%' }}
      >
        Adicionar
      </Button>
    </div>
  );
}
