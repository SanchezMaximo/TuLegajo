import { NextRequest, NextResponse } from "next/server";
import { tuLegajoPost } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ cuil: string }> }
) {
  try {
    const { cuil } = await params;
    const data = await tuLegajoPost(`/empleados/${encodeURIComponent(cuil)}/revincular`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
