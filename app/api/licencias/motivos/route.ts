import { NextResponse } from "next/server";
import { tuLegajoGet } from "@/lib/tulegajo-client";
import { handleApiError } from "@/lib/api-helpers";
import type { MotivoLicencia } from "@/lib/types";

export async function GET() {
  try {
    const data = await tuLegajoGet<MotivoLicencia[]>("/licencias/motivos");
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
