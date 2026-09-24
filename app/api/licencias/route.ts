import { NextRequest, NextResponse } from "next/server";
import { tuLegajoGet } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";
import type { Licencia } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const data = await tuLegajoGet<Licencia[]>("/licencias", {
      cuil: sp.get("cuil") ?? undefined,
      nombre: sp.get("nombre") ?? undefined,
      apellido: sp.get("apellido") ?? undefined,
      fechaDeSolicitudDesde: sp.get("fechaDeSolicitudDesde") ?? undefined,
      fechaDeSolicitudHasta: sp.get("fechaDeSolicitudHasta") ?? undefined,
      nombreMotivo: sp.get("nombreMotivo") ?? undefined,
      codigoMotivo: sp.get("codigoMotivo") ?? undefined,
      estado: sp.get("estado") ?? undefined,
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
