import type { AtaDraft } from '../types/ata';

export const DEFAULT_ATA_DRAFT: AtaDraft = {
  sessionType: 'economica',
  sessionConfig: {
    numSessao: 1,
    dataSessao: '',
    tipoSessao: 'ordinaria',
    horaInicio: '',
    horaTermino: '',
  },
  magnaFields: {
    nomeArquitetura: '',
    dataInstalacao: '',
    numeroLoja: '',
    rgeup: '',
    Oriente: '',
    Valle: '',
  },
  visitors: [],
  officers: {
    VeneravelMaster: '',
    PrimeiroGuarda: '',
    SegundoGuarda: '',
    Orador: '',
    Chanceler: '',
    Tesoureiro: '',
    PrimeiroDiacono: '',
    SegundoDiacono: '',
    MestreCerimoniais: '',
    Hospede: '',
    Experto: '',
  },
  tronco: 0,
  ordemDia: '',
  pbo: {
    palavraBemDaOrdem: '',
    palavraDeOrdem: '',
  },
  balaustreTexto: '',
  atosDecretosTexto: '',
  expedientesTexto: '',
  bolsaPropostasTexto: '',
  lojaConfig: {
    nomeLoja: '',
    numeroLoja: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
  },
};

export { ROUTES } from './routes';
export { AppRouter } from './index';
export { AppRoutes } from './routes';
