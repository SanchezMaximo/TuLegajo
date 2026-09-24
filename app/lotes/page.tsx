"use client";

import Link from "next/link";
import { useApiGet } from "@/lib/useApi";
import { PageHeader, LinkButton, Spinner, EmptyState } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import StatusBadge from "@/components/StatusBadge";
import type { Lote } from "@/lib/types";

export default function LotesPage() {
  const { data, loading, error } = useApiGet<Lote[]>("/api/lotes");

  return (
    <div>
      <PageHeader
        title="Lotes de documentos"
        description="Conjuntos de documentos agrupados por periodo."
        action={<LinkButton href="/lotes/nuevo">Nuevo lote</LinkButton>}
      />

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState message="Todavía no hay lotes creados." />
      )}

      {!loading && !error && (data?.length ?? 0) > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Periodo</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Procesando</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data!.map((lote) => (
                <tr key={lote.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/lotes/${lote.id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {lote.nombre}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{lote.periodo}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lote.estado} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">{lote.procesando ? "Sí" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
