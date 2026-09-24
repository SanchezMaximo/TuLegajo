import { NextRequest, NextResponse } from "next/server";
import { tuLegajoGet, tuLegajoPost } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";
import type { Lote } from "@/lib/types";

export async function GET() {
  try {
    const data = await tuLegajoGet<Lote[]>("/lotes");
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await tuLegajoPost("/lotes", body);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
