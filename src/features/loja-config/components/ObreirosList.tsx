import { Button } from '../../../components/ui/Button';
import type { Obreiro } from '../../../types/ata';

type Props = {
  obreiros: Obreiro[];
  onEdit: (obreiro: Obreiro) => void;
};

export function ObreirosList({ obreiros, onEdit }: Props) {
  if (obreiros.length === 0) {
    return <p className="help-text">Nenhum obreiro cadastrado ainda.</p>;
  }

  return (
    <table className="lojas-table">
      <thead>
        <tr>
          <th>Nome - CIM</th>
          <th>Grau</th>
          <th aria-label="Ações" />
        </tr>
      </thead>
      <tbody>
        {obreiros.map((obreiro) => (
          <tr key={obreiro.id}>
            <td>{obreiro.cim ? `${obreiro.nome} - ${obreiro.cim}` : obreiro.nome}</td>
            <td>{obreiro.grau}</td>
            <td>
              <Button type="button" onClick={() => onEdit(obreiro)}>
                Editar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
