import type { ModuloAta } from '../../types';
import { MODULO_ESCOCES } from '../escoces';
import { DocumentoEmulacao } from './DocumentoEmulacao';

export const MODULO_EMULACAO: ModuloAta = {
  rito: 'Rito de Emulação',
  slug: 'emulacao',
  label: 'Rito de Emulação',
  Documento: DocumentoEmulacao,
  secoes: MODULO_ESCOCES.secoes,
  oficiais: MODULO_ESCOCES.oficiais,
  oficiaisAdHoc: MODULO_ESCOCES.oficiaisAdHoc,
};

export { DocumentoEmulacao };
