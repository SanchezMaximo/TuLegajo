import type { SortDirection } from "@/components/ui";

// Las fechas de la API vienen en formato DD/MM/YYYY (ver manual, secc. 5.x).
export function parseDDMMYYYY(value?: string): number {
  if (!value) return 0;
  const [d, m, y] = value.split("/").map(Number);
  if (!d || !m || !y) return 0;
  return new Date(y, m - 1, d).getTime();
}

export function sortByDateField<T>(
  items: T[],
  getDate: (item: T) => string | undefined,
  direction: SortDirection
): T[] {
  const copy = [...items];
  copy.sort((a, b) => {
    const diff = parseDDMMYYYY(getDate(a)) - parseDDMMYYYY(getDate(b));
    return direction === "recent" ? -diff : diff;
  });
  return copy;
}

// Para recursos sin fecha en el listado (ej: documentos, lotes), el id
// incremental de la API es la mejor aproximación disponible al orden de carga.
export function sortById<T extends { id: number }>(items: T[], direction: SortDirection): T[] {
  const copy = [...items];
  copy.sort((a, b) => (direction === "recent" ? b.id - a.id : a.id - b.id));
  return copy;
}

// El periodo de un lote/documento viene en formato MM-YYYY (ver manual, secc. 5.9).
// Devuelve un entero comparable (año*12+mes) para poder ordenar/filtrar por rango.
export function parsePeriodo(value?: string): number | null {
  if (!value) return null;
  const match = value.match(/^(\d{1,2})-(\d{4})$/);
  if (!match) return null;
  const mes = Number(match[1]);
  const anio = Number(match[2]);
  if (mes < 1 || mes > 12) return null;
  return anio * 12 + (mes - 1);
}

export function periodoDentroDeRango(periodo: string | undefined, desde: string): boolean {
  const valor = parsePeriodo(periodo);
  const limite = parsePeriodo(desde);
  if (valor === null || limite === null) return true;
  return valor >= limite;
}

export function sortByPeriodo<T>(
  items: T[],
  getPeriodo: (item: T) => string | undefined,
  direction: SortDirection
): T[] {
  const copy = [...items];
  copy.sort((a, b) => {
    const pa = parsePeriodo(getPeriodo(a)) ?? -Infinity;
    const pb = parsePeriodo(getPeriodo(b)) ?? -Infinity;
    const diff = pa - pb;
    return direction === "recent" ? -diff : diff;
  });
  return copy;
}

export function anioDeFecha(value?: string): number | null {
  if (!value) return null;
  const [, , y] = value.split("/").map(Number);
  return y || null;
}

export function anioDePeriodo(value?: string): number | null {
  if (!value) return null;
  const match = value.match(/^(\d{1,2})-(\d{4})$/);
  return match ? Number(match[2]) : null;
}
