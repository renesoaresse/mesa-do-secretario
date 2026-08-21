import type { Gestao, Obreiro, Officers, Rito } from '../../../types/ata';
import { nomeDoCargo } from './cargos';

export type ObreiroComCargo = Obreiro & {
  /** Nome completo do cargo na gestão vigente; vazio quando o irmão não ocupa cargo. */
  cargo: string;
};

/** Sufixo aplicado nas referências da ata quando o oficial não é o titular do cargo. */
export const SUFIXO_AD_HOC = ' - ADHOC';

/**
 * Cargo da gestão que corresponde a cada oficial pedido na ata.
 * Só o REAA foi mapeado até agora; os demais ritos entram quando forem definidos.
 */
export const CARGO_DO_OFICIAL: Record<Rito, Record<keyof Officers, string>> = {
  'Rito Escocês Antigo e Aceito': {
    vm: 'V∴M∴',
    vig1: '1º Vig∴',
    vig2: '2º Vig∴',
    or: 'Orad∴',
    sec: 'Secr∴',
  },
  'Rito Adonhiramita': { vm: '', vig1: '', vig2: '', or: '', sec: '' },
  'Rito de York': { vm: '', vig1: '', vig2: '', or: '', sec: '' },
  'Rito de Emulação': { vm: '', vig1: '', vig2: '', or: '', sec: '' },
};

const OFICIAIS_VAZIOS: Officers = { vm: '', vig1: '', vig2: '', or: '', sec: '' };

/** A gestão marcada como vigente; sem nenhuma marcada, a mais recente cadastrada. */
export function gestaoVigente(gestoes: Gestao[]): Gestao | undefined {
  const porAnoDecrescente = [...gestoes].sort((a, b) =>
    b.ano.localeCompare(a.ano, 'pt-BR', { numeric: true }),
  );

  return porAnoDecrescente.find((gestao) => gestao.vigente) ?? porAnoDecrescente[0];
}

/** Nome do obreiro que ocupa cada cargo de oficial na gestão informada. */
export function titularesDosOficiais(
  gestao: Gestao | undefined,
  obreiros: Obreiro[],
  rito: Rito | '',
): Officers {
  if (!gestao || !rito) return OFICIAIS_VAZIOS;

  const cargoDoOficial = CARGO_DO_OFICIAL[rito];
  const titulares = { ...OFICIAIS_VAZIOS };

  for (const oficial of Object.keys(titulares) as (keyof Officers)[]) {
    const cargo = cargoDoOficial[oficial];
    if (!cargo) continue;

    const atribuicao = gestao.atribuicoes.find((item) => item.cargo === cargo);
    if (!atribuicao) continue;

    titulares[oficial] =
      obreiros.find((obreiro) => obreiro.id === atribuicao.obreiroId)?.nome ?? '';
  }

  return titulares;
}

/** Quadro de obreiros anotado com o cargo que cada um ocupa na gestão informada. */
export function obreirosComCargo(
  gestao: Gestao | undefined,
  obreiros: Obreiro[],
  rito: Rito | '',
): ObreiroComCargo[] {
  return obreiros.map((obreiro) => {
    const atribuicao = gestao?.atribuicoes.find((item) => item.obreiroId === obreiro.id);

    return {
      ...obreiro,
      cargo: atribuicao ? nomeDoCargo(atribuicao.cargo, rito) : '',
    };
  });
}

function mesmoNome(a: string, b: string): boolean {
  return a.trim().toLocaleUpperCase('pt-BR') === b.trim().toLocaleUpperCase('pt-BR');
}

/**
 * Marca com " - ADHOC" quem está ocupando um cargo sem ser o titular da gestão.
 * Sem titular conhecido (gestão ausente ou cargo vago) nada é marcado.
 */
export function aplicarSufixoAdHoc(officers: Officers, titulares: Officers): Officers {
  const comSufixo = { ...officers };

  for (const oficial of Object.keys(comSufixo) as (keyof Officers)[]) {
    const nome = comSufixo[oficial].trim();
    const titular = titulares[oficial].trim();

    if (nome && titular && !mesmoNome(nome, titular)) {
      comSufixo[oficial] = `${nome}${SUFIXO_AD_HOC}`;
    }
  }

  return comSufixo;
}
