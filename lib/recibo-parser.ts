import { PDFParse } from "pdf-parse";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

// Sin esto, pdf-parse (via pdfjs-dist) intenta importar su "worker" con una
// ruta que calcula en runtime según dónde terminó el módulo. Esto se rompe
// en dos escenarios distintos:
// - En un deploy serverless (Vercel), esa ruta no coincide con nada real.
// - Usar require.resolve() para calcularla nosotros tampoco sirve: en
//   `next dev` (Turbopack) lo reescribe a un identificador de módulo interno
//   en vez de una ruta de archivo real.
// La solución que funciona en los dos casos: construir la ruta a mano
// (sin pasar por require/import) y sumar outputFileTracingIncludes en
// next.config.ts para que Vercel empaquete el archivo igual.
try {
  const workerPath = path.join(
    process.cwd(),
    "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"
  );
  if (fs.existsSync(workerPath)) {
    PDFParse.setWorker(pathToFileURL(workerPath).href);
  }
} catch {
  // Si no se puede resolver (entorno no soportado), seguimos con el
  // comportamiento por defecto de la librería.
}

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
