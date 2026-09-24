import { NextRequest, NextResponse } from "next/server";
import { tuLegajoGet } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";
import type { Comunicacion } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const data = await tuLegajoGet<Comunicacion[]>("/empleados/comunicaciones", {
      cuil: sp.get("cuil") ?? undefined,
      fechaDeEnvioDesde: sp.get("fechaDeEnvioDesde") ?? undefined,
      fechaDeEnvioHasta: sp.get("fechaDeEnvioHasta") ?? undefined,
      enviadasAEmpleados: sp.get("enviadasAEmpleados") ?? undefined,
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
