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

// Los links de descarga de la API requieren el header x-api-key, que un <a
// href> del navegador no puede mandar. Los reescribimos para que pasen por
// nuestro propio proxy (/api/descargar), que sí tiene la key, y les
// agregamos el "cuil" que sugiere el manual para verificar pertenencia.
function toProxyUrl(rawUrl: string | undefined, cuil?: string): string | undefined {
  const absolute = resolveTuLegajoUrl(rawUrl);
  if (!absolute) return absolute;
  const withCuil = cuil
    ? `${absolute}${absolute.includes("?") ? "&" : "?"}cuil=${encodeURIComponent(cuil)}`
    : absolute;
  return `/api/descargar?url=${encodeURIComponent(withCuil)}`;
}

export function resolveDocumentoUrls(doc: Documento): Documento {
  return {
    ...doc,
    descargaOriginalURL: toProxyUrl(doc.descargaOriginalURL, doc.cuil),
    descargaDuplicadoURL: toProxyUrl(doc.descargaDuplicadoURL, doc.cuil),
    descargaOriginalFirmadoURL: toProxyUrl(doc.descargaOriginalFirmadoURL, doc.cuil),
    descargaDuplicadoFirmadoURL: toProxyUrl(doc.descargaDuplicadoFirmadoURL, doc.cuil),
  };
}

export function resolveArchivoUrls(archivo: ArchivoLegajo): ArchivoLegajo {
  return {
    ...archivo,
    archivos: archivo.archivos?.map((a) => ({ ...a, uri: toProxyUrl(a.uri, archivo.cuil)! })),
  };
}

export function resolveComunicacionUrl(com: Comunicacion): Comunicacion {
  return { ...com, uri: toProxyUrl(com.uri, com.cuil) };
}
