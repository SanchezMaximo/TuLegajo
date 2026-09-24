"use client";

import Link from "next/link";
import { useApiGet } from "@/lib/useApi";
import { PageHeader, LinkButton, Spinner, EmptyState } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import type { Responsable } from "@/lib/types";

export default function ResponsablesPage() {
  const { data, loading, error } = useApiGet<Responsable[]>("/api/responsables");

  return (
    <div>
      <PageHeader
        title="Responsables"
        description="Usuarios con roles de gestión sobre empleados u etiquetas."
        action={<LinkButton href="/responsables/nuevo">Nuevo responsable</LinkButton>}
      />

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState message="No hay responsables cargados." />
      )}

      {!loading && !error && (data?.length ?? 0) > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">CUIL</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Sobre etiquetas</th>
                <th className="px-4 py-3">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data!.map((r, idx) => (
                <tr key={`${r.cuil}-${r.rol}-${idx}`} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/responsables/${encodeURIComponent(r.cuil)}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {r.nombre} {r.apellido}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.cuil}</td>
                  <td className="px-4 py-3 text-slate-600">{r.rol}</td>
                  <td className="px-4 py-3 text-slate-600">{r.sobreEtiquetas ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{r.correoElectronico ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
