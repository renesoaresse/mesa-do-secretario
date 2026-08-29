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
  'Rito de York': [
    { sigla: 'Venerável Mestre', nome: 'Venerável Mestre' },
    { sigla: 'Past Master', nome: 'Past Master' },
    { sigla: '1º Vigilante', nome: '1º Vigilante' },
    { sigla: '2º Vigilante', nome: '2º Vigilante' },
    { sigla: '1º Diácono', nome: '1º Diácono' },
    { sigla: '2º Diácono', nome: '2º Diácono' },
    { sigla: 'Capelão', nome: 'Capelão' },
    { sigla: 'Marechal', nome: 'Marechal' },
    { sigla: 'Secretário', nome: 'Secretário' },
    { sigla: 'Tesoureiro', nome: 'Tesoureiro' },
    { sigla: '1º Mestre de Cerimônias', nome: '1º Mestre de Cerimônias' },
    { sigla: '2º Mestre de Cerimônias', nome: '2º Mestre de Cerimônias' },
    { sigla: '1º Mordomo', nome: '1º Mordomo' },
    { sigla: '2º Mordomo', nome: '2º Mordomo' },
    { sigla: 'Organista', nome: 'Organista' },
    { sigla: 'Cobridor', nome: 'Cobridor' },
  ],
  'Rito de Emulação': [
    { sigla: 'Venerável Mestre', nome: 'Venerável Mestre' },
    { sigla: '1º Vigilante', nome: '1º Vigilante' },
    { sigla: '2º Vigilante', nome: '2º Vigilante' },
    { sigla: 'Venerável Mestre Imediato', nome: 'Venerável Mestre Imediato' },
    { sigla: 'Capelão', nome: 'Capelão' },
    { sigla: 'Secretário Adjunto', nome: 'Secretário Adjunto' },
    { sigla: 'Secretário', nome: 'Secretário' },
    { sigla: 'Tesoureiro', nome: 'Tesoureiro' },
    { sigla: '1º Diácono', nome: '1º Diácono' },
    { sigla: '2º Diácono', nome: '2º Diácono' },
    { sigla: 'Guarda Interno', nome: 'Guarda Interno' },
    { sigla: 'Cobridor', nome: 'Cobridor' },
    { sigla: 'Organicista', nome: 'Organicista' },
    { sigla: 'Diretor de Cerimônias', nome: 'Diretor de Cerimônias' },
    { sigla: 'Diretor de Cerimônias Adjunto', nome: 'Diretor de Cerimônias Adjunto' },
    { sigla: 'Esmoler', nome: 'Esmoler' },
    { sigla: 'Administrador de Caridade', nome: 'Administrador de Caridade' },
    { sigla: '1º Mordomo', nome: '1º Mordomo' },
    { sigla: '2º Mordomo', nome: '2º Mordomo' },
  ],
};

export function cargosDoRito(rito: Rito | ''): CargoRito[] {
  return rito ? CARGOS_POR_RITO[rito] : [];
}

/** Diz se a sigla é um cargo do rito informado. */
export function cargoDoRito(sigla: string, rito: Rito | ''): boolean {
  return cargosDoRito(rito).some((cargo) => cargo.sigla === sigla);
}

/** Nome completo do cargo; devolve a própria sigla quando não houver correspondência. */
export function nomeDoCargo(sigla: string, rito: Rito | ''): string {
  return cargosDoRito(rito).find((cargo) => cargo.sigla === sigla)?.nome ?? sigla;
}
