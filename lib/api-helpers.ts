import { NextResponse } from "next/server";
import { TuLegajoApiError } from "./tulegajo-client";

export function handleApiError(error: unknown) {
  if (error instanceof TuLegajoApiError) {
    return NextResponse.json(
      { message: error.message, path: error.path, timestamp: error.timestamp },
      { status: error.statusCode }
    );
  }
  const message = error instanceof Error ? error.message : "Error desconocido";
  return NextResponse.json({ message }, { status: 500 });
}
