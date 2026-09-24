import { NextRequest, NextResponse } from "next/server";
import { tuLegajoPost } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await tuLegajoPost(`/documentos/${encodeURIComponent(id)}/firmar`, body);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
