import type { BolsaProposta } from '../../../types/ata';
import { formatarDataNumericaBR } from '../../../utils/data';

type Props = {
  items: BolsaProposta[];
  onRemove: (id: string) => void;
};

const TIPO_LABEL: Record<BolsaProposta['tipo'], string> = {
  certificado: 'Certificado de Visitas',
  trabalho: 'Trabalhos',
  aumento: 'Aumento de Salário',
};

function resumo(item: BolsaProposta): string {
  if (item.tipo === 'certificado') {
    return item.certificados
      .map((certificado) =>
        certificado.dataISO
          ? `${certificado.lojaNome} (${formatarDataNumericaBR(certificado.dataISO)})`
          : certificado.lojaNome,
      )
      .join(', ');
  }

  if (item.tipo === 'trabalho') {
    return item.titulo;
  }

  return '';
}

export function BolsaPropostasList({ items, onRemove }: Props) {
  if (items.length === 0) {
    return (
      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.7 }}>Nenhum registro adicionado.</div>
    );
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'grid', gap: 8 }}>
      {items.map((item) => {
        const detalhe = resumo(item);

        return (
          <li key={item.id} className="dark-list-item">
            <div className="dark-list-text">
              <span>
                {item.obreiroNome} — {TIPO_LABEL[item.tipo]}
              </span>
              {detalhe && <small className="visitor-loja-sub">{detalhe}</small>}
            </div>
            <button type="button" className="mini-btn" onClick={() => onRemove(item.id)}>
              Remover
            </button>
          </li>
        );
      })}
    </ul>
  );
}
