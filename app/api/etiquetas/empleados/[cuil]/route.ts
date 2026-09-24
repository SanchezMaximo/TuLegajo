import { NextRequest, NextResponse } from "next/server";
import { tuLegajoGet, tuLegajoPut } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";
import type { Etiqueta } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ cuil: string }> }
) {
  try {
    const { cuil } = await params;
    const data = await tuLegajoGet<Etiqueta[]>(
      `/etiquetas/empleados/${encodeURIComponent(cuil)}`
    );
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ cuil: string }> }
) {
  try {
    const { cuil } = await params;
    const body = await request.json();
    const data = await tuLegajoPut(
      `/etiquetas/empleados/${encodeURIComponent(cuil)}`,
      body
    );
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
