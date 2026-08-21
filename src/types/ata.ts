export type SessionType = 'economica' | 'magna';

export type LojaConjunta = {
  id: string; // id da loja cadastrada
  nome: string; // nome da loja (snapshot, para o preview)
  obreiros: number; // quantidade de obreiros daquela loja na reunião
};

export type Visitor = {
  nome: string;
  lojaId: string; // '' quando loja não informada
  lojaNome: string; // snapshot da loja escolhida
  oriente: string;
  potencia: string;
};
export type Grau = 'Aprendiz' | 'Companheiro' | 'Mestre';

export type Rito =
  | 'Rito Escocês Antigo e Aceito'
  | 'Rito Adonhiramita'
  | 'Rito de York'
  | 'Rito de Emulação';

export type SessionConfig = {
  grau: Grau;
  numSessao: number;
  dataISO: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  horaEnc: string; // HH:mm
  numPresenca: number;
  conjunta: boolean; // sessão conjunta? Sim/Não (default Não)
  numerarLinhas: boolean; // numerar linhas do documento? Sim/Não (default Não)
};

export type MagnaFields = {
  tema: string;
  oradorConvidado: string;
  autoridades: string;
  atoEspecial: string;
};

export type Officers = {
  vm: string;
  vig1: string;
  vig2: string;
  or: string;
  sec: string;
};

export type PalavraBemOrdem = {
  sul: string;
  norte: string;
  oriente: string;
};

export type AtaDraft = {
  sessionType: SessionType;
  sessionConfig: SessionConfig;
  magnaFields: MagnaFields;
  visitors: Visitor[];
  officers: Officers;
  tronco: number;
  troncoSuprimido: boolean; // bolsa de beneficência suprimida por ordem do V∴ M∴
  ordemDia: string;
  pbo: PalavraBemOrdem;
  pboSuprimido: boolean; // palavra a bem da Ordem suprimida por ordem do V∴ M∴
  lojaConfig: LojaConfig;
  lojasConjunta: LojaConjunta[]; // lojas em sessão conjunta + obreiros
  balaustreTexto: string;
  atosDecretosTexto: string;
  expedientesTexto: string;
  bolsaPropostasTexto: string;
};

export type StatusKind = 'success' | 'error' | 'info';

export type StatusState = {
  kind: StatusKind;
  text: string;
} | null;

export type PreviewData = {
  lojaConfig: LojaConfig;
  sessionType: SessionType;
  sessionConfig: SessionConfig;
  magnaFields: MagnaFields;
  visitors: Visitor[];
  officers: Officers;
  tronco: number;
  troncoSuprimido: boolean;
  ordemDia: string;
  pbo: PalavraBemOrdem;
  pboSuprimido: boolean;
  lojasConjunta: LojaConjunta[];
  balaustreTexto: string;
  atosDecretosTexto: string;
  expedientesTexto: string;
  bolsaPropostasTexto: string;
};

export type LojaConfig = {
  logoDataUrl: string | null; // base64 dataURL (offline)
  nomeLoja: string;
  rito: Rito | ''; // '' = nenhum rito escolhido ainda
  numeroLoja: string;
  dataFundacaoISO: string; // YYYY-MM-DD
  temploNome: string; // "Templo onde se reúnem?"
  enderecoTemplo: string;
  cidadeEstado: string; // "Aracaju/SE"
};

export type GrauObreiro = 'AP∴M∴' | 'CP∴M∴' | 'M∴M∴' | 'M∴M∴I∴';

export type Obreiro = {
  id: string;
  nome: string; // sempre em caixa alta
  cim: string;
  grau: GrauObreiro;
};

export type AtribuicaoCargo = {
  obreiroId: string;
  cargo: string; // vazio = obreiro sem cargo na gestão
};

export type Gestao = {
  id: string;
  ano: string;
  vigente: boolean; // só uma gestão pode estar vigente por vez
  atribuicoes: AtribuicaoCargo[];
};

export type Loja = {
  id: string;
  nome: string;
  oriente: string; // cidade/UF de instalação
  potencia: string; // Grande Loja / Grande Oriente
};
