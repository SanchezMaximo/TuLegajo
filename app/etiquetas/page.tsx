"use client";

import { useApiGet } from "@/lib/useApi";
import { PageHeader, Spinner, EmptyState } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import type { Etiqueta } from "@/lib/types";

export default function EtiquetasPage() {
  const { data, loading, error } = useApiGet<Etiqueta[]>("/api/etiquetas/empleados");

  return (
    <div>
      <PageHeader
        title="Etiquetas"
        description="Catálogo de etiquetas que se pueden asignar a los empleados."
      />

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState message="Todavía no hay etiquetas creadas." />
      )}

      {!loading && !error && (data?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2">
          {data!.map((et) => (
            <span
              key={et.nombre}
              className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20"
            >
              {et.nombre}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
