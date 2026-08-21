import { Button } from '../../../components/ui/Button';
import type { Gestao } from '../../../types/ata';

type Props = {
  gestoes: Gestao[];
  onEdit: (gestao: Gestao) => void;
};

export function GestoesList({ gestoes, onEdit }: Props) {
  if (gestoes.length === 0) {
    return <p className="help-text">Nenhuma gestão cadastrada ainda.</p>;
  }

  return (
    <table className="lojas-table">
      <thead>
        <tr>
          <th>Ano</th>
          <th>Vigente</th>
          <th aria-label="Ações" />
        </tr>
      </thead>
      <tbody>
        {gestoes.map((gestao) => (
          <tr key={gestao.id}>
            <td>{gestao.ano}</td>
            <td>{gestao.vigente ? 'Sim' : 'Não'}</td>
            <td>
              <Button type="button" onClick={() => onEdit(gestao)}>
                Editar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
