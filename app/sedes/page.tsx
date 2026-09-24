"use client";

import { useApiGet } from "@/lib/useApi";
import { PageHeader, Spinner, EmptyState } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import type { Sede } from "@/lib/types";

export default function SedesPage() {
  const { data, loading, error } = useApiGet<Sede[]>("/api/sedes");

  return (
    <div>
      <PageHeader title="Sedes" description="Sedes configuradas en la organización." />

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState message="No hay sedes configuradas." />
      )}

      {!loading && !error && (data?.length ?? 0) > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Código</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data!.map((sede) => (
                <tr key={sede.codigo} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{sede.nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{sede.codigo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
