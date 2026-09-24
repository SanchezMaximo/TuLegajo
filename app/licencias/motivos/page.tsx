"use client";

import { useApiGet } from "@/lib/useApi";
import { PageHeader, Spinner, EmptyState } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import type { MotivoLicencia } from "@/lib/types";

export default function MotivosLicenciaPage() {
  const { data, loading, error } = useApiGet<MotivoLicencia[]>("/api/licencias/motivos");

  return (
    <div>
      <PageHeader
        title="Motivos de licencia"
        description="Motivos configurados en la organización."
      />

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState message="No hay motivos de licencia configurados." />
      )}

      {!loading && !error && (data?.length ?? 0) > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Vacaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data!.map((motivo) => (
                <tr key={motivo.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{motivo.nombreMotivo}</td>
                  <td className="px-4 py-3 text-slate-600">{motivo.codigoMotivo ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{motivo.vacaciones ? "Sí" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
