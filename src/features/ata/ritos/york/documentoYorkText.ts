import type { LojaConjunta, Officers, Visitor } from '../../../../types/ata';
import { FORMAT, hasText, joinNomes } from '../../../preview/components/documentPreviewText';

/**
 * O Rito de York lavra a ata por extenso: nada de abreviaturas com três pontos,
 * cada cargo escrito como se fala. Estes são os textos próprios do rito.
 */

/** Como cada oficial é chamado na direção dos trabalhos. */
export const CARGO_POR_EXTENSO: Record<keyof Officers, string> = {
  vm: 'Venerável Mestre',
  vig1: 'Primeiro Vigilante',
  vig2: 'Segundo Vigilante',
  or: 'Orador',
  sec: 'Secretário',
  tes: 'Tesoureiro',
};

export const PRANCHAS_PADRAO = 'Não houve pranchas ou correspondências nesta sessão.';
export const ATOS_PADRAO = 'Não houve atos apresentados nesta sessão.';
export const DECRETOS_PADRAO = 'Não houve decretos apresentados nesta sessão.';
export const LEITURA_ATAS_PADRAO = 'Não houve leitura de atas anteriores.';
export const PBO_PADRAO = 'Não houve uso da palavra a bem da Ordem nesta sessão.';
export const SAUDACAO_SEM_VISITANTES = 'Não houve visitantes nesta sessão.';

export const EXPEDIENTES_PADRAO =
  'Todas as pranchas e editais foram postados no ambiente virtual para conhecimento dos irmãos, como sugerido pela Grande Loja Maçônica do Estado de Sergipe.';

export const TRONCO_SUPRIMIDO =
  'Por ordem do Venerável Mestre, o Tronco de Beneficência foi suprimido.';

export const PBO_SUPRIMIDA =
  'Por ordem do Venerável Mestre, a palavra a bem da Ordem foi suprimida.';

/** "ATA DA SESSÃO DE MESTRE MAÇOM Nº 90": o grau da sessão e o número dela. */
export function gerarTitulo(grau: string, numSessao: number): string {
  return `ATA DA SESSÃO DE ${grau.toUpperCase()} MAÇOM Nº ${numSessao}`;
}

/** "14 (catorze) Irmãos do Quadro" e, quando houver, os das lojas em conjunta. */
export function gerarTextoQuadro(presenca: number, lojasConjunta: LojaConjunta[] = []): string {
  const quadro = `${FORMAT.pad(presenca)} (${FORMAT.extenso(presenca)}) Irmãos do Quadro`;
  const conjuntas = lojasConjunta.map(
    (loja) =>
      `${FORMAT.pad(loja.obreiros)} (${FORMAT.extenso(loja.obreiros)}) Irmãos da ${loja.nome}`,
  );

  return joinNomes([quadro, ...conjuntas]);
}

/** "02 (dois) Irmãos visitantes"; vazio quando ninguém visitou a Loja. */
export function gerarTextoVisitantes(visitors: Visitor[]): string {
  if (visitors.length === 0) return '';

  const plural = visitors.length > 1;

  return `${FORMAT.pad(visitors.length)} (${FORMAT.extenso(visitors.length)}) ${
    plural ? 'Irmãos visitantes' : 'Irmão visitante'
  }`;
}

/** O fecho da presença acompanha quantos livros foram assinados. */
export function gerarFechoPresenca(temVisitantes: boolean): string {
  return temVisitantes
    ? 'todos registrados nos respectivos Livros de Presença.'
    : 'todos registrados no respectivo Livro de Presença.';
}

/** "Ir∴ visitante Fulano da Loja X filiado à Potência Y". */
export function descreverVisitante(visitor: Visitor): string {
  let texto = `Ir∴ visitante ${visitor.nome}`;
  if (hasText(visitor.lojaNome)) texto += ` da ${visitor.lojaNome}`;
  if (hasText(visitor.potencia)) texto += ` filiado à Potência ${visitor.potencia}`;
  return texto;
}

/** A apresentação dos visitantes é feita pelo Segundo Diácono, a pedido do V∴ M∴. */
export function gerarTextoSaudacao(visitors: Visitor[]): string {
  if (visitors.length === 0) return SAUDACAO_SEM_VISITANTES;

  const alvo = visitors.length > 1 ? 'dos visitantes' : 'do visitante';
  const lista = joinNomes(visitors.map(descreverVisitante));

  return `A pedido do Venerável Mestre, o Irmão Segundo Diácono procedeu com a apresentação ${alvo}: ${lista}.`;
}

/** O tronco entra pelo total apurado, em medalhas cunhadas. */
export function gerarTextoTronco(tronco: number, suprimido: boolean): string {
  if (suprimido) return TRONCO_SUPRIMIDO;

  return `Foram arrecadados no Tronco de Beneficência o total de ${String(tronco)} (${FORMAT.extenso(
    tronco,
  )}) medalhas cunhadas.`;
}

/** A palavra a bem da Ordem do Rito de York é texto corrido, sem colunas. */
export function gerarTextoPalavraBemOrdem(texto: string, suprimida: boolean): string {
  if (suprimida) return PBO_SUPRIMIDA;

  return hasText(texto) ? texto.trim() : PBO_PADRAO;
}
