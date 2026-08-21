/**
 * Normaliza um texto para busca: sem acentos, em minúsculas e com espaços colapsados.
 * Usado pelos comboboxes para casar o que o usuário digita com o cadastro.
 */
export function normalizarBusca(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}
