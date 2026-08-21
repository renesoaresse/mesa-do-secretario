import { describe, expect, it } from 'vitest';
import {
  makeBolsaProposta,
  makeBolsaPropostas,
  makePbo,
  makeVisitor,
} from '../../../test/factories';
import {
  BOLSA_PROPOSTAS_SEM_PRODUCAO,
  BOLSA_PROPOSTAS_SUPRIMIDA_TEXTO,
  PBO_SILENCIO,
  formatPalavraBemOrdemEntries,
  gerarSufixoLojasConjunta,
  gerarTextoBolsaPropostas,
  gerarTextoPresenca,
  gerarTextoSaudacao,
  joinNomes,
} from './documentPreviewText';

const loja = (nome: string, obreiros: number) => ({ id: nome, nome, obreiros });

describe('documentPreviewText', () => {
  it('registra silencio em todas as colunas quando nada foi preenchido', () => {
    expect(formatPalavraBemOrdemEntries(makePbo({ sul: '', norte: '', oriente: '' }))).toEqual([
      { key: 'sul', label: 'Coluna do Sul', value: PBO_SILENCIO },
      { key: 'norte', label: 'Coluna do Norte', value: PBO_SILENCIO },
      { key: 'oriente', label: 'Oriente', value: PBO_SILENCIO },
    ]);
  });

  it('gera bloco para toda coluna, com silencio nas vazias', () => {
    expect(
      formatPalavraBemOrdemEntries(makePbo({ sul: 'Sul', norte: '   ', oriente: 'Oriente' })),
    ).toEqual([
      { key: 'sul', label: 'Coluna do Sul', value: 'Sul' },
      { key: 'norte', label: 'Coluna do Norte', value: PBO_SILENCIO },
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
    expect(gerarTextoSaudacao([], 'Orador Teste')).toBe(
      'Foi suprimida em razão da ausência de visitantes.',
    );
  });

  it('mantem entidades escapadas e nomes de visitantes como texto literal', () => {
    expect(
      gerarTextoSaudacao([makeVisitor({ nome: '&lt;Visitante&gt;' })], 'Orador Teste'),
    ).toContain('&lt;Visitante&gt;');
  });
});

const certificado = (id: string, obreiroNome: string, visitas: Array<[string, string]>) =>
  makeBolsaProposta({
    id,
    obreiroNome,
    tipo: 'certificado',
    certificados: visitas.map(([lojaNome, dataISO]) => ({ lojaId: lojaNome, lojaNome, dataISO })),
  });

describe('gerarTextoBolsaPropostas', () => {
  it('registra a supressao decidida pelo V M', () => {
    expect(
      gerarTextoBolsaPropostas(makeBolsaPropostas({ suprimida: true, texto: 'ignorado' })),
    ).toEqual([BOLSA_PROPOSTAS_SUPRIMIDA_TEXTO]);
  });

  it('registra os bons fluidos quando o giro nada produziu', () => {
    expect(gerarTextoBolsaPropostas(makeBolsaPropostas({ texto: '   ' }))).toEqual([
      BOLSA_PROPOSTAS_SEM_PRODUCAO,
    ]);
  });

  it('usa o singular com uma unica coluna gravada', () => {
    expect(
      gerarTextoBolsaPropostas(
        makeBolsaPropostas({
          totalColunas: 1,
          texto: '',
          itens: [certificado('c1', 'Edinaldo Santos', [['Piauhytinga - 1521', '2026-05-26']])],
        }),
      ),
    ).toEqual([
      'A bolsa de propostas e informações após seu giro produziu 1 coluna gravada, sendo: ' +
        'certificado de visita do Ir∴ Edinaldo Santos à loja Piauhytinga - 1521 no dia 26/05/2026.',
    ]);
  });

  it('agrupa numa coluna so os certificados lancados em registros separados do mesmo Ir', () => {
    const [abertura] = gerarTextoBolsaPropostas(
      makeBolsaPropostas({
        totalColunas: 2,
        texto: '',
        itens: [
          certificado('c1', 'Ubiratan Pinheiro', [['Luzes do São Francisco - 08', '2026-07-25']]),
          certificado('c2', 'Ubiratan Pinheiro', [['Luzes da Piedade - 05', '2026-07-18']]),
        ],
      }),
    );

    expect(abertura).toContain(
      'certificados de visita do Ir∴ Ubiratan Pinheiro às lojas ' +
        'Luzes da Piedade - 05 no dia 18/07/2026 e Luzes do São Francisco - 08 no dia 25/07/2026',
    );
  });

  it('agrupa os aumentos de salario numa coluna so', () => {
    const [abertura] = gerarTextoBolsaPropostas(
      makeBolsaPropostas({
        totalColunas: 2,
        texto: '',
        itens: [
          makeBolsaProposta({
            id: 'a1',
            obreiroNome: 'Gustavo Nunes',
            tipo: 'aumento',
            certificados: [],
          }),
          makeBolsaProposta({
            id: 'a2',
            obreiroNome: 'João Silva',
            tipo: 'aumento',
            certificados: [],
          }),
        ],
      }),
    );

    expect(abertura).toContain('pedidos de aumento de salário dos IIr∴ Gustavo Nunes e João Silva');
  });

  it('mantem a ordem certificados, aumentos e trabalhos e isola o texto aberto em outro paragrafo', () => {
    const [abertura, complemento, ...resto] = gerarTextoBolsaPropostas(
      makeBolsaPropostas({
        totalColunas: 4,
        texto: 'Pedido de dupla filiação do Ir∴ Fulano de Tal.',
        itens: [
          makeBolsaProposta({
            id: 't1',
            obreiroNome: 'Jorge Farias Lima',
            tipo: 'trabalho',
            certificados: [],
            titulo: 'A Simbologia do Esquadro',
          }),
          makeBolsaProposta({
            id: 'a1',
            obreiroNome: 'Gustavo Nunes',
            tipo: 'aumento',
            certificados: [],
          }),
          certificado('c1', 'Edinaldo Santos', [['Piauhytinga - 1521', '2026-05-26']]),
        ],
      }),
    );

    expect(abertura.indexOf('certificado de visita')).toBeLessThan(
      abertura.indexOf('aumento de salário'),
    );
    expect(abertura.indexOf('aumento de salário')).toBeLessThan(
      abertura.indexOf('trabalho apresentado'),
    );
    expect(abertura).toContain(
      'trabalho apresentado pelo Ir∴ Jorge Farias Lima intitulado "A Simbologia do Esquadro"',
    );
    expect(abertura).not.toContain('dupla filiação');
    expect(complemento).toBe('Pedido de dupla filiação do Ir∴ Fulano de Tal.');
    expect(resto).toEqual([]);
  });

  it('conta o texto aberto como coluna quando nao ha registros estruturados', () => {
    expect(
      gerarTextoBolsaPropostas(
        makeBolsaPropostas({ texto: 'Pedido de dupla filiação do Ir∴ Fulano de Tal.' }),
      ),
    ).toEqual([
      'A bolsa de propostas e informações após seu giro produziu 1 coluna gravada.',
      'Pedido de dupla filiação do Ir∴ Fulano de Tal.',
    ]);
  });

  it('reproduz o modelo de ata com varios certificados', () => {
    expect(
      gerarTextoBolsaPropostas(
        makeBolsaPropostas({
          totalColunas: 13,
          texto: 'Pedido de dupla filiação do Ir∴ Gustavo Nunes de Araujo.',
          itens: [
            certificado('c1', 'Jorge Farias Lima', [
              ['Jacques Demolay - 18', '2026-07-24'],
              ['Estrela de Davi - 4360', '2026-07-27'],
              ['Segredo dos 33 - 09', '2026-07-29'],
              ['Luzes do São Francisco - 08', '2026-07-25'],
            ]),
            certificado('c2', 'Ubiratan Pinheiro', [
              ['Luzes do São Francisco - 08', '2026-07-25'],
              ['Luzes da Piedade - 05', '2026-07-18'],
            ]),
            certificado('c3', 'Jorge Gonçalves', [
              ['Hans Werner Menna Barreto Konig - 19', '2026-06-30'],
            ]),
          ],
        }),
      ),
    ).toEqual([
      'A bolsa de propostas e informações após seu giro produziu 13 colunas gravadas, sendo: ' +
        'certificado de visita do Ir∴ Jorge Gonçalves à loja Hans Werner Menna Barreto Konig - 19 no dia 30/06/2026, ' +
        'certificados de visita do Ir∴ Ubiratan Pinheiro às lojas Luzes da Piedade - 05 no dia 18/07/2026 ' +
        'e Luzes do São Francisco - 08 no dia 25/07/2026 ' +
        'e certificados de visita do Ir∴ Jorge Farias Lima às lojas Jacques Demolay - 18 no dia 24/07/2026, ' +
        'Luzes do São Francisco - 08 no dia 25/07/2026, Estrela de Davi - 4360 no dia 27/07/2026 ' +
        'e Segredo dos 33 - 09 no dia 29/07/2026.',
      'Pedido de dupla filiação do Ir∴ Gustavo Nunes de Araujo.',
    ]);
  });

  it('ordena as visitas de um mesmo Ir da mais antiga para a mais nova', () => {
    const [abertura] = gerarTextoBolsaPropostas(
      makeBolsaPropostas({
        texto: '',
        itens: [
          certificado('c1', 'Ubiratan Pinheiro', [['Luzes do São Francisco - 08', '2026-07-25']]),
          certificado('c2', 'Ubiratan Pinheiro', [['Luzes da Piedade - 05', '2026-07-18']]),
        ],
      }),
    );

    expect(abertura).toContain(
      'às lojas Luzes da Piedade - 05 no dia 18/07/2026 e Luzes do São Francisco - 08 no dia 25/07/2026',
    );
  });

  it('ordena as colunas de certificado pela visita mais antiga de cada Ir', () => {
    const [abertura] = gerarTextoBolsaPropostas(
      makeBolsaPropostas({
        texto: '',
        itens: [
          certificado('c1', 'Jorge Farias Lima', [['Jacques Demolay - 18', '2026-07-24']]),
          certificado('c2', 'Jorge Gonçalves', [['Tiradentes - 06', '2026-06-30']]),
        ],
      }),
    );

    expect(abertura.indexOf('Jorge Gonçalves')).toBeLessThan(abertura.indexOf('Jorge Farias Lima'));
  });

  it('joga para o fim a visita de registro antigo sem data', () => {
    const [abertura] = gerarTextoBolsaPropostas(
      makeBolsaPropostas({
        texto: '',
        itens: [
          certificado('c1', 'Edinaldo Santos', [
            ['Loja Sem Data - 01', ''],
            ['Piauhytinga - 1521', '2026-05-26'],
          ]),
        ],
      }),
    );

    expect(abertura).toContain(
      'às lojas Piauhytinga - 1521 no dia 26/05/2026 e Loja Sem Data - 01',
    );
  });
});
