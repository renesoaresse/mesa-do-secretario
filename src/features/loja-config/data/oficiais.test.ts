import { describe, expect, it } from 'vitest';
import {
  aplicarSufixoAdHoc,
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
  const titulares = { vm: 'ABEL SANTOS', vig1: '', vig2: '', or: '', sec: 'BRUNO LIMA' };

  it('nao marca quem e o titular do cargo', () => {
    const officers = { vm: 'ABEL SANTOS', vig1: '', vig2: '', or: '', sec: 'BRUNO LIMA' };

    expect(aplicarSufixoAdHoc(officers, titulares)).toEqual(officers);
  });

  it('marca quem esta substituindo o titular', () => {
    const officers = { vm: 'CARLOS', vig1: '', vig2: '', or: '', sec: 'BRUNO LIMA' };

    expect(aplicarSufixoAdHoc(officers, titulares).vm).toBe('CARLOS - ADHOC');
  });

  it('ignora diferenca de caixa e espacos', () => {
    const officers = { vm: '  abel santos ', vig1: '', vig2: '', or: '', sec: '' };

    // Reconhecido como titular: segue sem sufixo, com o texto original preservado.
    expect(aplicarSufixoAdHoc(officers, titulares).vm).toBe('  abel santos ');
  });

  it('nao marca cargo sem titular conhecido', () => {
    const officers = { vm: '', vig1: 'QUALQUER UM', vig2: '', or: '', sec: '' };

    expect(aplicarSufixoAdHoc(officers, titulares).vig1).toBe('QUALQUER UM');
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
