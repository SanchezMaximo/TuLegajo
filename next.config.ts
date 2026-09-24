import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse (via pdfjs-dist) resuelve rutas de worker en runtime; si Next lo
  // empaqueta, esas rutas se rompen. Lo dejamos afuera del bundle.
  // @napi-rs/canvas es un binario nativo (polyfill de DOMMatrix que pdfjs-dist
  // necesita para ciertos PDFs) y por la misma razón no se puede empaquetar.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "@napi-rs/canvas"],
  // pdfjs-dist carga su "worker" con un import calculado en runtime, así que
  // el rastreo automático de Vercel (Node File Trace) no siempre lo detecta
  // como dependencia y lo deja fuera del deploy de esta función -> 500 en
  // producción aunque local funcione. Se lo incluimos a mano, junto con el
  // binario nativo de @napi-rs/canvas.
  // npm a veces duplica @napi-rs/canvas-* adentro de node_modules/pdf-parse/
  // y node_modules/pdfjs-dist/ (resolución de versiones en conflicto), así
  // que el patrón usa ** antes del paquete para pescarlo sin importar dónde
  // haya terminado.
  outputFileTracingIncludes: {
    "/api/documentos/\\[id\\]/vacaciones": [
      "./node_modules/pdfjs-dist/legacy/build/**/*",
      "./node_modules/pdfjs-dist/cmaps/**/*",
      "./node_modules/pdfjs-dist/standard_fonts/**/*",
      "./node_modules/**/@napi-rs/canvas/**/*",
      "./node_modules/**/@napi-rs/canvas-linux-x64-gnu/**/*",
      "./node_modules/**/@napi-rs/canvas-linux-x64-musl/**/*",
    ],
  },
};

export default nextConfig;
