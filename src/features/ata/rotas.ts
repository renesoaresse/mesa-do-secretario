import type { ModuloAta } from './types';

/** Prefixo comum dos módulos de ata: cada rito ocupa /ata/<slug>. */
export const ROTA_ATA = '/ata';

/** Endereço do módulo de ata de um rito. */
export function rotaDoModuloAta(modulo: ModuloAta): string {
  return `${ROTA_ATA}/${modulo.slug}`;
}
