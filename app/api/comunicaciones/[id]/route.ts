import { NextRequest, NextResponse } from "next/server";
import { tuLegajoGet } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";
import type { Comunicacion } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await tuLegajoGet<Comunicacion>(
      `/empleados/comunicaciones/${encodeURIComponent(id)}`
    );
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
