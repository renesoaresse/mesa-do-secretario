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

export type SessionConfig = {
  grau: Grau;
  numSessao: number;
  dataISO: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  horaEnc: string; // HH:mm
  numPresenca: number;
  conjunta: boolean; // sessão conjunta? Sim/Não (default Não)
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
  ordemDia: string;
  pbo: PalavraBemOrdem;
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
  ordemDia: string;
  pbo: PalavraBemOrdem;
  lojasConjunta: LojaConjunta[];
  balaustreTexto: string;
  atosDecretosTexto: string;
  expedientesTexto: string;
  bolsaPropostasTexto: string;
};

export type LojaConfig = {
  logoDataUrl: string | null; // base64 dataURL (offline)
  nomeLoja: string;
  numeroLoja: string;
  dataFundacaoISO: string; // YYYY-MM-DD
  temploNome: string; // "Templo onde se reúnem?"
  enderecoTemplo: string;
  cidadeEstado: string; // "Aracaju/SE"
};

export type Loja = {
  id: string;
  nome: string;
  oriente: string; // cidade/UF de instalação
  potencia: string; // Grande Loja / Grande Oriente
};
