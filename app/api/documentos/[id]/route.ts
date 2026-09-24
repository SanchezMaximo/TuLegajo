import { NextRequest, NextResponse } from "next/server";
import { tuLegajoGet } from "@/lib/tulegajo-client";
import { handleApiError, resolveDocumentoUrls } from "@/lib/api-helpers";
import type { Documento } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await tuLegajoGet<Documento>(`/documentos/${encodeURIComponent(id)}`);
    return NextResponse.json(resolveDocumentoUrls(data));
  } catch (error) {
    return handleApiError(error);
  }
}
