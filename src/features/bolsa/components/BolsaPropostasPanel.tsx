import type { BolsaProposta, BolsaPropostas, Loja, LojaConfig } from '../../../types/ata';
import { Checkbox } from '../../../components/ui/Checkbox';
import { FormGroup } from '../../../components/ui/FormGroup';
import { TextInput } from '../../../components/ui/TextInput';
import { Textarea } from '../../../components/ui/Textarea';
import type { ObreiroComCargo } from '../../loja-config/data/oficiais';
import { BolsaPropostaInputRow } from './BolsaPropostaInputRow';
import { BolsaPropostasList } from './BolsaPropostasList';

type LojaInput = Omit<Loja, 'id'>;

type Props = {
  value: BolsaPropostas;
  obreiros: ObreiroComCargo[];
  lojas: Loja[];
  lojaConfig: LojaConfig;
  onChange: (patch: Partial<BolsaPropostas>) => void;
  onAddItem: (item: BolsaProposta) => void;
  onRemoveItem: (id: string) => void;
  onCreateLoja: (input: LojaInput) => Loja;
};

export function BolsaPropostasPanel({
  value,
  obreiros,
  lojas,
  lojaConfig,
  onChange,
  onAddItem,
  onRemoveItem,
  onCreateLoja,
}: Props) {
  return (
    <section>
      <Checkbox
        label="Suprimida"
        checked={value.suprimida}
        onChange={(suprimida) => onChange({ suprimida })}
      />

      {/* Suprimida: o balaústre registra apenas a supressão, sem colunas nem acréscimos. */}
      {value.suprimida ? null : (
        <>
          <div style={{ height: 10 }} />

          <FormGroup label="Total de colunas gravadas">
            <TextInput
              type="number"
              min={0}
              value={value.totalColunas}
              onChange={(e) => onChange({ totalColunas: Math.max(0, Number(e.target.value) || 0) })}
            />
          </FormGroup>

          <div style={{ height: 10 }} />

          <BolsaPropostaInputRow
            obreiros={obreiros}
            lojas={lojas}
            lojaConfig={lojaConfig}
            onAdd={onAddItem}
            onCreateLoja={onCreateLoja}
          />

          <BolsaPropostasList items={value.itens} onRemove={onRemoveItem} />

          <div style={{ height: 10 }} />

          <FormGroup label="Acréscimo ao texto padrão">
            <Textarea
              value={value.texto}
              placeholder="Ex: pedido de dupla filiação do irmão Fulano de Tal"
              onChange={(e) => onChange({ texto: e.target.value })}
            />
          </FormGroup>
        </>
      )}
    </section>
  );
}
