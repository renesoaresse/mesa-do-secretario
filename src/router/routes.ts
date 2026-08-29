import { ROTA_ATA } from '../features/ata/rotas';

export const ROUTES = {
  HOME: '/',
  /** Sem tela própria: reencaminha para o módulo do rito cadastrado na loja. */
  ATA: ROTA_ATA,
  /** Qualquer rito na URL cai aqui e é conferido contra o cadastro da loja. */
  ATA_RITO: `${ROTA_ATA}/:slug`,
  ATA_ESCOCES: '/ata/escoces',
  ATA_ADONHIRAMITA: '/ata/adonhiramita',
  ATA_YORK: '/ata/york',
  ATA_EMULACAO: '/ata/emulacao',
  CONFIG: '/config',
  LOJAS: '/config/lojas',
  LOJA_NOVA: '/config/lojas/nova',
  LOJA_CONFIG: '/config/loja',
} as const;
