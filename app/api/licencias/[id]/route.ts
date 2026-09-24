import { NextRequest, NextResponse } from "next/server";
import { tuLegajoGet } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";
import type { Licencia } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await tuLegajoGet<Licencia>(`/licencias/${encodeURIComponent(id)}`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
