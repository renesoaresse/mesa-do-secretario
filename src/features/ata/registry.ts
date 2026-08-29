import type { Rito } from '../../types/ata';
import type { ModuloAta } from './types';
import { MODULO_ESCOCES } from './ritos/escoces';
import { MODULO_ADONHIRAMITA } from './ritos/adonhiramita';
import { MODULO_YORK } from './ritos/york';
import { MODULO_EMULACAO } from './ritos/emulacao';

/** Módulo de ata de cada rito, indexado pelo rito cadastrado na loja. */
export const MODULOS_ATA: Record<Rito, ModuloAta> = {
  'Rito Escocês Antigo e Aceito': MODULO_ESCOCES,
  'Rito Adonhiramita': MODULO_ADONHIRAMITA,
  'Rito de York': MODULO_YORK,
  'Rito de Emulação': MODULO_EMULACAO,
};

export const MODULOS_ATA_LISTA: ModuloAta[] = Object.values(MODULOS_ATA);

/** O módulo do rito da loja; nada sem rito escolhido. */
export function moduloAtaDoRito(rito: Rito | ''): ModuloAta | null {
  return rito ? (MODULOS_ATA[rito] ?? null) : null;
}

/** O módulo por trecho de URL, para validar /ata/<slug> digitado à mão. */
export function moduloAtaPorSlug(slug: string): ModuloAta | null {
  return MODULOS_ATA_LISTA.find((modulo) => modulo.slug === slug) ?? null;
}
