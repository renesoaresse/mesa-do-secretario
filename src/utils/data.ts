/** Data curta em português: "2026-07-25" vira "25/07/2026". */
export function formatarDataNumericaBR(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  if (!ano || !mes || !dia) return iso;
  return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
}
