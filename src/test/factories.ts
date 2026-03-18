import type {
  DocumentDraft,
  Documento,
  MagnaFields,
  Officers,
  PalavraBemOrdem,
  PreviewData,
  SessionConfig,
} from '../types/ata';

export function makeSessionConfig(overrides: Partial<SessionConfig> = {}): SessionConfig {
  return {
    grau: 'Aprendiz',
    numSessao: 42,
    dataISO: '2026-03-18',
    horaInicio: '19:30',
    horaEnc: '21:00',
    numPresenca: 12,
    ...overrides,
  };
}

export function makeMagnaFields(overrides: Partial<MagnaFields> = {}): MagnaFields {
  return {
    tema: 'Tema',
    oradorConvidado: 'Convidado',
    autoridades: 'Autoridades',
    atoEspecial: 'Ato',
    ...overrides,
  };
}

export function makeDocumentDraft(overrides: Partial<DocumentDraft> = {}): DocumentDraft {
  return {
    type: 'Prancha/Edital',
    number: '001',
    origin: 'GLMESE',
    subject: 'Assunto',
    ...overrides,
  };
}

export function makeDocumento(overrides: Partial<Documento> = {}): Documento {
  return {
    id: 'doc-1',
    type: 'Prancha/Edital',
    number: '001',
    origin: 'GLMESE',
    subject: 'Assunto',
    ...overrides,
  };
}

export function makeOfficers(overrides: Partial<Officers> = {}): Officers {
  return {
    vm: 'Veneravel',
    vig1: 'Primeiro',
    vig2: 'Segundo',
    or: 'Orador',
    sec: 'Secretario',
    ...overrides,
  };
}

export function makePbo(overrides: Partial<PalavraBemOrdem> = {}): PalavraBemOrdem {
  return {
    sul: 'Sul',
    norte: 'Norte',
    oriente: 'Oriente',
    ...overrides,
  };
}

export function makePreviewData(overrides: Partial<PreviewData> = {}): PreviewData {
  return {
    lojaConfig: {
      logoDataUrl: null,
      nomeLoja: 'Loja Teste',
      numeroLoja: '29',
      dataFundacaoISO: '2020-01-01',
      temploNome: 'Templo Teste',
      enderecoTemplo: 'Rua Teste',
      cidadeEstado: 'Aracaju/SE',
    },
    sessionType: 'economica',
    sessionConfig: makeSessionConfig(),
    magnaFields: makeMagnaFields(),
    documents: [makeDocumento()],
    visitors: ['Visitante 1'],
    officers: makeOfficers(),
    tronco: 10,
    ordemDia: 'Ordem do dia',
    pbo: makePbo(),
    balaustreTexto: 'Balaustre',
    atosDecretosTexto: 'Atos',
    expedientesTexto: 'Expedientes',
    bolsaPropostasTexto: 'Bolsa',
    ...overrides,
  };
}
