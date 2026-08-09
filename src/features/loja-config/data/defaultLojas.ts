import type { Loja } from '../../../types/ata';

const GLMESE = 'GLMESE';
const GOB_SE = 'GOB/SE';

function loja(numero: string, nome: string, oriente: string, potencia: string): Loja {
  return { id: `loja-${numero}`, nome, oriente, potencia };
}

export const DEFAULT_LOJAS: Loja[] = [
  loja('01', 'A∴ R∴ L∴ M∴ 7 de Setembro nº 01', 'Aracaju/SE', GLMESE),
  loja('02', 'A∴ R∴ L∴ M∴ Luzes da Serra nº 02', 'Itabaiana/SE', GLMESE),
  loja('03', 'A∴ R∴ L∴ M∴ Unidos da Serra nº 03', 'Itabaiana/SE', GLMESE),
  loja('04', 'A∴ R∴ L∴ M∴ Serigy nº 04', 'Aracaju/SE', GLMESE),
  loja('05', 'A∴ R∴ L∴ M∴ Luzes da Piedade nº 05', 'Lagarto/SE', GLMESE),
  loja('06', 'A∴ R∴ L∴ M∴ Tiradentes nº 06', 'Aracaju/SE', GLMESE),
  loja('08', 'A∴ R∴ L∴ M∴ Luzes do São Francisco nº 08', 'Neópolis/SE', GLMESE),
  loja('09', 'A∴ R∴ L∴ M∴ Segredo dos 33 nº 09', 'Aracaju/SE', GLMESE),
  loja('11', 'A∴ R∴ L∴ M∴ Fraternidade Sergipense nº 11', 'Aracaju/SE', GLMESE),
  loja('12', 'A∴ R∴ L∴ M∴ Estrela do Oriente nº 12', 'Aracaju/SE', GLMESE),
  loja('13', 'A∴ R∴ L∴ M∴ Justiça e Liberdade nº 13', 'Aracaju/SE', GLMESE),
  loja('15', 'A∴ R∴ L∴ M∴ Luz e Paz Canindeense nº 15', 'Canindé de São Francisco/SE', GLMESE),
  loja('16', 'A∴ R∴ L∴ M∴ Atalaia nº 16', 'Aracaju/SE', GLMESE),
  loja('17', 'A∴ R∴ L∴ M∴ Acácia Sergipense nº 17', 'Aracaju/SE', GLMESE),
  loja('18', 'A∴ R∴ L∴ M∴ Jacques DeMolay nº 18', 'Aracaju/SE', GLMESE),
  loja('19', 'A∴ R∴ L∴ M∴ Hans Werner Menna Barreto Konig nº 19', 'Aracaju/SE', GLMESE),
  loja('20', 'A∴ R∴ L∴ M∴ Schebna nº 20', 'Aracaju/SE', GLMESE),
  loja(
    '21',
    'A∴ R∴ L∴ M∴ Cavaleiros do São Francisco nº 21',
    'Canindé de São Francisco/SE',
    GLMESE,
  ),
  loja('22', 'A∴ R∴ L∴ M∴ Rei Salomão nº 22', 'Nossa Senhora da Glória/SE', GLMESE),
  loja('23', 'A∴ R∴ L∴ M∴ Pobres Cavaleiros de Cristo nº 23', 'Aracaju/SE', GLMESE),
  loja('24', 'A∴ R∴ L∴ M∴ Frank Sherman Land nº 24', 'Aracaju/SE', GLMESE),
  loja('25', 'A∴ R∴ L∴ M∴ Cavaleiros da Luz nº 25', 'Nossa Senhora do Socorro/SE', GLMESE),
  loja('26', 'A∴ R∴ L∴ M∴ Cavaleiros de São João nº 26', 'Itabaiana/SE', GLMESE),
  loja('27', 'A∴ R∴ L∴ M∴ Harmonia e Luz nº 27', 'Aracaju/SE', GLMESE),
  loja('28', 'A∴ R∴ L∴ M∴ Harmonia e Concórdia nº 28', 'Aracaju/SE', GLMESE),
  loja('29', 'A∴ R∴ L∴ M∴ Luzes do Cruzeiro nº 29', 'Simão Dias/SE', GLMESE),
  loja('0235', 'A∴ R∴ L∴ M∴ Cotinguiba nº 0235', 'Aracaju/SE', GOB_SE),
  loja('1477', 'A∴ R∴ L∴ M∴ Clodomir Silva nº 1477', 'Aracaju/SE', GOB_SE),
  loja('1521', 'A∴ R∴ L∴ M∴ Piauhytinga nº 1521', 'Estância/SE', GOB_SE),
  loja('2130', 'A∴ R∴ L∴ M∴ Prof. Alencar Cardoso nº 2130', 'Aracaju/SE', GOB_SE),
  loja('2142', 'A∴ R∴ L∴ M∴ Lealdade Cotinguibense nº 2142', 'Aracaju/SE', GOB_SE),
  loja('2382', 'A∴ R∴ L∴ M∴ Marcos Ferreira de Jesus nº 2382', 'Aracaju/SE', GOB_SE),
  loja('2530', 'A∴ R∴ L∴ M∴ Tiradentes nº 2530', 'Aracaju/SE', GOB_SE),
  loja('2548', 'A∴ R∴ L∴ M∴ José Mesquita da Silveira nº 2548', 'Itabaiana/SE', GOB_SE),
  loja('2660', 'A∴ R∴ L∴ M∴ Harmonia Laranjeirense nº 2660', 'Laranjeiras/SE', GOB_SE),
  loja('3300', 'A∴ R∴ L∴ M∴ Constâncio Vieira nº 3300', 'Aracaju/SE', GOB_SE),
  loja('3427', 'A∴ R∴ L∴ M∴ Sergio Goldhar nº 3427', 'São Cristóvão/SE', GOB_SE),
  loja('4238', 'A∴ R∴ L∴ M∴ A Marselhesa nº 4238', 'Aracaju/SE', GOB_SE),
  loja('4360', 'A∴ R∴ L∴ M∴ Estrela de Davi nº 4360', 'Aracaju/SE', GOB_SE),
  loja('4682', 'A∴ R∴ L∴ M∴ Peter Swanson nº 4682', 'Estância/SE', GOB_SE),
  loja('4703', "A∴ R∴ L∴ M∴ Univ∴ Sergipe Del R'ey nº 4703", 'Aracaju/SE', GOB_SE),
  loja('4765', 'A∴ R∴ L∴ M∴ Luzes do Cotinguiba nº 4765', 'Carmópolis/SE', GOB_SE),
  loja('4792', 'A∴ R∴ L∴ M∴ Ilha de Santa Luzia nº 4792', 'Aracaju/SE', GOB_SE),
  loja('4892', 'A∴ R∴ L∴ M∴ Adelardo José de Oliveira nº 4892', 'Itabaiana/SE', GOB_SE),
];
