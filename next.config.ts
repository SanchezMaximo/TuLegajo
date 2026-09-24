import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse (via pdfjs-dist) resuelve rutas de worker en runtime; si Next lo
  // empaqueta, esas rutas se rompen. Lo dejamos afuera del bundle.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  // pdfjs-dist carga su "worker" con un import calculado en runtime, así que
  // el rastreo automático de Vercel (Node File Trace) no siempre lo detecta
  // como dependencia y lo deja fuera del deploy de esta función -> 500 en
  // producción aunque local funcione. Se lo incluimos a mano.
  outputFileTracingIncludes: {
    "/api/documentos/\\[id\\]/vacaciones": [
      "./node_modules/pdfjs-dist/legacy/build/**/*",
      "./node_modules/pdfjs-dist/cmaps/**/*",
      "./node_modules/pdfjs-dist/standard_fonts/**/*",
    ],
  },
};

export default nextConfig;
