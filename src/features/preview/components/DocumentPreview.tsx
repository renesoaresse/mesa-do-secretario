import { useMemo, useRef } from 'react';
import type { PreviewData } from '../../../types/ata';
import {
  computePageOffsets,
  useLineNumbers,
  PAGE_CONTENT_HEIGHT,
  type LineRect,
} from '../hooks/useLineNumbers';
import type { DocumentoAta } from '../../ata/types';

type Props = {
  zoom: number;
  data: PreviewData;
  /** Documento do rito da loja: a casca é comum, a forma da ata é de cada rito. */
  documento: DocumentoAta;
};

export function DocumentPreview({ zoom, data, documento: Documento }: Props) {
  const content = useMemo(() => <Documento data={data} />, [Documento, data]);
  const bodyRef = useRef<HTMLDivElement>(null);

  const numerarLinhas = data.sessionConfig.numerarLinhas;
  const revision = useMemo(() => [data, zoom], [data, zoom]);
  const lines = useLineNumbers(bodyRef, numerarLinhas, revision);

  // A régua só numera o corpo; a paginação considera todas as linhas para não
  // cortar cabeçalho, fecho ou assinaturas ao meio.
  const numberedLines = useMemo(() => lines.filter((line) => line.numbered), [lines]);

  // Cada página impressa é a fatia [offset, offset + height) do fluxo contínuo.
  const pageSlices = useMemo(() => {
    const offsets = computePageOffsets(lines);

    return offsets.map((offset, index) => ({
      offset,
      height: (offsets[index + 1] ?? offset + PAGE_CONTENT_HEIGHT) - offset,
    }));
  }, [lines]);

  return (
    <div className="preview-sheet-wrap">
      {/* Com numeração, a impressão precisa sair 1:1 com o preview (A4 cheio,
          margens vindo do padding da folha) para os números baterem com as linhas. */}
      {numerarLinhas ? <style>{'@page { size: A4; margin: 0; }'}</style> : null}

      <section
        id="documentPreview"
        className={`preview-sheet abnt-page${numerarLinhas ? ' with-line-numbers' : ''}`}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        aria-label="Pré-visualização do documento"
      >
        <div className="doc-body" ref={bodyRef}>
          {content}
          {numerarLinhas ? <LineNumbers lines={numberedLines} /> : null}
        </div>

        {/* Só na impressão: cada página é uma fatia exata do fluxo do preview,
            cortada entre linhas. Nada reflui, então os números não desalinham. */}
        {numerarLinhas && lines.length > 0 ? (
          <div className="print-pages" aria-hidden="true">
            {pageSlices.map(({ offset, height }) => (
              <div className="print-page" key={offset}>
                <div className="print-page__clip" style={{ height: `${height}px` }}>
                  <div className="print-page__flow" style={{ marginTop: `${-offset}px` }}>
                    {content}
                    <LineNumbers lines={numberedLines} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function LineNumbers({ lines }: { lines: LineRect[] }) {
  if (lines.length === 0) return null;

  return (
    <div className="doc-line-numbers">
      {lines.map((line, index) => (
        <span
          key={`${line.top}-${index}`}
          style={{
            top: `${line.top}px`,
            height: `${line.height}px`,
            lineHeight: `${line.height}px`,
          }}
        >
          {`${index + 1} -`}
        </span>
      ))}
    </div>
  );
}
