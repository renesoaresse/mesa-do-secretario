import type { ModuloAta } from '../../types';
import { DocumentoEscoces } from './DocumentoEscoces';

export const MODULO_ESCOCES: ModuloAta = {
  rito: 'Rito Escocês Antigo e Aceito',
  slug: 'escoces',
  label: 'Rito Escocês Antigo e Aceito',
  Documento: DocumentoEscoces,
  secoes: [
    'oficiais',
    'balaustre',
    'atosDecretos',
    'expedientes',
    'bolsaPropostas',
    'ordemDia',
    'tronco',
    'visitantes',
    'pbo',
  ],
  oficiais: ['vm', 'vig1', 'vig2', 'or', 'sec'],
  // Só Orador e Secretário são marcados na ata do REAA.
  oficiaisAdHoc: ['or', 'sec'],
};

export { DocumentoEscoces };
