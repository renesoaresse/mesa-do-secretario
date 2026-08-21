import { describe, expect, it } from 'vitest';
import { CARGOS_POR_RITO, cargosDoRito, nomeDoCargo } from './cargos';

const REAA = 'Rito Escocês Antigo e Aceito' as const;

describe('cargos do rito', () => {
  it('mantem sigla e nome completo para cada cargo do REAA', () => {
    const cargos = CARGOS_POR_RITO[REAA];

    expect(cargos).toHaveLength(23);
    expect(cargos[0]).toEqual({ sigla: 'V∴M∴', nome: 'Venerável Mestre' });
    expect(cargos.every((cargo) => cargo.sigla !== '' && cargo.nome !== '')).toBe(true);
  });

  it('nao repete siglas nem nomes', () => {
    const cargos = CARGOS_POR_RITO[REAA];

    expect(new Set(cargos.map((cargo) => cargo.sigla)).size).toBe(cargos.length);
    expect(new Set(cargos.map((cargo) => cargo.nome)).size).toBe(cargos.length);
  });

  it('devolve lista vazia sem rito escolhido', () => {
    expect(cargosDoRito('')).toEqual([]);
  });

  it('traduz a sigla para o nome completo', () => {
    expect(nomeDoCargo('G∴T∴', REAA)).toBe('Guarda do Templo');
    expect(nomeDoCargo('1º Exp∴', REAA)).toBe('1º Expert');
  });

  it('devolve a propria sigla quando o cargo e desconhecido', () => {
    expect(nomeDoCargo('Cargo∴', REAA)).toBe('Cargo∴');
    expect(nomeDoCargo('V∴M∴', '')).toBe('V∴M∴');
  });
});
