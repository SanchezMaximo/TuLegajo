import { PDFParse } from "pdf-parse";

// Concepto tal como aparece en la columna "Concepto" de los recibos de sueldo
// (confirmado por el usuario: la liquidación de vacaciones figura como "VACACIONES").
const VACACIONES_REGEX = /VACACIONES/i;

export interface VacacionesDeteccion {
  liquidada: boolean;
  lineas: string[];
}

export async function extraerTextoPdf(buffer: ArrayBuffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

export function detectarVacacionesLiquidadas(texto: string): VacacionesDeteccion {
  const lineas = texto
    .split("\n")
    .map((linea) => linea.trim())
    .filter((linea) => VACACIONES_REGEX.test(linea));

  return { liquidada: lineas.length > 0, lineas };
}
