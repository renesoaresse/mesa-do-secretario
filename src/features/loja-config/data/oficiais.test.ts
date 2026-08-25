import { describe, expect, it } from 'vitest';
import {
  aplicarSufixoAdHoc,
  gestaoDefineOficiais,
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
      vm: 'ABEL SANTOS',
      vig1: '',
      vig2: '',
      or: '',
      sec: 'BRUNO LIMA',
    });
  });

  it('devolve tudo vazio sem gestao ou sem rito', () => {
    const vazio = { vm: '', vig1: '', vig2: '', or: '', sec: '' };

    expect(titularesDosOficiais(undefined, obreiros, REAA)).toEqual(vazio);
    expect(titularesDosOficiais(gestao, obreiros, '')).toEqual(vazio);
  });
});

describe('aplicarSufixoAdHoc', () => {
  const titulares = {
    vm: 'ABEL SANTOS',
    vig1: '',
    vig2: '',
    or: 'DANIEL ROCHA',
    sec: 'BRUNO LIMA',
  };

  it('nao marca quem e o titular do cargo', () => {
    const officers = {
      vm: 'ABEL SANTOS',
      vig1: '',
      vig2: '',
      or: 'DANIEL ROCHA',
      sec: 'BRUNO LIMA',
    };

    expect(aplicarSufixoAdHoc(officers, titulares, true)).toEqual(officers);
  });

  it('marca o orador e o secretario que estao substituindo o titular', () => {
    const officers = { vm: '', vig1: '', vig2: '', or: 'CARLOS', sec: 'ELIAS' };
    const comSufixo = aplicarSufixoAdHoc(officers, titulares, true);

    expect(comSufixo.or).toBe('CARLOS - ADHOC');
    expect(comSufixo.sec).toBe('ELIAS - ADHOC');
  });

  it('nao marca os demais oficiais fora do cargo', () => {
    const officers = { vm: 'CARLOS', vig1: 'FABIO', vig2: 'GABRIEL', or: '', sec: '' };
    const comSufixo = aplicarSufixoAdHoc(officers, titulares, true);

    expect(comSufixo.vm).toBe('CARLOS');
    expect(comSufixo.vig1).toBe('FABIO');
    expect(comSufixo.vig2).toBe('GABRIEL');
  });

  it('ignora diferenca de caixa e espacos', () => {
    const officers = { vm: '', vig1: '', vig2: '', or: '', sec: '  bruno lima ' };

    // Reconhecido como titular: segue sem sufixo, com o texto original preservado.
    expect(aplicarSufixoAdHoc(officers, titulares, true).sec).toBe('  bruno lima ');
  });

  it('marca o cargo vago na gestao, porque ninguem e titular dele', () => {
    const semTitularOr = { ...titulares, or: '' };
    const officers = { vm: '', vig1: '', vig2: '', or: 'QUALQUER UM', sec: '' };

    expect(aplicarSufixoAdHoc(officers, semTitularOr, true).or).toBe('QUALQUER UM - ADHOC');
  });

  it('nao marca nada quando a gestao nao e base confiavel', () => {
    const officers = { vm: '', vig1: '', vig2: '', or: 'CARLOS', sec: 'ELIAS' };

    expect(aplicarSufixoAdHoc(officers, titulares, false)).toEqual(officers);
  });
});

describe('gestaoDefineOficiais', () => {
  const gestao: Gestao = {
    id: 'g1',
    ano: '2026',
    vigente: true,
    atribuicoes: [{ obreiroId: 'a', cargo: 'V∴M∴' }],
  };

  it('aceita gestao com atribuicoes em rito com cargos mapeados', () => {
    expect(gestaoDefineOficiais(gestao, REAA)).toBe(true);
  });

  it('recusa gestao ausente, sem atribuicoes ou rito sem cargos mapeados', () => {
    expect(gestaoDefineOficiais(undefined, REAA)).toBe(false);
    expect(gestaoDefineOficiais({ ...gestao, atribuicoes: [] }, REAA)).toBe(false);
    expect(gestaoDefineOficiais(gestao, '')).toBe(false);
    expect(gestaoDefineOficiais(gestao, 'Rito de York')).toBe(false);
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
});
