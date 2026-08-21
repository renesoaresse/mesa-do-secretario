import type {
  BolsaCertificado,
  BolsaProposta,
  BolsaPropostas,
  LojaConjunta,
  PreviewData,
  SessionType,
  Visitor,
} from '../../../types/ata';
import { formatarDataNumericaBR } from '../../../utils/data';
import { normalizarBusca } from '../../../utils/texto';

type PboKey = 'sul' | 'norte' | 'oriente';

export type PboEntry = {
  key: PboKey;
  label: string;
  value: string;
};

export function getPreviewDateParts(dataISO: string) {
  const dateObj = dataISO ? new Date(`${dataISO}T12:00:00`) : new Date();
  const dia = dateObj.getDate();
  const mes = FORMAT.meses[dateObj.getMonth()] ?? FORMAT.meses[0];
  const ano = dateObj.getFullYear();
  const anoVL = ano + 4000;

  return {
    dia,
    mes,
    ano,
    anoVLFormatado: `6.${String(anoVL - 6000).padStart(3, '0')}`,
  };
}

export function getSessionTypeMeta(sessionType: SessionType, conjunta = false) {
  if (conjunta) {
    return { className: 'conjunta', title: 'CONJUNTA' };
  }

  if (sessionType === 'magna') {
    return { className: 'magna', title: 'MAGNA' };
  }

  return { className: 'economica', title: 'ECONÔMICA' };
}

export const PBO_SILENCIO = 'Reinou silêncio na coluna.';

// Supressões decididas pelo V∴ M∴: substituem todo o conteúdo da sessão no balaústre.
export const TRONCO_SUPRIMIDO_TEXTO = 'Por ordem do V∴ M∴, a bolsa de beneficência foi suprimida!';

export const PBO_SUPRIMIDO_TEXTO =
  'Por ordem do V∴ M∴, a palavra a bem da Ordem e o quadro particular foram suprimidos!';

export const BOLSA_PROPOSTAS_SUPRIMIDA_TEXTO =
  'Por ordem do V∴ M∴, a Bolsa de proposta e informações foi suprimida!';

// Bolsa girou sem nada a registrar: fica o registro ritualístico dos bons fluidos.
export const BOLSA_PROPOSTAS_SEM_PRODUCAO =
  'A bolsa de propostas e informações após seu giro nada produziu, além dos bons fluidos colocados pelos IIr∴.';

// Sem balaústre digitado, registra-se que não houve balaústre na sessão.
export const BALAUSTRE_PADRAO = 'Não houve balaústre a ser apresentado nesta sessão!';

// Sem atos ou decretos digitados, registra-se que nada foi lido/apreciado.
export const ATOS_DECRETOS_PADRAO =
  'Não houve atos ou decretos a serem lidos/apreciados nesta sessão!';

// Sem expediente digitado, o balaústre registra a postagem padrão das pranchas.
export const EXPEDIENTE_PADRAO =
  'Todas as pranchas recebidas foram devidamente postadas no ambiente virtual para conhecimento de todos os irmãos, conforme determinação da Mui Resp∴ Grande Loja Maçônica do Estado de Sergipe!';

// Toda coluna aparece no balaústre: a preenchida com o texto digitado,
// a vazia com o registro ritualístico de silêncio.
export function formatPalavraBemOrdemEntries(palavraData: PreviewData['pbo']): PboEntry[] {
  const colunas: Array<{ key: PboKey; label: string }> = [
    { key: 'sul', label: 'Coluna do Sul' },
    { key: 'norte', label: 'Coluna do Norte' },
    { key: 'oriente', label: 'Oriente' },
  ];

  return colunas.map(({ key, label }) => ({
    key,
    label,
    value: hasText(palavraData[key]) ? palavraData[key] : PBO_SILENCIO,
  }));
}

// Junta nomes com vírgula e "e" antes do último: "A", "A e B", "A, B e C".
export function joinNomes(items: string[]): string {
  const list = items.filter((item) => item.trim().length > 0);
  if (list.length === 0) return '';
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join(', ')} e ${list[list.length - 1]}`;
}

// Sufixo após a loja anfitriã: " e X" (1 loja) ou ", X, Y e Z" (2+ lojas).
export function gerarSufixoLojasConjunta(lojasConjunta: LojaConjunta[]): string {
  const nomes = lojasConjunta.map((loja) => loja.nome.trim()).filter(Boolean);
  if (nomes.length === 0) return '';
  if (nomes.length === 1) return ` e a ${nomes[0]}`;
  return `, a ${nomes.slice(0, -1).join(', ')} e a ${nomes[nomes.length - 1]}`;
}

export function gerarTextoPresenca(
  presenca: number,
  visitors: Visitor[],
  lojasConjunta: LojaConjunta[] = [],
) {
  const quadro = `${FORMAT.pad(presenca)} (${FORMAT.extenso(presenca)}) IIr∴ do quadro`;
  const obreirosLojas = lojasConjunta.map(
    (loja) =>
      `${FORMAT.pad(loja.obreiros)} (${FORMAT.extenso(loja.obreiros)}) IIr∴ da ${loja.nome}`,
  );
  const presencaTexto = joinNomes([quadro, ...obreirosLojas]);

  // Sessão conjunta: presença lista o quadro + obreiros de cada loja e encerra,
  // sem o complemento de visitantes (esses aparecem na Saudação aos Visitantes).
  if (obreirosLojas.length > 0) {
    return `contando com a presença de ${presencaTexto} que assinaram o Livro de Presença.`;
  }

  if (visitors.length === 0) {
    return `contando com a presença de ${presencaTexto}, que assinaram o Livro de Presença.`;
  }

  const pluralVisitantes = visitors.length > 1;

  return `contando com a presença de ${presencaTexto}, e ${FORMAT.pad(visitors.length)} (${FORMAT.extenso(visitors.length)}) ${pluralVisitantes ? 'IIr∴ visitantes' : 'Ir∴ visitante'} que assinaram o Livro de Presença.`;
}

// Detalhe de um visitante: "Ir∴ visitante Fulano da Loja X do Oriente de Y filiado à Potência Z".
export function descreverVisitante(visitor: Visitor): string {
  let texto = `Ir∴ visitante ${visitor.nome}`;
  if (hasText(visitor.lojaNome)) texto += ` da ${visitor.lojaNome}`;
  if (hasText(visitor.oriente)) texto += ` do Oriente de ${visitor.oriente}`;
  if (hasText(visitor.potencia)) texto += ` filiado à Potência ${visitor.potencia}`;
  return texto;
}

export function gerarTextoSaudacao(visitors: Visitor[], orador: string) {
  if (visitors.length === 0) {
    return 'Foi suprimida em razão da ausência de visitantes.';
  }

  const primeiroNomeOrador = (orador || '').trim().split(/\s+/)[0] || 'Orador';
  const visitantesTexto = joinNomes(visitors.map(descreverVisitante));

  return `O Ir∴ Or∴ ${primeiroNomeOrador} saudou o ${visitantesTexto}, na forma ritualística.`;
}

// Uma visita certificada por vez: "Loja X - 08 no dia 25/07/2026".
function descreverVisitaCertificada(certificado: BolsaProposta['certificados'][number]): string {
  if (!hasText(certificado.lojaNome)) return '';
  if (!hasText(certificado.dataISO)) return certificado.lojaNome.trim();
  return `${certificado.lojaNome.trim()} no dia ${formatarDataNumericaBR(certificado.dataISO)}`;
}

// Ordem cronológica, da visita mais antiga para a mais nova.
// Registro antigo sem data vai para o fim da fila.
function compararDatasISO(a: string, b: string): number {
  if (!a) return b ? 1 : 0;
  if (!b) return -1;
  return a.localeCompare(b);
}

function ordenarVisitasPorData(certificados: BolsaCertificado[]): BolsaCertificado[] {
  return [...certificados].sort((a, b) => compararDatasISO(a.dataISO, b.dataISO));
}

/** Data da visita mais antiga do Ir∴, usada para posicionar a coluna no balaústre. */
function primeiraVisita(item: BolsaProposta): string {
  return item.certificados.find((certificado) => hasText(certificado.dataISO))?.dataISO ?? '';
}

// Um mesmo Ir∴ pode ter certificados lançados em registros separados;
// no balaústre todos viram uma coluna só, com as lojas enumeradas por data.
function agruparCertificadosPorObreiro(itens: BolsaProposta[]): BolsaProposta[] {
  const porObreiro = new Map<string, BolsaProposta>();

  for (const item of itens) {
    const chave = normalizarBusca(item.obreiroNome);
    const acumulado = porObreiro.get(chave);

    porObreiro.set(
      chave,
      acumulado
        ? { ...acumulado, certificados: [...acumulado.certificados, ...item.certificados] }
        : { ...item, certificados: [...item.certificados] },
    );
  }

  return [...porObreiro.values()]
    .map((item) => ({ ...item, certificados: ordenarVisitasPorData(item.certificados) }))
    .sort((a, b) => compararDatasISO(primeiraVisita(a), primeiraVisita(b)));
}

// O plural acompanha quantas lojas o Ir∴ visitou, não quantos IIr∴ há na sessão.
function descreverCertificados(item: BolsaProposta): string {
  const visitas = item.certificados.map(descreverVisitaCertificada).filter(Boolean);
  if (visitas.length === 0) return '';

  const plural = visitas.length > 1;
  const substantivo = plural ? 'certificados' : 'certificado';
  const complemento = plural ? 'às lojas' : 'à loja';

  return `${substantivo} de visita do Ir∴ ${item.obreiroNome.trim()} ${complemento} ${joinNomes(visitas)}`;
}

// Todos os aumentos de salário entram numa única coluna, com os IIr∴ enumerados.
function descreverAumentos(itens: BolsaProposta[]): string {
  const nomes = itens.map((item) => item.obreiroNome.trim()).filter(Boolean);
  if (nomes.length === 0) return '';

  const plural = nomes.length > 1;
  const substantivo = plural ? 'pedidos' : 'pedido';
  const complemento = plural ? 'dos IIr∴' : 'do Ir∴';

  return `${substantivo} de aumento de salário ${complemento} ${joinNomes(nomes)}`;
}

// Cada trabalho tem título próprio, então rende uma coluna separada.
function descreverTrabalho(item: BolsaProposta): string {
  const base = `trabalho apresentado pelo Ir∴ ${item.obreiroNome.trim()}`;
  return hasText(item.titulo) ? `${base} intitulado "${item.titulo.trim()}"` : base;
}

/**
 * Monta a Bolsa de Propostas e Informações em parágrafos: o primeiro enumera as
 * colunas gravadas na ordem fixa do balaústre (certificados de visita, aumentos
 * de salário e trabalhos); o acréscimo livre, quando existe, vira parágrafo próprio.
 */
export function gerarTextoBolsaPropostas(bolsa: BolsaPropostas): string[] {
  if (bolsa.suprimida) return [BOLSA_PROPOSTAS_SUPRIMIDA_TEXTO];

  const itens = bolsa.itens.filter((item) => hasText(item.obreiroNome));
  const complemento = bolsa.texto.trim();

  const colunas = [
    ...agruparCertificadosPorObreiro(itens.filter((item) => item.tipo === 'certificado')).map(
      descreverCertificados,
    ),
    descreverAumentos(itens.filter((item) => item.tipo === 'aumento')),
    ...itens.filter((item) => item.tipo === 'trabalho').map(descreverTrabalho),
  ].filter((coluna) => coluna.length > 0);

  if (colunas.length === 0 && !complemento) return [BOLSA_PROPOSTAS_SEM_PRODUCAO];

  // Sem total anunciado, cada coluna montada vale por uma.
  const total =
    bolsa.totalColunas > 0 ? bolsa.totalColunas : colunas.length + (complemento ? 1 : 0);
  const gravadas = total > 1 ? `${total} colunas gravadas` : `${total} coluna gravada`;
  const abertura = `A bolsa de propostas e informações após seu giro produziu ${gravadas}`;

  const paragrafo =
    colunas.length > 0 ? `${abertura}, sendo: ${joinNomes(colunas)}.` : `${abertura}.`;

  return complemento ? [paragrafo, complemento] : [paragrafo];
}

export function formatDateBR(iso: string) {
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;

  const monthIndex = Number(m) - 1;
  if (monthIndex < 0 || monthIndex > 11) return iso;

  return `${Number(d)} de ${FORMAT.meses[monthIndex]} de ${y}`;
}

export function hasText(input: string | null | undefined) {
  return Boolean(input && input.trim());
}

export const FORMAT = {
  meses: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],

  pad(n: number) {
    const x = Number.isFinite(n) ? n : 0;
    return String(x).padStart(2, '0');
  },

  ordinal(n: number): string {
    const ordinais: Record<number, string> = {
      1: 'Primeiro',
      2: 'Segundo',
      3: 'Terceiro',
      4: 'Quarto',
      5: 'Quinto',
      6: 'Sexto',
      7: 'Sétimo',
      8: 'Oitavo',
      9: 'Nono',
      10: 'Décimo',
      20: 'Vigésimo',
      30: 'Trigésimo',
      40: 'Quadragésimo',
      50: 'Quinquagésimo',
    };

    if (ordinais[n]) return ordinais[n];
    if (n > 10 && n < 20) return `Décimo ${FORMAT.ordinal(n - 10)}`;
    if (n > 20 && n < 30) return `Vigésimo ${FORMAT.ordinal(n - 20)}`;
    if (n > 30 && n < 40) return `Trigésimo ${FORMAT.ordinal(n - 30)}`;
    return `${n}º`;
  },

  extenso(n: number): string {
    const num = Math.max(0, Math.floor(Number(n) || 0));
    if (num === 0) return 'zero';
    if (num === 100) return 'cem';

    const u = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const d10 = [
      'dez',
      'onze',
      'doze',
      'treze',
      'catorze',
      'quinze',
      'dezesseis',
      'dezessete',
      'dezoito',
      'dezenove',
    ];
    const dz = [
      '',
      'dez',
      'vinte',
      'trinta',
      'quarenta',
      'cinquenta',
      'sessenta',
      'setenta',
      'oitenta',
      'noventa',
    ];
    const c = [
      '',
      'cento',
      'duzentos',
      'trezentos',
      'quatrocentos',
      'quinhentos',
      'seiscentos',
      'setecentos',
      'oitocentos',
      'novecentos',
    ];

    let r = '';

    const cen = Math.floor(num / 100);
    const rest = num % 100;
    const dez = Math.floor(rest / 10);
    const uni = rest % 10;

    if (cen > 0) {
      r += c[cen];
      if (rest > 0) r += ' e ';
    }

    if (rest >= 10 && rest <= 19) {
      r += d10[rest - 10];
      return r.trim();
    }

    if (dez > 0) {
      r += dz[dez];
      if (uni > 0) r += ' e ';
    }

    if (uni > 0) r += u[uni];

    return r.trim() || 'zero';
  },
};
