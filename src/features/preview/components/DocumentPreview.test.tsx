import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { makeDangerousPreviewData, makePreviewData } from '../../../test/factories';
import { DocumentPreview } from './DocumentPreview';

describe('DocumentPreview', () => {
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

  it('omite secoes opcionais vazias e mostra fallback da palavra a bem da ordem', () => {
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
    expect(screen.getByText(/reinou a paz e a harmonia/i)).toBeInTheDocument();
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
          bolsaPropostasTexto: '',
        })}
      />,
    );

    expect(screen.getByText(/BALAÚSTRE:/i)).toBeInTheDocument();
    expect(screen.getByText(/reinou a paz e a harmonia/i)).toBeInTheDocument();

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
          visitors: ['<Visitante Importado>', '&amp;Outro'],
          bolsaPropostasTexto: '&lt;script&gt;externo&lt;/script&gt;',
        })}
      />,
    );

    const preview = screen.getByLabelText('Pré-visualização do documento');

    expect(preview).toHaveTextContent('<Visitante Importado>');
    expect(preview).toHaveTextContent('&amp;Outro');
    expect(preview).toHaveTextContent('&lt;script&gt;externo&lt;/script&gt;');
  });
});
