"use client";

import { useState } from "react";
import Link from "next/link";
import { useApiGet } from "@/lib/useApi";
import { PageHeader, LinkButton, TextInput, Button, Spinner, EmptyState } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import StatusBadge from "@/components/StatusBadge";
import type { Documento } from "@/lib/types";

export default function DocumentosPage() {
  const [cuilFilter, setCuilFilter] = useState("");
  const [appliedCuil, setAppliedCuil] = useState("");

  const { data, loading, error } = useApiGet<Documento[]>(
    `/api/documentos${appliedCuil ? `?cuil=${encodeURIComponent(appliedCuil)}` : ""}`,
    [appliedCuil]
  );

  return (
    <div>
      <PageHeader
        title="Documentos"
        description="Recibos, liquidaciones y demás documentos cargados por lote."
        action={<LinkButton href="/lotes">Ver lotes</LinkButton>}
      />

      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setAppliedCuil(cuilFilter.trim());
        }}
      >
        <TextInput
          placeholder="Filtrar por CUIL del empleado..."
          value={cuilFilter}
          onChange={(e) => setCuilFilter(e.target.value)}
          className="w-full max-w-sm"
        />
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState message="No se encontraron documentos." />
      )}

      {!loading && !error && (data?.length ?? 0) > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Documento</th>
                <th className="px-4 py-3">CUIL</th>
                <th className="px-4 py-3">Lote</th>
                <th className="px-4 py-3">Periodo</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data!.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/documentos/${doc.id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {doc.nombre}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{doc.cuil}</td>
                  <td className="px-4 py-3 text-slate-600">{doc.loteNombre ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{doc.lotePeriodo ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={doc.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
