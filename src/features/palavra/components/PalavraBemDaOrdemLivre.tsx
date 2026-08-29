import { Checkbox } from '../../../components/ui/Checkbox';
import { OpenTextSection } from '../../session/components/OpenTextSection';

type Props = {
  value: string;
  onChange: (texto: string) => void;
  suprimida: boolean;
  onSuprimidaChange: (suprimida: boolean) => void;
};

/**
 * Palavra a bem da Ordem em texto corrido: os ritos que não dividem a palavra
 * entre as colunas registram tudo num único relato.
 */
export function PalavraBemDaOrdemLivre({ value, onChange, suprimida, onSuprimidaChange }: Props) {
  return (
    <section className="pbo">
      <Checkbox label="Suprimida" checked={suprimida} onChange={onSuprimidaChange} />

      {suprimida ? null : (
        <div style={{ marginTop: 10 }}>
          <OpenTextSection
            value={value}
            onChange={onChange}
            placeholder="Descreva o uso da palavra a bem da Ordem..."
          />
        </div>
      )}
    </section>
  );
}
