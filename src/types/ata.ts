export type SessionType = "economica" | "magna" | "conjunta";
export type Grau = "Aprendiz" | "Companheiro" | "Mestre";

export type SessionConfig = {
  grau: Grau;
  numSessao: number;
  dataISO: string;     // YYYY-MM-DD
  horaInicio: string;  // HH:mm
  horaEnc: string;     // HH:mm
  numPresenca: number;
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

export type DocumentType =
  | "Prancha/Edital"
  | "Ato/Decreto"
  | "Ofício"
  | "Comunicação";

export type Documento = {
  id: string;
  type: DocumentType;
  number: string;
  origin: string;
  subject: string;
};

export type DocumentDraft = Omit<Documento, "id">;

export type StatusKind = "success" | "error" | "info";

export type StatusState = {
  kind: StatusKind;
  text: string;
} | null;

export type PreviewData = {
  lojaConfig: LojaConfig;
  sessionType: SessionType;
  sessionConfig: SessionConfig;
  magnaFields: MagnaFields;
  documents: Documento[];
  visitors: string[];
  officers: Officers;
  tronco: number;
  ordemDia: string;
  pbo: PalavraBemOrdem;
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