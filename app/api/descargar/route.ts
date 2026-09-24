import { NextRequest, NextResponse } from "next/server";
import { tuLegajoFetchBinary, isTuLegajoUrl, TuLegajoApiError } from "@/lib/tulegajo-client";

// Proxy de descarga: los links que devuelve la API (recibos, archivos de
// legajo, comunicaciones) requieren el header x-api-key igual que cualquier
// otro endpoint, así que un <a href> directo del navegador no puede
// autenticarse. Esta ruta reenvía la descarga agregando ese header del lado
// del servidor.
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url || !isTuLegajoUrl(url)) {
    return NextResponse.json({ message: "URL de descarga inválida." }, { status: 400 });
  }

  try {
    const res = await tuLegajoFetchBinary(url);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { message: `No se pudo descargar el archivo (HTTP ${res.status}). ${text}`.trim() },
        { status: res.status }
      );
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/octet-stream",
        "Content-Disposition": res.headers.get("content-disposition") ?? "inline",
      },
    });
  } catch (error) {
    if (error instanceof TuLegajoApiError) {
      return NextResponse.json({ message: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : "Error al descargar el archivo.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
