import { NextRequest, NextResponse } from "next/server";
import { tuLegajoGet } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";
import type { Responsable } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ cuil: string }> }
) {
  try {
    const { cuil } = await params;
    const data = await tuLegajoGet<Responsable[]>(
      `/responsables/${encodeURIComponent(cuil)}`
    );
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
