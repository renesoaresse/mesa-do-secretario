import type {
  AtaDraft,
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

export function makeDangerousPreviewData(overrides: Partial<PreviewData> = {}): PreviewData {
  return makePreviewData({
    lojaConfig: {
      logoDataUrl: null,
      nomeLoja: '<b>Loja</b> & Co',
      numeroLoja: '29<script>alert(1)</script>',
      dataFundacaoISO: '2020-01-01',
      temploNome: '<script>alert("templo")</script>',
      enderecoTemplo: 'Rua <img src=x onerror=alert(1)> Central',
      cidadeEstado: 'Aracaju/SE &lt;b&gt;teste&lt;/b&gt;',
    },
    visitors: ['Visitante <b>1</b>', '&lt;Visitante 2&gt;'],
    officers: makeOfficers({
      vm: '<strong>Veneravel</strong>',
      or: 'Orador onclick="hack()"',
    }),
    balaustreTexto: '<p>Balaustre</p>',
    atosDecretosTexto: '<script>atos</script>',
    expedientesTexto: 'Expediente &lt;seguro&gt;',
    bolsaPropostasTexto: '<img src=x onerror=alert(2)>',
    ordemDia: '<div>Ordem</div>',
    pbo: makePbo({
      sul: '<i>Sul</i>',
      norte: '&lt;Norte&gt;',
      oriente: 'Oriente <script>noop</script>',
    }),
    ...overrides,
  });
}

export function makeAtaDraft(overrides: Partial<AtaDraft> = {}): AtaDraft {
  return {
    sessionType: 'economica',
    sessionConfig: makeSessionConfig(),
    magnaFields: makeMagnaFields(),
    visitors: ['Visitante 1'],
    officers: makeOfficers(),
    tronco: 10,
    ordemDia: 'Ordem do dia',
    pbo: makePbo(),
    lojaConfig: makePreviewData().lojaConfig,
    balaustreTexto: 'Balaustre',
    atosDecretosTexto: 'Atos',
    expedientesTexto: 'Expedientes',
    bolsaPropostasTexto: 'Bolsa',
    ...overrides,
  };
}

export function makeLegacyAtaDraft(overrides: Record<string, unknown> = {}) {
  return {
    ...makeAtaDraft(),
    documents: [
      {
        id: 'doc-1',
        type: 'Prancha/Edital',
        number: '001',
        origin: 'GLMESE',
        subject: 'Assunto',
      },
    ],
    docDraft: {
      type: 'Prancha/Edital',
      number: '001',
      origin: 'GLMESE',
      subject: 'Assunto',
    },
    docStatus: { kind: 'info', text: 'Legacy' },
    previewData: makePreviewData(),
    ...overrides,
  };
}
