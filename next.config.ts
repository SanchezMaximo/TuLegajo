import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse (via pdfjs-dist) resuelve rutas de worker en runtime; si Next lo
  // empaqueta, esas rutas se rompen. Lo dejamos afuera del bundle.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
