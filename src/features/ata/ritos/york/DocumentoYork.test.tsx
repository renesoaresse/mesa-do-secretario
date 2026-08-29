import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  makeOfficers,
  makePreviewData,
  makeSessionConfig,
  makeVisitor,
} from '../../../../test/factories';
import { DocumentoYork } from './DocumentoYork';

/** A sessão do exemplo: Mestre Maçom nº 90/2026, 14 do quadro e 2 visitantes. */
function makeYorkData(overrides: Parameters<typeof makePreviewData>[0] = {}) {
  return makePreviewData({
    lojaConfig: {
      logoDataUrl: null,
      nomeLoja: 'ARLM Acácia Sergipense',
      rito: 'Rito de York',
      numeroLoja: '17',
      dataFundacaoISO: '2013-08-17',
      temploNome: 'Sala Petrúcio Lopes Casado',
      enderecoTemplo: 'Rua Oscar Valois Galvão, 359, bairro Grageru',
      cidadeEstado: 'Aracaju - SE',
    },
    sessionConfig: makeSessionConfig({
      grau: 'Mestre',
      numSessao: 90,
      dataISO: '2026-08-26',
      horaInicio: '21:45',
      horaEnc: '21:20',
      numPresenca: 14,
    }),
    officers: makeOfficers({
      vm: 'Felipe Alves dos Santos',
      vig1: 'Flávio Pereira Alves',
      vig2: 'Gabriel Gama Jambeiro',
      tes: 'Daniel Francisco Amaral dos Santos Leite',
      sec: 'Alisson Reinaldo dos Santos',
    }),
    visitors: [
      makeVisitor({
        nome: 'Adalmir de Jesus Andrade',
        lojaNome: 'Loja Maçônica Justiça e Liberdade',
        oriente: 'Aracaju',
        potencia: 'GLMESE',
      }),
      makeVisitor({
        nome: 'Rodrigo Capistrano',
        lojaNome: 'Loja Maçônica Fraternidade Sergipense',
        oriente: 'Aracaju',
        potencia: 'GLMESE',
      }),
    ],
    ...overrides,
  });
}

const textoDoDocumento = () => document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '';

describe('DocumentoYork', () => {
  it('titula a ata pelo grau e pelo numero da sessao, sem o ano', () => {
    render(<DocumentoYork data={makeYorkData()} />);

    expect(screen.getByText('ATA DA SESSÃO DE MESTRE MAÇOM Nº 90')).toBeInTheDocument();
  });

  it('abre a ata com hora, data, templo e presenca da sessao', () => {
    render(<DocumentoYork data={makeYorkData()} />);
    const texto = textoDoDocumento();

    expect(texto).toContain(
      'reuniu-se às 21:45h do dia 26 de agosto de 2026 da Era Vulgar e 6.026 da Verdadeira Luz',
    );
    expect(texto).toContain('ARLM Acácia Sergipense Nº 17');
    expect(texto).toContain(
      'na Sala Petrúcio Lopes Casado, situada à Rua Oscar Valois Galvão, 359, bairro Grageru, no Oriente de Aracaju - SE',
    );
    expect(texto).toContain(
      'contando com 14 (catorze) Irmãos do Quadro e 02 (dois) Irmãos visitantes, todos registrados nos respectivos Livros de Presença.',
    );
  });

  it('nomeia a direcao dos trabalhos com o Tesoureiro no lugar do Orador', () => {
    render(<DocumentoYork data={makeYorkData()} />);

    expect(textoDoDocumento()).toContain(
      'A reunião foi dirigida pelo Venerável Mestre Irmão Felipe Alves dos Santos, auxiliado pelo Primeiro Vigilante Irmão Flávio Pereira Alves, e pelo Segundo Vigilante Irmão Gabriel Gama Jambeiro. Tendo como Tesoureiro Irmão Daniel Francisco Amaral dos Santos Leite e Secretário Irmão Alisson Reinaldo dos Santos.',
    );
  });

  it('marca o ad hoc como sufixo do nome do Irmao', () => {
    render(<DocumentoYork data={makeYorkData({ oficiaisAdHoc: ['vig1', 'tes'] })} />);
    const texto = textoDoDocumento();

    expect(texto).toContain('auxiliado pelo Primeiro Vigilante Irmão Flávio Pereira Alves - ADHOC');
    expect(texto).toContain(
      'Tendo como Tesoureiro Irmão Daniel Francisco Amaral dos Santos Leite - ADHOC',
    );
    // Quem não está ad hoc segue com o nome limpo.
    expect(texto).toContain('Segundo Vigilante Irmão Gabriel Gama Jambeiro.');
  });

  it('apresenta os visitantes pelo Segundo Diacono, sem o oriente', () => {
    render(<DocumentoYork data={makeYorkData()} />);

    expect(textoDoDocumento()).toContain(
      'A pedido do Venerável Mestre, o Irmão Segundo Diácono procedeu com a apresentação dos visitantes: Ir∴ visitante Adalmir de Jesus Andrade da Loja Maçônica Justiça e Liberdade filiado à Potência GLMESE e Ir∴ visitante Rodrigo Capistrano da Loja Maçônica Fraternidade Sergipense filiado à Potência GLMESE.',
    );
  });

  it('lavra o tronco pelo total de medalhas cunhadas', () => {
    render(<DocumentoYork data={makeYorkData({ tronco: 22 })} />);

    expect(textoDoDocumento()).toContain(
      'Foram arrecadados no Tronco de Beneficência o total de 22 (vinte e dois) medalhas cunhadas.',
    );
  });

  it('registra a palavra a bem da Ordem em texto corrido, sem as colunas', () => {
    render(<DocumentoYork data={makeYorkData({ pboTexto: 'Teste, teste, teste' })} />);
    const texto = textoDoDocumento();

    expect(texto).toContain('PALAVRA A BEM DA ORDEM: Teste, teste, teste');
    expect(texto).not.toContain('Coluna do Sul');
    expect(texto).not.toContain('Coluna do Norte');
    expect(texto).not.toContain('Coluna do Oriente');
  });

  it('separa pranchas, atos, decretos e leitura de atas em secoes proprias', () => {
    render(
      <DocumentoYork
        data={makeYorkData({
          pranchasTexto: 'Prancha nº 200 - Prancha de teste',
          atosTexto: 'Ato lido na sessão',
          decretosTexto: 'Decreto lido na sessão',
          leituraAtasTexto: 'Ata nº 89 lida e aprovada',
        })}
      />,
    );
    const texto = textoDoDocumento();

    expect(texto).toContain('PRANCHAS E CORRESPONDÊNCIAS: Prancha nº 200 - Prancha de teste');
    expect(texto).toContain('ATOS: Ato lido na sessão');
    expect(texto).toContain('DECRETOS: Decreto lido na sessão');
    expect(texto).toContain('LEITURA DE ATAS ANTERIORES: Ata nº 89 lida e aprovada');
  });

  it('usa os textos padrao das secoes vazias', () => {
    render(
      <DocumentoYork
        data={makeYorkData({
          pranchasTexto: '',
          atosTexto: '   ',
          decretosTexto: '',
          leituraAtasTexto: '',
          visitors: [],
        })}
      />,
    );
    const texto = textoDoDocumento();

    expect(texto).toContain('PRANCHAS E CORRESPONDÊNCIAS: Não houve pranchas ou correspondências');
    expect(texto).toContain('ATOS: Não houve atos apresentados nesta sessão.');
    expect(texto).toContain('DECRETOS: Não houve decretos apresentados nesta sessão.');
    expect(texto).toContain('LEITURA DE ATAS ANTERIORES: Não houve leitura de atas anteriores.');
    expect(texto).toContain('SAUDAÇÃO AOS VISITANTES: Não houve visitantes nesta sessão.');
    // Sem visitantes, só o Livro de Presença do quadro foi assinado.
    expect(texto).toContain('todos registrados no respectivo Livro de Presença.');
  });

  it('registra as supressoes decididas pelo Veneravel Mestre', () => {
    render(<DocumentoYork data={makeYorkData({ troncoSuprimido: true, pboSuprimido: true })} />);
    const texto = textoDoDocumento();

    expect(texto).toContain('o Tronco de Beneficência foi suprimido.');
    expect(texto).toContain('a palavra a bem da Ordem foi suprimida.');
  });

  it('encerra citando o Secretario que lavrou a ata e assina com o Veneravel', () => {
    const { container } = render(<DocumentoYork data={makeYorkData()} />);

    expect(textoDoDocumento()).toContain(
      'o Venerável Mestre deu seguimento ao encerramento da sessão no dia 26 de agosto de 2026 da Era Vulgar e 6.026 da Verdadeira Luz às 21:20h',
    );

    const assinaturas = Array.from(container.querySelectorAll('.sig-line'), (linha) =>
      linha.textContent?.trim(),
    );

    expect(assinaturas).toEqual([
      'Felipe Alves dos SantosVenerável Mestre',
      'Alisson Reinaldo dos SantosSecretário',
    ]);
  });
});
