import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  makeBolsaPropostas,
  makeDangerousPreviewData,
  makePreviewData,
  makeSessionConfig,
  makeVisitor,
} from '../../../test/factories';
import { DocumentPreview } from './DocumentPreview';
import {
  ATOS_DECRETOS_PADRAO,
  BALAUSTRE_PADRAO,
  EXPEDIENTE_PADRAO,
  PBO_SUPRIMIDO_TEXTO,
  TRONCO_SUPRIMIDO_TEXTO,
} from './documentPreviewText';

const toRects = (tops: number[]) => tops.map((top) => ({ top, height: 24, width: 400 }) as DOMRect);

/**
 * jsdom não faz layout nem implementa Range.getClientRects: simula as linhas,
 * separando o que está dentro do corpo numerado do que está fora dele.
 */
function stubTextLineRects(corpo: number[], fora: number[] = []) {
  const rectsCorpo = toRects(corpo);
  const rectsFora = toRects(fora);

  Object.defineProperty(Range.prototype, 'getClientRects', {
    configurable: true,
    writable: true,
    value: function (this: Range) {
      const node = this.startContainer;
      const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);
      const dentro = Boolean(element?.closest('.doc-numbered'));

      return (dentro ? rectsCorpo : rectsFora) as unknown as DOMRectList;
    },
  });
}

describe('DocumentPreview', () => {
  afterEach(() => {
    Reflect.deleteProperty(Range.prototype, 'getClientRects');
  });

  it('mantem o contrato externo do preview', () => {
    render(<DocumentPreview zoom={1.25} data={makePreviewData()} />);

    const preview = screen.getByLabelText('Pré-visualização do documento');

    expect(preview).toHaveAttribute('id', 'documentPreview');
    expect(preview).toHaveClass('preview-sheet', 'abnt-page');
    expect(preview).toHaveStyle({ transform: 'scale(1.25)', transformOrigin: 'top center' });
  });

  it('renderiza texto semelhante a html como conteudo literal', () => {
    const data = makeDangerousPreviewData();
    const { container } = render(<DocumentPreview zoom={1} data={data} />);
    const preview = screen.getByLabelText('Pré-visualização do documento');

    expect(preview).toHaveTextContent('<script>alert("templo")</script>');
    expect(preview).toHaveTextContent('Rua <img src=x onerror=alert(1)> Central');
    expect(preview).toHaveTextContent('<b>Loja</b> & Co');
    expect(preview).toHaveTextContent('Aracaju/SE &lt;b&gt;teste&lt;/b&gt;');
    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(container.querySelector('img[src="x"]')).not.toBeInTheDocument();
    expect(container.querySelector('b')).not.toBeInTheDocument();
  });

  it('omite secoes opcionais vazias e registra silencio nas colunas sem palavra', () => {
    render(
      <DocumentPreview
        zoom={1}
        data={makePreviewData({
          sessionType: 'magna',
          magnaFields: {
            tema: '',
            oradorConvidado: '',
            autoridades: '',
            atoEspecial: '',
          },
          pbo: { sul: '', norte: '', oriente: '' },
        })}
      />,
    );

    expect(screen.queryByText(/AUTORIDADES PRESENTES:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ORADOR CONVIDADO:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ATO ESPECIAL:/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/Reinou silêncio na coluna\./i)).toHaveLength(3);
  });

  it('registra a supressao da bolsa de beneficencia no lugar do valor arrecadado', () => {
    const { rerender } = render(
      <DocumentPreview zoom={1} data={makePreviewData({ tronco: 10, troncoSuprimido: true })} />,
    );

    expect(screen.getByText(new RegExp(TRONCO_SUPRIMIDO_TEXTO))).toBeInTheDocument();
    expect(screen.queryByText(/medalhas cunhadas/i)).not.toBeInTheDocument();

    rerender(
      <DocumentPreview zoom={1} data={makePreviewData({ tronco: 10, troncoSuprimido: false })} />,
    );

    expect(screen.getByText(/medalhas cunhadas/i)).toBeInTheDocument();
    expect(screen.queryByText(new RegExp(TRONCO_SUPRIMIDO_TEXTO))).not.toBeInTheDocument();
  });

  it('registra a supressao da palavra a bem da ordem no lugar das colunas', () => {
    const { rerender } = render(
      <DocumentPreview zoom={1} data={makePreviewData({ pboSuprimido: true })} />,
    );

    expect(screen.getByText(new RegExp(PBO_SUPRIMIDO_TEXTO))).toBeInTheDocument();
    expect(screen.queryByText(/Coluna do Sul:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/A palavra circulou da seguinte forma:/i)).not.toBeInTheDocument();

    rerender(<DocumentPreview zoom={1} data={makePreviewData({ pboSuprimido: false })} />);

    expect(screen.getByText(/A palavra circulou da seguinte forma:/i)).toBeInTheDocument();
    expect(screen.getByText(/Coluna do Sul:/i)).toBeInTheDocument();
    expect(screen.queryByText(new RegExp(PBO_SUPRIMIDO_TEXTO))).not.toBeInTheDocument();
  });

  it('usa o texto padrao de expedientes quando a secao esta vazia', () => {
    const { rerender } = render(
      <DocumentPreview zoom={1} data={makePreviewData({ expedientesTexto: '   ' })} />,
    );

    expect(screen.getByText(new RegExp(EXPEDIENTE_PADRAO.slice(0, 40), 'i'))).toBeInTheDocument();

    rerender(
      <DocumentPreview zoom={1} data={makePreviewData({ expedientesTexto: 'Prancha lida' })} />,
    );

    expect(screen.getByText(/Prancha lida/i)).toBeInTheDocument();
    expect(
      screen.queryByText(new RegExp(EXPEDIENTE_PADRAO.slice(0, 40), 'i')),
    ).not.toBeInTheDocument();
  });

  it('usa os textos padrao de balaustre e atos e decretos quando as secoes estao vazias', () => {
    const { rerender } = render(
      <DocumentPreview
        zoom={1}
        data={makePreviewData({ balaustreTexto: '   ', atosDecretosTexto: '' })}
      />,
    );

    expect(screen.getByText(new RegExp(BALAUSTRE_PADRAO, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(ATOS_DECRETOS_PADRAO, 'i'))).toBeInTheDocument();

    rerender(
      <DocumentPreview
        zoom={1}
        data={makePreviewData({
          balaustreTexto: 'Balaustre lido e aprovado',
          atosDecretosTexto: 'Decreto 01/2026',
        })}
      />,
    );

    expect(screen.getByText(/Balaustre lido e aprovado/i)).toBeInTheDocument();
    expect(screen.getByText(/Decreto 01\/2026/i)).toBeInTheDocument();
    expect(screen.queryByText(new RegExp(BALAUSTRE_PADRAO, 'i'))).not.toBeInTheDocument();
    expect(screen.queryByText(new RegExp(ATOS_DECRETOS_PADRAO, 'i'))).not.toBeInTheDocument();
  });

  it('permanece estavel ao alternar entre dados vazios e preenchidos', () => {
    const { rerender } = render(
      <DocumentPreview
        zoom={1}
        data={makePreviewData({
          pbo: { sul: '', norte: '', oriente: '' },
          balaustreTexto: '',
          atosDecretosTexto: '',
          expedientesTexto: '',
          bolsaPropostas: makeBolsaPropostas({ texto: '' }),
        })}
      />,
    );

    expect(screen.getByText(/BALAÚSTRE:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Reinou silêncio na coluna\./i)).toHaveLength(3);

    rerender(<DocumentPreview zoom={1} data={makeDangerousPreviewData()} />);

    expect(screen.getByText(/PALAVRA A BEM DA ORDEM:/i)).toBeInTheDocument();
    expect(screen.getByText(/Coluna do Sul:/i)).toBeInTheDocument();
    expect(screen.getByText(/Oriente:/i)).toBeInTheDocument();
  });

  it('renderiza secoes magna quando os dados estiverem preenchidos', () => {
    render(
      <DocumentPreview
        zoom={1}
        data={makePreviewData({
          sessionType: 'magna',
        })}
      />,
    );

    expect(screen.getByText(/AUTORIDADES PRESENTES:/i)).toBeInTheDocument();
    expect(screen.getByText(/ORADOR CONVIDADO:/i)).toBeInTheDocument();
    expect(screen.getByText(/ATO ESPECIAL:/i)).toBeInTheDocument();
  });

  it('mantem dados simulados de importacao e entidades escapadas como texto seguro', () => {
    render(
      <DocumentPreview
        zoom={1}
        data={makeDangerousPreviewData({
          visitors: [
            makeVisitor({ nome: '<Visitante Importado>' }),
            makeVisitor({ nome: '&amp;Outro' }),
          ],
          bolsaPropostas: makeBolsaPropostas({ texto: '&lt;script&gt;externo&lt;/script&gt;' }),
        })}
      />,
    );

    const preview = screen.getByLabelText('Pré-visualização do documento');

    expect(preview).toHaveTextContent('<Visitante Importado>');
    expect(preview).toHaveTextContent('&amp;Outro');
    expect(preview).toHaveTextContent('&lt;script&gt;externo&lt;/script&gt;');
  });

  it('nao numera linhas quando a opcao esta desligada', () => {
    stubTextLineRects([0, 24, 48]);
    const { container } = render(<DocumentPreview zoom={1} data={makePreviewData()} />);

    expect(screen.getByLabelText('Pré-visualização do documento')).not.toHaveClass(
      'with-line-numbers',
    );
    expect(container.querySelector('.doc-line-numbers')).not.toBeInTheDocument();
    expect(container.querySelector('style')).not.toBeInTheDocument();
  });

  it('numera as linhas medidas quando a opcao esta ligada', async () => {
    // corpo em 100/124/148; cabeçalho, fecho e assinaturas (fora) em 0/24 e 300
    stubTextLineRects([100, 124, 148], [0, 24, 300]);

    const { container } = render(
      <DocumentPreview
        zoom={1}
        data={makePreviewData({
          sessionConfig: makeSessionConfig({ numerarLinhas: true }),
        })}
      />,
    );

    expect(screen.getByLabelText('Pré-visualização do documento')).toHaveClass('with-line-numbers');
    // @page margin 0: impressão sai 1:1 com o preview
    expect(container.querySelector('style')).toHaveTextContent('@page { size: A4; margin: 0; }');

    await waitFor(() => {
      const numbers = container.querySelectorAll('.doc-body .doc-line-numbers span');
      // só o corpo é numerado: nada antes da abertura nem depois do encerramento
      expect(numbers).toHaveLength(3);
      expect(Array.from(numbers, (n) => n.textContent)).toEqual(['1 -', '2 -', '3 -']);
      expect(numbers[0]).toHaveStyle({ top: '100px' });
      expect(numbers[1]).toHaveStyle({ top: '124px', height: '24px' });
    });

    // páginas fatiadas para impressão (aqui: cabe tudo em uma)
    const pages = container.querySelectorAll('.print-pages .print-page');
    expect(pages).toHaveLength(1);
    expect(pages[0].querySelector('.print-page__flow')).toHaveStyle({ marginTop: '0px' });
  });
});
