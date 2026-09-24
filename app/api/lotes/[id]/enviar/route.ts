import { NextRequest, NextResponse } from "next/server";
import { tuLegajoPost } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await tuLegajoPost(`/lotes/${encodeURIComponent(id)}/enviar`);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
