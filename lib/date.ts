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
