import type { Rito } from '../../../types/ata';

export type CargoRito = {
  /** Abreviatura usada na ata e gravada na gestão. */
  sigla: string;
  nome: string;
};

/**
 * Cargos oficiais por rito. Apenas o Rito Escocês Antigo e Aceito foi
 * especificado até agora; os demais entram aqui quando forem definidos.
 */
export const CARGOS_POR_RITO: Record<Rito, CargoRito[]> = {
  'Rito Escocês Antigo e Aceito': [
    { sigla: 'V∴M∴', nome: 'Venerável Mestre' },
    { sigla: '1º Vig∴', nome: '1º Vigilante' },
    { sigla: '2º Vig∴', nome: '2º Vigilante' },
    { sigla: 'Tes∴', nome: 'Tesoureiro' },
    { sigla: 'Orad∴', nome: 'Orador' },
    { sigla: 'Chanc∴', nome: 'Chanceler' },
    { sigla: 'M∴CCer∴', nome: 'Mestre de Cerimônias' },
    { sigla: 'Secr∴', nome: 'Secretário' },
    { sigla: 'Hosp∴', nome: 'Hospitaleiro' },
    { sigla: 'G∴T∴', nome: 'Guarda do Templo' },
    { sigla: 'Cobr∴', nome: 'Cobridor' },
    { sigla: '1º Diác∴', nome: '1º Diácono' },
    { sigla: '2º Diác∴', nome: '2º Diácono' },
    { sigla: '1º Exp∴', nome: '1º Expert' },
    { sigla: '2º Exp∴', nome: '2º Expert' },
    { sigla: 'Porta Band∴', nome: 'Porta-Bandeira' },
    { sigla: 'Porta Esp∴', nome: 'Porta-Espada' },
    { sigla: 'Porta Estand∴', nome: 'Porta-Estandarte' },
    { sigla: 'M∴Banq∴', nome: 'Mestre de Banquetes' },
    { sigla: 'M∴Harm∴', nome: 'Mestre de Harmonia' },
    { sigla: 'Arq∴', nome: 'Arquiteto' },
    { sigla: 'Bibliot∴', nome: 'Bibliotecário' },
    { sigla: 'M∴I∴', nome: 'Mestre Instalador' },
  ],
  'Rito Adonhiramita': [],
  'Rito de York': [],
  'Rito de Emulação': [],
};

export function cargosDoRito(rito: Rito | ''): CargoRito[] {
  return rito ? CARGOS_POR_RITO[rito] : [];
}

/** Nome completo do cargo; devolve a própria sigla quando não houver correspondência. */
export function nomeDoCargo(sigla: string, rito: Rito | ''): string {
  return cargosDoRito(rito).find((cargo) => cargo.sigla === sigla)?.nome ?? sigla;
}
