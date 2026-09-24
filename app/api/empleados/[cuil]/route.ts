import { NextRequest, NextResponse } from "next/server";
import { tuLegajoGet, tuLegajoPut } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";
import type { Empleado } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ cuil: string }> }
) {
  try {
    const { cuil } = await params;
    const data = await tuLegajoGet<Empleado>(`/empleados/${encodeURIComponent(cuil)}`);
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
    const data = await tuLegajoPut(`/empleados/${encodeURIComponent(cuil)}`, body);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
