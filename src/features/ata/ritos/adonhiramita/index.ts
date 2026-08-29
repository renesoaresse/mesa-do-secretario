import type { ModuloAta } from '../../types';
import { MODULO_ESCOCES } from '../escoces';
import { DocumentoAdonhiramita } from './DocumentoAdonhiramita';

export const MODULO_ADONHIRAMITA: ModuloAta = {
  rito: 'Rito Adonhiramita',
  slug: 'adonhiramita',
  label: 'Rito Adonhiramita',
  Documento: DocumentoAdonhiramita,
  secoes: MODULO_ESCOCES.secoes,
  oficiais: MODULO_ESCOCES.oficiais,
  oficiaisAdHoc: MODULO_ESCOCES.oficiaisAdHoc,
};

export { DocumentoAdonhiramita };
