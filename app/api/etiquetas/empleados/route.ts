import { NextResponse } from "next/server";
import { tuLegajoGet } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";
import type { Etiqueta } from "@/lib/types";

export async function GET() {
  try {
    const data = await tuLegajoGet<Etiqueta[]>("/etiquetas/empleados");
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
