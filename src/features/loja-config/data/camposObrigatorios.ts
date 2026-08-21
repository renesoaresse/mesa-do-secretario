import type { LojaConfig } from '../../../types/ata';

/** A logo é opcional; todo o resto precisa estar preenchido. */
const CAMPOS_OBRIGATORIOS = [
  'nomeLoja',
  'rito',
  'numeroLoja',
  'dataFundacaoISO',
  'temploNome',
  'enderecoTemplo',
  'cidadeEstado',
] as const satisfies readonly (keyof LojaConfig)[];

export function isLojaConfigCompleta(lojaConfig: LojaConfig): boolean {
  return CAMPOS_OBRIGATORIOS.every((campo) => (lojaConfig[campo] ?? '').trim() !== '');
}
