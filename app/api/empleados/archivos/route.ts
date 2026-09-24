import { NextRequest, NextResponse } from "next/server";
import { tuLegajoGet } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";
import type { ArchivoLegajo } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const data = await tuLegajoGet<ArchivoLegajo[]>("/empleados/archivos", {
      cuil: sp.get("cuil") ?? undefined,
      fechaDeCargaDesde: sp.get("fechaDeCargaDesde") ?? undefined,
      fechaDeCargaHasta: sp.get("fechaDeCargaHasta") ?? undefined,
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
