import type { PreviewData, SessionType } from '../../../types/ata';

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

export function getSessionTypeMeta(sessionType: SessionType) {
  if (sessionType === 'magna') {
    return { className: 'magna', title: 'MAGNA' };
  }

  if (sessionType === 'conjunta') {
    return { className: 'conjunta', title: 'CONJUNTA' };
  }

  return { className: 'economica', title: 'ECONÔMICA' };
}

export function formatPalavraBemOrdemEntries(palavraData: PreviewData['pbo']): PboEntry[] {
  const entries: PboEntry[] = [];

  if (hasText(palavraData.sul)) {
    entries.push({ key: 'sul', label: 'Coluna do Sul', value: palavraData.sul });
  }

  if (hasText(palavraData.norte)) {
    entries.push({ key: 'norte', label: 'Coluna do Norte', value: palavraData.norte });
  }

  if (hasText(palavraData.oriente)) {
    entries.push({ key: 'oriente', label: 'Oriente', value: palavraData.oriente });
  }

  return entries;
}

export function gerarTextoPresenca(presenca: number, visitors: string[]) {
  if (visitors.length === 0) {
    return `contando com a presença de ${FORMAT.pad(presenca)} (${FORMAT.extenso(presenca)}) IIr∴ do quadro, que assinaram o Livro de Presença.`;
  }

  const pluralVisitantes = visitors.length > 1;

  return `contando com a presença de ${FORMAT.pad(presenca)} (${FORMAT.extenso(presenca)}) IIr∴ do quadro, e ${FORMAT.pad(visitors.length)} (${FORMAT.extenso(visitors.length)}) ${pluralVisitantes ? 'IIr∴ visitantes' : 'Ir∴ visitante'} que assinaram o Livro de Presença.`;
}

export function gerarTextoSaudacao(visitors: string[], orador: string) {
  if (visitors.length === 0) {
    return 'Foi suprimido por não ter visitantes.';
  }

  const plural = visitors.length > 1;
  const primeiroNomeOrador = (orador || '').trim().split(/\s+/)[0] || 'Orador';
  const visitantesTexto = visitors.join(', ');

  return `O Ir∴ Or∴ ${primeiroNomeOrador} saudou ${plural ? 'os nossos IIr∴ visitantes' : 'o nosso Ir∴ visitante'} ${visitantesTexto}, na forma ritualística.`;
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
