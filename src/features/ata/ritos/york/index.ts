import type { ModuloAta } from '../../types';
import { DocumentoYork } from './DocumentoYork';

export const MODULO_YORK: ModuloAta = {
  rito: 'Rito de York',
  slug: 'york',
  label: 'Rito de York',
  Documento: DocumentoYork,
  // Na ordem em que as seções aparecem na ata do rito.
  secoes: [
    'oficiais',
    'pranchas',
    'atos',
    'decretos',
    'leituraAtas',
    'visitantes',
    'expedientes',
    'ordemDia',
    'pboLivre',
    'tronco',
  ],
  // O Rito de York não tem Orador; quem é nomeado na direção é o Tesoureiro.
  oficiais: ['vm', 'vig1', 'vig2', 'tes', 'sec'],
  oficiaisAdHoc: ['vm', 'vig1', 'vig2', 'tes', 'sec'],
};

export { DocumentoYork };
