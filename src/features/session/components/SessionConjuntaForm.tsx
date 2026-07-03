import { useMemo } from 'react';
import type { Loja, LojaConfig, LojaConjunta } from '../../../types/ata';
import { TextInput } from '../../../components/ui/TextInput';
import { LojaCombobox } from '../../loja-config';

type LojaInput = Omit<Loja, 'id'>;

type Props = {
  lojas: Loja[];
  selected: LojaConjunta[];
  lojaConfig: LojaConfig;
  onAdd: (id: string, nome: string) => void;
  onRemove: (id: string) => void;
  onSetObreiros: (id: string, obreiros: number) => void;
  onCreateLoja: (input: LojaInput) => Loja;
};

export function SessionConjuntaForm({
  lojas,
  selected,
  lojaConfig,
  onAdd,
  onRemove,
  onSetObreiros,
  onCreateLoja,
}: Props) {
  const selectedIds = useMemo(() => selected.map((item) => item.id), [selected]);

  const selectedRows = useMemo(
    () =>
      selected.map((item) => ({
        item,
        oriente: lojas.find((loja) => loja.id === item.id)?.oriente ?? '',
      })),
    [selected, lojas],
  );

  return (
    <section>
      <LojaCombobox
        lojas={lojas}
        lojaConfig={lojaConfig}
        excludeIds={selectedIds}
        onSelect={(loja) => onAdd(loja.id, loja.nome)}
        onCreateLoja={onCreateLoja}
      />

      {selectedRows.length === 0 ? (
        <div className="conjunta-empty">Nenhuma loja adicionada.</div>
      ) : (
        <ul className="conjunta-list">
          {selectedRows.map(({ item, oriente }) => (
            <li key={item.id} className="conjunta-row">
              <div className="conjunta-row__info">
                <span className="conjunta-row__nome">{item.nome}</span>
                {oriente && <span className="conjunta-row__oriente">{oriente}</span>}
              </div>

              <label className="conjunta-row__obreiros" htmlFor={`obreiros-${item.id}`}>
                <span>Obreiros</span>
                <TextInput
                  id={`obreiros-${item.id}`}
                  type="number"
                  min={0}
                  value={item.obreiros}
                  onChange={(e) => onSetObreiros(item.id, Math.max(0, Number(e.target.value) || 0))}
                />
              </label>

              <button
                type="button"
                className="mini-btn conjunta-row__remove"
                onClick={() => onRemove(item.id)}
                aria-label={`Remover ${item.nome}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
