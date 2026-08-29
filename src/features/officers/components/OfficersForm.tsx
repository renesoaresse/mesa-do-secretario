import type { Officers, Rito } from '../../../types/ata';
import { rotuloDoOficial, type ObreiroComCargo } from '../../loja-config/data/oficiais';
import { OfficerSelect } from './OfficerSelect';

type Props = {
  value: Officers;
  /** Oficiais que o rito da loja pede, na ordem do formulário. */
  oficiais: readonly (keyof Officers)[];
  /** Rito da loja: é ele quem dá nome a cada cargo. */
  rito: Rito | '';
  /** Quadro de obreiros anotado com o cargo de cada um na gestão vigente. */
  obreiros: ObreiroComCargo[];
  /** Titular de cada cargo segundo a gestão vigente. */
  titulares: Officers;
  onChange: (patch: Partial<Officers>) => void;
};

export function OfficersForm({ value, oficiais, rito, obreiros, titulares, onChange }: Props) {
  return (
    <section>
      {oficiais.map((campo, index) => (
        <div key={campo} style={index > 0 ? { marginTop: 10 } : undefined}>
          <OfficerSelect
            label={rotuloDoOficial(campo, rito)}
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
