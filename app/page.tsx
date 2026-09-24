import Link from "next/link";
import { Card } from "@/components/ui";

const MODULES = [
  {
    href: "/empleados",
    title: "Empleados",
    description: "Alta, edición, etiquetas, desvinculación y revinculación.",
  },
  {
    href: "/documentos",
    title: "Documentos y Lotes",
    description: "Recibos y liquidaciones: carga en lotes, envío y firma.",
  },
  {
    href: "/licencias",
    title: "Licencias",
    description: "Solicitudes de ausencias, motivos e importación de consumos.",
  },
];

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Panel de TuLegajo</h1>
        <p className="mt-1 text-sm text-slate-500">
          Frontend interno que consume la API de TuLegajo.com (v2.2.0) a través de un proxy
          propio para no exponer la API KEY en el navegador.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((mod) => (
          <Link key={mod.href} href={mod.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <h2 className="text-lg font-semibold text-slate-900">{mod.title}</h2>
              <p className="mt-2 text-sm text-slate-500">{mod.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
