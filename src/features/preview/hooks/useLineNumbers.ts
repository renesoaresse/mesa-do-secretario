import { useEffect, useState, type RefObject } from 'react';

export type LineRect = {
  top: number; // topo da linha, em px, relativo ao container (sem zoom)
  height: number; // altura da linha, em px (sem zoom)
  numbered: boolean; // linha do corpo da ata (entra na numeração)
};

/** Trecho que recebe numeração: da abertura até o encerramento. */
const NUMBERED_SCOPE = '.doc-numbered';

/** Distância mínima entre topos para considerar duas linhas diferentes. */
const MIN_LINE_GAP = 4;

const EMPTY_LINES: LineRect[] = [];

/** Altura útil de uma página A4 (1123px = 297mm a 96dpi) menos as margens da folha. */
export const PAGE_HEIGHT = 1123;
export const PAGE_PADDING_Y = 56;
export const PAGE_CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_PADDING_Y * 2;

/**
 * Corta o documento em páginas, sempre entre linhas: devolve o deslocamento
 * (topo, em px do fluxo contínuo) onde cada página de impressão começa.
 * Assim a impressão é uma fatia exata do preview — nada reflui e os números
 * continuam colados nas suas linhas.
 */
export function computePageOffsets(
  lines: LineRect[],
  contentHeight = PAGE_CONTENT_HEIGHT,
): number[] {
  if (lines.length === 0) return [0];

  const offsets = [0];
  let pageStart = 0;

  for (const line of lines) {
    if (line.top === pageStart) continue;

    if (line.top + line.height > pageStart + contentHeight) {
      pageStart = line.top;
      offsets.push(pageStart);
    }
  }

  return offsets;
}

/**
 * Agrupa retângulos de texto em linhas visuais.
 * Um mesmo trecho de linha pode gerar vários retângulos (negrito, quebras de
 * nó de texto, colunas de assinatura), então tudo que começa na mesma altura
 * vira uma linha só.
 */
export function mergeLineRects(rects: LineRect[]): LineRect[] {
  const sorted = [...rects].sort((a, b) => a.top - b.top);
  const lines: LineRect[] = [];

  for (const rect of sorted) {
    const last = lines[lines.length - 1];
    const threshold = last ? Math.max(MIN_LINE_GAP, last.height / 2) : 0;

    if (last && rect.top < last.top + threshold) {
      last.height = Math.max(last.height, rect.height);
      last.numbered = last.numbered || rect.numbered;
      continue;
    }

    lines.push({ ...rect });
  }

  return lines;
}

/** Mede a posição de cada linha de texto renderizada dentro do container. */
export function measureLineRects(container: HTMLElement): LineRect[] {
  const containerRect = container.getBoundingClientRect();

  // O preview é escalado por `transform: scale(zoom)`; getBoundingClientRect
  // devolve valores já escalados, então convertemos de volta para px do layout.
  const scale = container.offsetHeight > 0 ? containerRect.height / container.offsetHeight : 1;
  const safeScale = scale > 0 ? scale : 1;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      // A própria régua de números não pode virar linha numerada.
      const parent = node.parentElement;
      if (!parent || parent.closest('.doc-line-numbers')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const range = document.createRange();
  const rects: LineRect[] = [];

  // Ambientes sem layout (jsdom) não implementam getClientRects.
  if (typeof range.getClientRects !== 'function') return [];

  for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
    range.selectNodeContents(node);
    const numbered = Boolean(node.parentElement?.closest(NUMBERED_SCOPE));

    for (const rect of Array.from(range.getClientRects())) {
      if (rect.width <= 0 || rect.height <= 0) continue;

      rects.push({
        top: (rect.top - containerRect.top) / safeScale,
        height: rect.height / safeScale,
        numbered,
      });
    }
  }

  return mergeLineRects(rects);
}

function isSameLines(a: LineRect[], b: LineRect[]) {
  if (a.length !== b.length) return false;
  return a.every(
    (line, i) =>
      line.top === b[i].top && line.height === b[i].height && line.numbered === b[i].numbered,
  );
}

/**
 * Devolve as linhas de texto do container para desenhar a numeração.
 * Remede quando `revision` muda (conteúdo/zoom) e quando o container é
 * redimensionado. Fora do browser (ou desligado) devolve lista vazia.
 */
export function useLineNumbers(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  revision: unknown,
): LineRect[] {
  const [lines, setLines] = useState<LineRect[]>([]);

  useEffect(() => {
    const container = containerRef.current;

    if (!enabled || !container) return;

    const measure = () => {
      const next = measureLineRects(container);
      setLines((prev) => (isSameLines(prev, next) ? prev : next));
    };

    const frame = requestAnimationFrame(measure);

    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => measure());
    observer?.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [containerRef, enabled, revision]);

  // Desligado: ignora a última medição em vez de zerar o estado no efeito.
  return enabled ? lines : EMPTY_LINES;
}
