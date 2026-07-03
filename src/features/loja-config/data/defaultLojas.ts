import type { Loja } from '../../../types/ata';

const POTENCIA = 'GLMESE';

function loja(numero: string, nome: string, oriente: string): Loja {
  return { id: `loja-${numero}`, nome, oriente, potencia: POTENCIA };
}

export const DEFAULT_LOJAS: Loja[] = [
  loja('01', 'A∴ R∴ L∴ M∴ 7 de Setembro nº 01', 'Aracaju/SE'),
  loja('02', 'A∴ R∴ L∴ M∴ Luzes da Serra nº 02', 'Itabaiana/SE'),
  loja('03', 'A∴ R∴ L∴ M∴ Unidos da Serra nº 03', 'Itabaiana/SE'),
  loja('04', 'A∴ R∴ L∴ M∴ Serigy nº 04', 'Aracaju/SE'),
  loja('05', 'A∴ R∴ L∴ M∴ Luzes da Piedade nº 05', 'Lagarto/SE'),
  loja('06', 'A∴ R∴ L∴ M∴ Tiradentes nº 06', 'Aracaju/SE'),
  loja('08', 'A∴ R∴ L∴ M∴ Luzes do São Francisco nº 08', 'Neópolis/SE'),
  loja('09', 'A∴ R∴ L∴ M∴ Segredo dos 33 nº 09', 'Aracaju/SE'),
  loja('11', 'A∴ R∴ L∴ M∴ Fraternidade Sergipense nº 11', 'Aracaju/SE'),
  loja('12', 'A∴ R∴ L∴ M∴ Estrela do Oriente nº 12', 'Aracaju/SE'),
  loja('13', 'A∴ R∴ L∴ M∴ Justiça e Liberdade nº 13', 'Aracaju/SE'),
  loja('15', 'A∴ R∴ L∴ M∴ Luz e Paz Canindeense nº 15', 'Canindé de São Francisco/SE'),
  loja('16', 'A∴ R∴ L∴ M∴ Atalaia nº 16', 'Aracaju/SE'),
  loja('17', 'A∴ R∴ L∴ M∴ Acácia Sergipense nº 17', 'Aracaju/SE'),
  loja('18', 'A∴ R∴ L∴ M∴ Jacques DeMolay nº 18', 'Aracaju/SE'),
  loja('19', 'A∴ R∴ L∴ M∴ Hans Werner Menna Barreto Konig nº 19', 'Aracaju/SE'),
  loja('20', 'A∴ R∴ L∴ M∴ Schebna nº 20', 'Aracaju/SE'),
  loja('21', 'A∴ R∴ L∴ M∴ Cavaleiros do São Francisco nº 21', 'Canindé de São Francisco/SE'),
  loja('22', 'A∴ R∴ L∴ M∴ Rei Salomão nº 22', 'Nossa Senhora da Glória/SE'),
  loja('23', 'A∴ R∴ L∴ M∴ Pobres Cavaleiros de Cristo nº 23', 'Aracaju/SE'),
  loja('24', 'A∴ R∴ L∴ M∴ Frank Sherman Land nº 24', 'Aracaju/SE'),
  loja('25', 'A∴ R∴ L∴ M∴ Cavaleiros da Luz nº 25', 'Nossa Senhora do Socorro/SE'),
  loja('26', 'A∴ R∴ L∴ M∴ Cavaleiros de São João nº 26', 'Itabaiana/SE'),
  loja('27', 'A∴ R∴ L∴ M∴ Harmonia e Luz nº 27', 'Aracaju/SE'),
  loja('28', 'A∴ R∴ L∴ M∴ Harmonia e Concórdia nº 28', 'Aracaju/SE'),
  loja('29', 'A∴ R∴ L∴ M∴ Luzes do Cruzeiro nº 29', 'Simão Dias/SE'),
];
