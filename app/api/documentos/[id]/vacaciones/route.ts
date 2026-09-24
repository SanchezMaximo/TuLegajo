import { NextRequest, NextResponse } from "next/server";
import { tuLegajoGet, resolveTuLegajoUrl } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";
import { extraerTextoPdf, detectarVacacionesLiquidadas } from "@/lib/recibo-parser";
import type { Documento } from "@/lib/types";

// Verifica, leyendo el PDF del recibo, si el concepto "VACACIONES" aparece
// liquidado. La API de TuLegajo no expone esto como dato estructurado (solo
// da metadata + link de descarga), así que lo inferimos del texto del PDF.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = await tuLegajoGet<Documento>(`/documentos/${encodeURIComponent(id)}`);

    const baseUrl = resolveTuLegajoUrl(doc.descargaOriginalURL ?? doc.descargaDuplicadoURL);
    if (!baseUrl) {
      return NextResponse.json(
        { message: "Este documento todavía no tiene un archivo disponible para descargar." },
        { status: 422 }
      );
    }
    const downloadUrl = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}cuil=${encodeURIComponent(
      doc.cuil
    )}`;

    const pdfRes = await fetch(downloadUrl);
    if (!pdfRes.ok) {
      return NextResponse.json(
        { message: `No se pudo descargar el PDF del recibo (HTTP ${pdfRes.status}).` },
        { status: 502 }
      );
    }
    const buffer = await pdfRes.arrayBuffer();

    const texto = await extraerTextoPdf(buffer);
    const deteccion = detectarVacacionesLiquidadas(texto);

    return NextResponse.json({
      documentoId: doc.id,
      liquidada: deteccion.liquidada,
      lineas: deteccion.lineas,
    });
  } catch (error) {
    if (error instanceof Error && /invalid pdf|password|format/i.test(error.message)) {
      return NextResponse.json(
        { message: "No se pudo leer el contenido del PDF (puede ser una imagen escaneada sin texto)." },
        { status: 422 }
      );
    }
    return handleApiError(error);
  }
}
