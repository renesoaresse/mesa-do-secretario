import type { Gestao, Obreiro, OficiaisAdHoc, Officers, Rito } from '../../../types/ata';
import { cargoDoRito, nomeDoCargo } from './cargos';

export type ObreiroComCargo = Obreiro & {
  /** Nome completo do cargo na gestão vigente; vazio quando o irmão não ocupa cargo. */
  cargo: string;
};

/** Sufixo aplicado nas referências da ata quando o oficial não é o titular do cargo. */
export const SUFIXO_AD_HOC = ' - ADHOC';

const SEM_CARGO: Record<keyof Officers, string> = {
  vm: '',
  vig1: '',
  vig2: '',
  or: '',
  sec: '',
  tes: '',
};

/**
 * Cargo da gestão que corresponde a cada oficial pedido na ata.
 * Os ritos ainda sem ritual próprio herdam a ata do REAA e ficam sem mapa.
 */
export const CARGO_DO_OFICIAL: Record<Rito, Record<keyof Officers, string>> = {
  'Rito Escocês Antigo e Aceito': {
    ...SEM_CARGO,
    vm: 'V∴M∴',
    vig1: '1º Vig∴',
    vig2: '2º Vig∴',
    or: 'Orad∴',
    sec: 'Secr∴',
  },
  'Rito Adonhiramita': { ...SEM_CARGO },
  // No Rito de York a sigla do cargo é o próprio nome e não há Orador.
  'Rito de York': {
    ...SEM_CARGO,
    vm: 'Venerável Mestre',
    vig1: '1º Vigilante',
    vig2: '2º Vigilante',
    sec: 'Secretário',
    tes: 'Tesoureiro',
  },
  'Rito de Emulação': { ...SEM_CARGO },
};

const OFICIAIS_VAZIOS: Officers = { ...SEM_CARGO };

/** Nome do cargo usado enquanto o rito não mapeia os seus. */
const ROTULO_PADRAO: Record<keyof Officers, string> = {
  vm: 'Venerável Mestre',
  vig1: '1º Vigilante',
  vig2: '2º Vigilante',
  or: 'Orador',
  sec: 'Secretário',
  tes: 'Tesoureiro',
};

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
    // Gestão lavrada em outro rito: o cargo não existe aqui e some do quadro,
    // em vez de vazar a sigla do rito antigo para dentro da ata.
    const doRito = atribuicao ? cargoDoRito(atribuicao.cargo, rito) : false;

    return {
      ...obreiro,
      cargo: doRito && atribuicao ? nomeDoCargo(atribuicao.cargo, rito) : '',
    };
  });
}

/** Como o rito nomeia o cargo de cada oficial pedido na ata. */
export function rotuloDoOficial(oficial: keyof Officers, rito: Rito | ''): string {
  const sigla = rito ? CARGO_DO_OFICIAL[rito][oficial] : '';

  return sigla ? nomeDoCargo(sigla, rito) : ROTULO_PADRAO[oficial];
}

function mesmoNome(a: string, b: string): boolean {
  return a.trim().toLocaleUpperCase('pt-BR') === b.trim().toLocaleUpperCase('pt-BR');
}

/**
 * Diz se a gestão informada é base confiável para apontar quem é ad hoc: precisa existir,
 * ter atribuições e um rito com os cargos mapeados. Sem isso nada é marcado.
 */
export function gestaoDefineOficiais(
  gestao: Gestao | undefined,
  rito: Rito | '',
  oficiaisMarcados: OficiaisAdHoc,
): boolean {
  if (!gestao || !rito || gestao.atribuicoes.length === 0) return false;

  const cargoDoOficial = CARGO_DO_OFICIAL[rito];

  return oficiaisMarcados.some((oficial) => cargoDoOficial[oficial] !== '');
}

/**
 * Quais dos oficiais marcados pelo rito ocupam o cargo sem ser o titular da gestão,
 * inclusive quando o cargo está vago nela. Com `gestaoConhecida` falso (gestão ausente
 * ou rito sem cargos mapeados) ninguém é apontado. Como cada rito escreve o ad hoc de
 * um jeito, aqui só sai a lista: quem redige é o documento.
 */
export function oficiaisAdHocDaSessao(
  officers: Officers,
  titulares: Officers,
  gestaoConhecida: boolean,
  oficiaisMarcados: OficiaisAdHoc,
): OficiaisAdHoc {
  if (!gestaoConhecida) return [];

  return oficiaisMarcados.filter((oficial) => {
    const nome = officers[oficial].trim();

    return Boolean(nome) && !mesmoNome(nome, titulares[oficial].trim());
  });
}

/** "FULANO" + " - ADHOC" quando o oficial não é o titular; é a forma do REAA. */
export function comSufixoAdHoc(nome: string, ehAdHoc: boolean): string {
  return ehAdHoc && nome.trim() ? `${nome}${SUFIXO_AD_HOC}` : nome;
}
