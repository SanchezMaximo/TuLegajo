import { NextRequest, NextResponse } from "next/server";
import { tuLegajoPost } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cuil: string }> }
) {
  try {
    const { cuil } = await params;
    const body = await request.json().catch(() => ({}));
    const data = await tuLegajoPost(
      `/empleados/${encodeURIComponent(cuil)}/desvincular`,
      body
    );
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
