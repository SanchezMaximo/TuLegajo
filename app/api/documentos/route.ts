import { NextRequest, NextResponse } from "next/server";
import { tuLegajoGet } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";
import type { Documento } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const cuil = request.nextUrl.searchParams.get("cuil") ?? undefined;
    const data = await tuLegajoGet<Documento[]>("/documentos", { cuil });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
