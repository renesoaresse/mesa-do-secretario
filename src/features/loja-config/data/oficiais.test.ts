import { describe, expect, it } from 'vitest';
import {
  comSufixoAdHoc,
  rotuloDoOficial,
  gestaoDefineOficiais,
  oficiaisAdHocDaSessao,
  gestaoVigente,
  obreirosComCargo,
  titularesDosOficiais,
} from './oficiais';
import type { Gestao, Obreiro } from '../../../types/ata';

const REAA = 'Rito Escocês Antigo e Aceito' as const;

const obreiros: Obreiro[] = [
  { id: 'a', nome: 'ABEL SANTOS', cim: '1', grau: 'M∴M∴' },
  { id: 'b', nome: 'BRUNO LIMA', cim: '2', grau: 'M∴M∴' },
];

const gestao: Gestao = {
  id: 'g1',
  ano: '2026',
  vigente: true,
  atribuicoes: [
    { obreiroId: 'a', cargo: 'V∴M∴' },
    { obreiroId: 'b', cargo: 'Secr∴' },
  ],
};

describe('gestaoVigente', () => {
  it('usa a gestao marcada como vigente, mesmo nao sendo a mais recente', () => {
    const escolhida = gestaoVigente([
      { id: 'g1', ano: '2026', vigente: false, atribuicoes: [] },
      { id: 'g2', ano: '2024', vigente: true, atribuicoes: [] },
    ]);

    expect(escolhida?.ano).toBe('2024');
  });

  it('cai na mais recente quando nenhuma esta marcada', () => {
    const escolhida = gestaoVigente([
      { id: 'g2', ano: '2024', vigente: false, atribuicoes: [] },
      { id: 'g1', ano: '2026', vigente: false, atribuicoes: [] },
    ]);

    expect(escolhida?.ano).toBe('2026');
  });

  it('devolve undefined sem gestoes', () => {
    expect(gestaoVigente([])).toBeUndefined();
  });
});

describe('titularesDosOficiais', () => {
  it('mapeia os cargos do REAA para os oficiais da ata', () => {
    expect(titularesDosOficiais(gestao, obreiros, REAA)).toEqual({
      tes: '',
      vm: 'ABEL SANTOS',
      vig1: '',
      vig2: '',
      or: '',
      sec: 'BRUNO LIMA',
    });
  });

  it('devolve tudo vazio sem gestao ou sem rito', () => {
    const vazio = { vm: '', vig1: '', vig2: '', or: '', sec: '', tes: '' };

    expect(titularesDosOficiais(undefined, obreiros, REAA)).toEqual(vazio);
    expect(titularesDosOficiais(gestao, obreiros, '')).toEqual(vazio);
  });
});

describe('oficiaisAdHocDaSessao', () => {
  const OFICIAIS_REAA = ['or', 'sec'] as const;

  const titulares = {
    vm: 'ABEL SANTOS',
    vig1: '',
    vig2: '',
    or: 'DANIEL ROCHA',
    sec: 'BRUNO LIMA',
    tes: '',
  };

  it('nao aponta quem e o titular do cargo', () => {
    const officers = {
      vm: 'ABEL SANTOS',
      vig1: '',
      vig2: '',
      or: 'DANIEL ROCHA',
      sec: 'BRUNO LIMA',
      tes: '',
    };

    expect(oficiaisAdHocDaSessao(officers, titulares, true, OFICIAIS_REAA)).toEqual([]);
  });

  it('aponta o orador e o secretario que estao substituindo o titular', () => {
    const officers = { vm: '', vig1: '', vig2: '', or: 'CARLOS', sec: 'ELIAS', tes: '' };

    expect(oficiaisAdHocDaSessao(officers, titulares, true, OFICIAIS_REAA)).toEqual(['or', 'sec']);
  });

  it('so aponta os oficiais que o rito manda marcar', () => {
    const officers = { vm: 'CARLOS', vig1: 'FABIO', vig2: 'GABRIEL', or: '', sec: '', tes: '' };

    expect(oficiaisAdHocDaSessao(officers, titulares, true, OFICIAIS_REAA)).toEqual([]);
  });

  it('marca os demais oficiais quando o rito os inclui', () => {
    const officers = { vm: 'CARLOS', vig1: 'FABIO', vig2: '', or: '', sec: '', tes: 'HELIO' };
    const oficiaisYork = ['vm', 'vig1', 'vig2', 'tes', 'sec'] as const;

    expect(oficiaisAdHocDaSessao(officers, titulares, true, oficiaisYork)).toEqual([
      'vm',
      'vig1',
      'tes',
    ]);
  });

  it('ignora diferenca de caixa e espacos', () => {
    const officers = { vm: '', vig1: '', vig2: '', or: '', sec: '  bruno lima ', tes: '' };

    expect(oficiaisAdHocDaSessao(officers, titulares, true, OFICIAIS_REAA)).toEqual([]);
  });

  it('marca o cargo vago na gestao, porque ninguem e titular dele', () => {
    const semTitularOr = { ...titulares, or: '' };
    const officers = { vm: '', vig1: '', vig2: '', or: 'QUALQUER UM', sec: '', tes: '' };

    expect(oficiaisAdHocDaSessao(officers, semTitularOr, true, OFICIAIS_REAA)).toEqual(['or']);
  });

  it('nao aponta ninguem quando a gestao nao e base confiavel', () => {
    const officers = { vm: '', vig1: '', vig2: '', or: 'CARLOS', sec: 'ELIAS', tes: '' };

    expect(oficiaisAdHocDaSessao(officers, titulares, false, OFICIAIS_REAA)).toEqual([]);
  });
});

describe('comSufixoAdHoc', () => {
  it('cola o sufixo no nome de quem esta ad hoc', () => {
    expect(comSufixoAdHoc('CARLOS', true)).toBe('CARLOS - ADHOC');
  });

  it('devolve o nome intacto fora do ad hoc e no cargo vazio', () => {
    expect(comSufixoAdHoc('CARLOS', false)).toBe('CARLOS');
    expect(comSufixoAdHoc('', true)).toBe('');
  });
});

describe('gestaoDefineOficiais', () => {
  const gestao: Gestao = {
    id: 'g1',
    ano: '2026',
    vigente: true,
    atribuicoes: [{ obreiroId: 'a', cargo: 'V∴M∴' }],
  };

  const OFICIAIS_REAA = ['or', 'sec'] as const;

  it('aceita gestao com atribuicoes em rito com cargos mapeados', () => {
    expect(gestaoDefineOficiais(gestao, REAA, OFICIAIS_REAA)).toBe(true);
  });

  it('recusa gestao ausente, sem atribuicoes ou rito sem cargos mapeados', () => {
    expect(gestaoDefineOficiais(undefined, REAA, OFICIAIS_REAA)).toBe(false);
    expect(gestaoDefineOficiais({ ...gestao, atribuicoes: [] }, REAA, OFICIAIS_REAA)).toBe(false);
    expect(gestaoDefineOficiais(gestao, '', OFICIAIS_REAA)).toBe(false);
    expect(gestaoDefineOficiais(gestao, 'Rito Adonhiramita', OFICIAIS_REAA)).toBe(false);
  });
});

describe('rotuloDoOficial', () => {
  it('nomeia o cargo como o rito o nomeia', () => {
    expect(rotuloDoOficial('vm', REAA)).toBe('Venerável Mestre');
    expect(rotuloDoOficial('or', REAA)).toBe('Orador');
    expect(rotuloDoOficial('tes', 'Rito de York')).toBe('Tesoureiro');
    expect(rotuloDoOficial('vig1', 'Rito de York')).toBe('1º Vigilante');
  });

  it('cai no rotulo padrao onde o rito ainda nao mapeia o cargo', () => {
    // O Rito de York não tem Orador; o REAA não nomeia Tesoureiro na ata.
    expect(rotuloDoOficial('or', 'Rito de York')).toBe('Orador');
    expect(rotuloDoOficial('tes', REAA)).toBe('Tesoureiro');
    expect(rotuloDoOficial('vm', '')).toBe('Venerável Mestre');
  });
});

describe('obreirosComCargo', () => {
  it('anota o nome completo do cargo de cada irmao na gestao', () => {
    expect(obreirosComCargo(gestao, obreiros, REAA)).toEqual([
      { id: 'a', nome: 'ABEL SANTOS', cim: '1', grau: 'M∴M∴', cargo: 'Venerável Mestre' },
      { id: 'b', nome: 'BRUNO LIMA', cim: '2', grau: 'M∴M∴', cargo: 'Secretário' },
    ]);
  });

  it('deixa o cargo vazio para quem nao ocupa nenhum', () => {
    const semCargo = obreirosComCargo(
      { id: 'g2', ano: '2026', vigente: true, atribuicoes: [] },
      obreiros,
      REAA,
    );

    expect(semCargo.map((obreiro) => obreiro.cargo)).toEqual(['', '']);
  });

  it('mantem o quadro completo sem gestao cadastrada', () => {
    expect(obreirosComCargo(undefined, obreiros, REAA)).toHaveLength(2);
  });

  it('ignora cargo de gestao lavrada em outro rito', () => {
    // A gestão guarda siglas do REAA; sob o Rito de York elas não existem.
    const noYork = obreirosComCargo(gestao, obreiros, 'Rito de York');

    expect(noYork.map((obreiro) => obreiro.cargo)).toEqual(['', '']);
  });

  it('anota o cargo quando a gestao e do mesmo rito', () => {
    const gestaoYork: Gestao = {
      id: 'g3',
      ano: '2026',
      vigente: true,
      atribuicoes: [{ obreiroId: 'a', cargo: 'Venerável Mestre' }],
    };

    expect(obreirosComCargo(gestaoYork, obreiros, 'Rito de York')[0].cargo).toBe(
      'Venerável Mestre',
    );
  });
});
