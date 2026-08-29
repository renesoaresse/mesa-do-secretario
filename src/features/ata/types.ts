import type { ReactNode } from 'react';
import type { OficiaisAdHoc, Officers, PreviewData, Rito } from '../../types/ata';

export type DocumentoAtaProps = {
  data: PreviewData;
};

/** A forma da ata de um rito: recebe os dados da sessão e lavra o documento. */
export type DocumentoAta = (props: DocumentoAtaProps) => ReactNode;

/**
 * Seções que a sidebar pode abrir. Cada rito declara quais usa e em que ordem,
 * seguindo a ordem em que elas aparecem na sua ata.
 */
export type SecaoAta =
  | 'oficiais'
  | 'balaustre'
  | 'atosDecretos'
  | 'pranchas'
  | 'atos'
  | 'decretos'
  | 'leituraAtas'
  | 'expedientes'
  | 'bolsaPropostas'
  | 'ordemDia'
  | 'tronco'
  | 'visitantes'
  /** Palavra a bem da Ordem nas três colunas. */
  | 'pbo'
  /** Palavra a bem da Ordem em texto corrido. */
  | 'pboLivre';

/**
 * Um rito e a ata que ele lavra. O núcleo (estado, sidebar, folha, exportação)
 * é comum a todos; aqui fica só o que pertence ao ritual.
 */
export type ModuloAta = {
  rito: Rito;
  /** Trecho da URL do módulo: /ata/<slug>. */
  slug: string;
  /** Nome curto do rito, exibido no editor. */
  label: string;
  Documento: DocumentoAta;
  /** Seções da sidebar, na ordem em que o rito as pede. */
  secoes: readonly SecaoAta[];
  /** Oficiais que a ata deste rito nomeia, na ordem do formulário. */
  oficiais: readonly (keyof Officers)[];
  /** Oficiais que a ata marca como ad hoc quando não são os titulares da gestão. */
  oficiaisAdHoc: OficiaisAdHoc;
};
