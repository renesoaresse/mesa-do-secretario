import { describe, expect, it } from 'vitest';
import { makePbo, makeVisitor } from '../../../test/factories';
import {
  formatPalavraBemOrdemEntries,
  gerarSufixoLojasConjunta,
  gerarTextoPresenca,
  gerarTextoSaudacao,
  joinNomes,
} from './documentPreviewText';

const loja = (nome: string, obreiros: number) => ({ id: nome, nome, obreiros });

describe('documentPreviewText', () => {
  it('gera fallback quando palavra a bem da ordem estiver vazia', () => {
    expect(formatPalavraBemOrdemEntries(makePbo({ sul: '', norte: '', oriente: '' }))).toEqual([]);
  });

  it('gera blocos apenas para colunas preenchidas', () => {
    expect(
      formatPalavraBemOrdemEntries(makePbo({ sul: 'Sul', norte: '', oriente: 'Oriente' })),
    ).toEqual([
      { key: 'sul', label: 'Coluna do Sul', value: 'Sul' },
      { key: 'oriente', label: 'Oriente', value: 'Oriente' },
    ]);
  });

  it('gera texto de presenca com pluralizacao de visitantes', () => {
    expect(
      gerarTextoPresenca(12, [makeVisitor({ nome: 'A' }), makeVisitor({ nome: 'B' })]),
    ).toContain('IIr∴ visitantes');
  });

  it('joinNomes usa "e" antes do ultimo item', () => {
    expect(joinNomes(['A'])).toBe('A');
    expect(joinNomes(['A', 'B'])).toBe('A e B');
    expect(joinNomes(['A', 'B', 'C'])).toBe('A, B e C');
  });

  it('sufixo de lojas conjuntas: 1 loja usa " e a"', () => {
    expect(gerarSufixoLojasConjunta([loja('Loja B', 0)])).toBe(' e a Loja B');
  });

  it('sufixo de lojas conjuntas: 2+ lojas usam virgula e "e a" antes da ultima', () => {
    expect(gerarSufixoLojasConjunta([loja('Loja B', 0), loja('Loja C', 0)])).toBe(
      ', a Loja B e a Loja C',
    );
  });

  it('sufixo vazio quando nao ha lojas conjuntas', () => {
    expect(gerarSufixoLojasConjunta([])).toBe('');
  });

  it('presenca inclui obreiros das lojas conjuntas com numero e extenso', () => {
    const texto = gerarTextoPresenca(12, [], [loja('Loja Tiradentes nº 06', 5)]);
    expect(texto).toContain('12 (doze) IIr∴ do quadro e 05 (cinco) IIr∴ da Loja Tiradentes nº 06');
  });

  it('presenca com 2+ lojas conjuntas usa virgula e "e" antes da ultima', () => {
    const texto = gerarTextoPresenca(12, [], [loja('Loja B', 3), loja('Loja C', 4)]);
    expect(texto).toContain(
      '12 (doze) IIr∴ do quadro, 03 (três) IIr∴ da Loja B e 04 (quatro) IIr∴ da Loja C',
    );
  });

  it('presenca em sessao conjunta encerra nas lojas e ignora clause de visitantes', () => {
    const texto = gerarTextoPresenca(
      10,
      [makeVisitor({ nome: 'A' }), makeVisitor({ nome: 'B' }), makeVisitor({ nome: 'C' })],
      [loja('Loja Segredo dos 33 nº 09', 12), loja('Loja 7 de Setembro nº 01', 20)],
    );
    expect(texto).toBe(
      'contando com a presença de 10 (dez) IIr∴ do quadro, 12 (doze) IIr∴ da Loja Segredo dos 33 nº 09 e 20 (vinte) IIr∴ da Loja 7 de Setembro nº 01 que assinaram o Livro de Presença.',
    );
    expect(texto).not.toContain('visitantes');
  });

  it('saudacao descreve visitante com loja, oriente e potencia', () => {
    const texto = gerarTextoSaudacao(
      [
        makeVisitor({
          nome: 'Fulano',
          lojaNome: 'Loja X',
          oriente: 'Aracaju/SE',
          potencia: 'GLMESE',
        }),
      ],
      'Orador Teste',
    );
    expect(texto).toContain(
      'Ir∴ visitante Fulano da Loja X do Oriente de Aracaju/SE filiado à Potência GLMESE',
    );
  });

  it('gera saudacao padrao quando nao houver visitantes', () => {
    expect(gerarTextoSaudacao([], 'Orador Teste')).toBe('Foi suprimido por não ter visitantes.');
  });

  it('mantem entidades escapadas e nomes de visitantes como texto literal', () => {
    expect(
      gerarTextoSaudacao([makeVisitor({ nome: '&lt;Visitante&gt;' })], 'Orador Teste'),
    ).toContain('&lt;Visitante&gt;');
  });
});
