import { describe, expect, it } from 'vitest';
import { computePageOffsets, mergeLineRects, PAGE_CONTENT_HEIGHT } from './useLineNumbers';

describe('mergeLineRects', () => {
  it('agrupa retangulos que comecam na mesma altura como uma unica linha', () => {
    const lines = mergeLineRects([
      { top: 24, height: 24, numbered: true },
      { top: 0, height: 24, numbered: true }, // texto normal
      { top: 1, height: 24, numbered: true }, // negrito na mesma linha
      { top: 0, height: 26, numbered: true }, // trecho mais alto na mesma linha
    ]);

    expect(lines).toEqual([
      { top: 0, height: 26, numbered: true },
      { top: 24, height: 24, numbered: true },
    ]);
  });

  it('mantem linhas distintas em ordem crescente de topo', () => {
    const lines = mergeLineRects([
      { top: 48, height: 24, numbered: true },
      { top: 0, height: 24, numbered: false },
      { top: 24, height: 24, numbered: true },
    ]);

    expect(lines.map((line) => line.top)).toEqual([0, 24, 48]);
    expect(lines.map((line) => line.numbered)).toEqual([false, true, true]);
  });

  it('mantem a linha numerada quando parte dela esta fora do corpo', () => {
    const lines = mergeLineRects([
      { top: 0, height: 24, numbered: false },
      { top: 0, height: 24, numbered: true },
    ]);

    expect(lines).toEqual([{ top: 0, height: 24, numbered: true }]);
  });

  it('devolve lista vazia quando nao ha texto medido', () => {
    expect(mergeLineRects([])).toEqual([]);
  });
});

describe('computePageOffsets', () => {
  const linhas = (quantidade: number, altura = 24) =>
    Array.from({ length: quantidade }, (_, i) => ({
      top: i * altura,
      height: altura,
      numbered: true,
    }));

  it('usa uma unica pagina quando o conteudo cabe', () => {
    expect(computePageOffsets(linhas(10))).toEqual([0]);
    expect(computePageOffsets([])).toEqual([0]);
  });

  it('quebra sempre no topo da primeira linha que nao cabe', () => {
    const offsets = computePageOffsets(linhas(100));

    expect(offsets[0]).toBe(0);
    // 1011px / 24px = 42 linhas por pagina
    expect(offsets[1]).toBe(42 * 24);
    expect(offsets[2]).toBe(84 * 24);
  });

  it('nunca corta uma linha ao meio', () => {
    const todas = linhas(100);
    const offsets = computePageOffsets(todas);

    for (const offset of offsets) {
      expect(todas.some((linha) => linha.top === offset)).toBe(true);
    }

    for (const linha of todas) {
      const inicioPagina = [...offsets].reverse().find((offset) => offset <= linha.top) ?? 0;
      expect(linha.top + linha.height).toBeLessThanOrEqual(inicioPagina + PAGE_CONTENT_HEIGHT);
    }
  });
});
