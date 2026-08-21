import type { Officers } from '../../../types/ata';
import type { ObreiroComCargo } from '../../loja-config/data/oficiais';
import { OfficerSelect } from './OfficerSelect';

const OFICIAIS: { campo: keyof Officers; label: string }[] = [
  { campo: 'vm', label: 'Venerável Mestre' },
  { campo: 'vig1', label: '1º Vigilante' },
  { campo: 'vig2', label: '2º Vigilante' },
  { campo: 'or', label: 'Orador' },
  { campo: 'sec', label: 'Secretário' },
];

type Props = {
  value: Officers;
  /** Quadro de obreiros anotado com o cargo de cada um na gestão vigente. */
  obreiros: ObreiroComCargo[];
  /** Titular de cada cargo segundo a gestão vigente. */
  titulares: Officers;
  onChange: (patch: Partial<Officers>) => void;
};

export function OfficersForm({ value, obreiros, titulares, onChange }: Props) {
  return (
    <section>
      {OFICIAIS.map(({ campo, label }, index) => (
        <div key={campo} style={index > 0 ? { marginTop: 10 } : undefined}>
          <OfficerSelect
            label={label}
            value={value[campo]}
            obreiros={obreiros}
            titular={titulares[campo]}
            onChange={(nome) => onChange({ [campo]: nome })}
          />
        </div>
      ))}
    </section>
  );
}
