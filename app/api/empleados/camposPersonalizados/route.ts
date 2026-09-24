import { NextResponse } from "next/server";
import { tuLegajoGet } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const data = await tuLegajoGet<string[]>("/empleados/camposPersonalizados");
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
