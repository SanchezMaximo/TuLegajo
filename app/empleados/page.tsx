"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApiGet } from "@/lib/useApi";
import { PageHeader, LinkButton, TextInput, Spinner, EmptyState } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import StatusBadge from "@/components/StatusBadge";
import type { EmpleadoResumen } from "@/lib/types";

export default function EmpleadosPage() {
  const { data, loading, error } = useApiGet<EmpleadoResumen[]>("/api/empleados");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((e) =>
      [e.nombre, e.apellido, e.cuil, e.legajo, e.usuario]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(term))
    );
  }, [data, search]);

  return (
    <div>
      <PageHeader
        title="Empleados"
        description="Empleados dados de alta en TuLegajo.com."
        action={
          <div className="flex gap-2">
            <LinkButton href="/sedes" variant="secondary">
              Sedes
            </LinkButton>
            <LinkButton href="/etiquetas" variant="secondary">
              Etiquetas
            </LinkButton>
            <LinkButton href="/empleados/nuevo">Nuevo empleado</LinkButton>
          </div>
        }
      />

      <div className="mb-4">
        <TextInput
          placeholder="Buscar por nombre, apellido, CUIL o legajo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm"
        />
      </div>

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState message="No se encontraron empleados." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">CUIL</th>
                <th className="px-4 py-3">Legajo</th>
                <th className="px-4 py-3">Sede</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((emp) => (
                <tr key={emp.cuil} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/empleados/${encodeURIComponent(emp.cuil)}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {emp.nombre} {emp.apellido}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{emp.cuil}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.legajo}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.sedeNombre ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={emp.estado} />
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
