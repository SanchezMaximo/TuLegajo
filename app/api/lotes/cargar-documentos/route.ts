import { NextRequest, NextResponse } from "next/server";
import { tuLegajoPostFormData } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = await tuLegajoPostFormData("/lotes/cargar-documentos", formData);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
