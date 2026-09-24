import { NextRequest, NextResponse } from "next/server";

// Gate simple de usuario y contraseña para toda la app (páginas y /api/*).
// Pensado para compartir el panel con poca gente sin exponer legajos y
// datos de sueldo a cualquiera que tenga el link. Si no se configuran
// AUTH_USER/AUTH_PASSWORD, no bloquea nada (útil en desarrollo local).
export function proxy(request: NextRequest) {
  const user = process.env.AUTH_USER;
  const password = process.env.AUTH_PASSWORD;

  if (!user || !password) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
    const separatorIndex = decoded.indexOf(":");
    const reqUser = decoded.slice(0, separatorIndex);
    const reqPassword = decoded.slice(separatorIndex + 1);
    if (reqUser === user && reqPassword === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Autenticación requerida.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="TuLegajo Panel"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
