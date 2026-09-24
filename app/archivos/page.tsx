"use client";

import { useState } from "react";
import { useApiGet } from "@/lib/useApi";
import { PageHeader, TextInput, Button, Spinner, EmptyState } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import type { ArchivoLegajo } from "@/lib/types";

export default function ArchivosPage() {
  const [cuil, setCuil] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [query, setQuery] = useState({ cuil: "", desde: "", hasta: "" });

  const params = new URLSearchParams();
  if (query.cuil) params.set("cuil", query.cuil);
  if (query.desde) params.set("fechaDeCargaDesde", query.desde);
  if (query.hasta) params.set("fechaDeCargaHasta", query.hasta);
  const qs = params.toString();

  const { data, loading, error } = useApiGet<ArchivoLegajo[]>(
    `/api/empleados/archivos${qs ? `?${qs}` : ""}`,
    [qs]
  );

  return (
    <div>
      <PageHeader
        title="Archivos de legajo"
        description="Documentos cargados como repositorio en el legajo de cada empleado (ej: DNI)."
      />

      <form
        className="mb-4 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery({ cuil: cuil.trim(), desde, hasta });
        }}
      >
        <TextInput
          placeholder="Filtrar por CUIL..."
          value={cuil}
          onChange={(e) => setCuil(e.target.value)}
          className="w-full max-w-xs"
        />
        <TextInput
          placeholder="Desde (DD/MM/YYYY)"
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
          className="w-44"
        />
        <TextInput
          placeholder="Hasta (DD/MM/YYYY)"
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
          className="w-44"
        />
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState message="No se encontraron archivos de legajo." />
      )}

      {!loading && !error && (data?.length ?? 0) > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Archivo</th>
                <th className="px-4 py-3">Empleado</th>
                <th className="px-4 py-3">CUIL</th>
                <th className="px-4 py-3">Fecha de carga</th>
                <th className="px-4 py-3">Cargado por</th>
                <th className="px-4 py-3">Descargas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data!.map((archivo, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{archivo.nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{archivo.empleado ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{archivo.cuil}</td>
                  <td className="px-4 py-3 text-slate-600">{archivo.fechaDeCarga ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{archivo.cargadoPor ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {archivo.archivos?.length ? (
                        archivo.archivos.map((f, i) => (
                          <a
                            key={i}
                            href={`${f.uri}${f.uri.includes("?") ? "&" : "?"}cuil=${encodeURIComponent(
                              archivo.cuil
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-700 underline hover:text-slate-900"
                          >
                            Archivo {i + 1}
                          </a>
                        ))
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>
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
