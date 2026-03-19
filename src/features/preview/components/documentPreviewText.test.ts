import { describe, expect, it } from 'vitest';
import { makePbo } from '../../../test/factories';
import {
  formatPalavraBemOrdemEntries,
  gerarTextoPresenca,
  gerarTextoSaudacao,
} from './documentPreviewText';

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
    expect(gerarTextoPresenca(12, ['Visitante 1', 'Visitante 2'])).toContain('IIr∴ visitantes');
  });

  it('gera saudacao padrao quando nao houver visitantes', () => {
    expect(gerarTextoSaudacao([], 'Orador Teste')).toBe('Foi suprimido por não ter visitantes.');
  });

  it('mantem entidades escapadas e nomes de visitantes como texto literal', () => {
    expect(gerarTextoSaudacao(['&lt;Visitante&gt;'], 'Orador Teste')).toContain(
      '&lt;Visitante&gt;',
    );
  });
});
