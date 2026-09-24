import { NextResponse } from "next/server";
import { TuLegajoApiError, resolveTuLegajoUrl } from "./tulegajo-client";
import type { ArchivoLegajo, Comunicacion, Documento } from "./types";

export function handleApiError(error: unknown) {
  if (error instanceof TuLegajoApiError) {
    return NextResponse.json(
      { message: error.message, path: error.path, timestamp: error.timestamp },
      { status: error.statusCode }
    );
  }
  const message = error instanceof Error ? error.message : "Error desconocido";
  return NextResponse.json({ message }, { status: 500 });
}

export function resolveDocumentoUrls(doc: Documento): Documento {
  return {
    ...doc,
    descargaOriginalURL: resolveTuLegajoUrl(doc.descargaOriginalURL),
    descargaDuplicadoURL: resolveTuLegajoUrl(doc.descargaDuplicadoURL),
    descargaOriginalFirmadoURL: resolveTuLegajoUrl(doc.descargaOriginalFirmadoURL),
    descargaDuplicadoFirmadoURL: resolveTuLegajoUrl(doc.descargaDuplicadoFirmadoURL),
  };
}

export function resolveArchivoUrls(archivo: ArchivoLegajo): ArchivoLegajo {
  return {
    ...archivo,
    archivos: archivo.archivos?.map((a) => ({ ...a, uri: resolveTuLegajoUrl(a.uri)! })),
  };
}

export function resolveComunicacionUrl(com: Comunicacion): Comunicacion {
  return { ...com, uri: resolveTuLegajoUrl(com.uri) };
}
