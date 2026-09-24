import { NextRequest, NextResponse } from "next/server";
import { tuLegajoPost } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await tuLegajoPost("/licencias/importar/consumo", body);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
