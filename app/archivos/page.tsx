"use client";

import { useMemo, useState } from "react";
import { useApiGet } from "@/lib/useApi";
import {
  PageHeader,
  TextInput,
  Button,
  Spinner,
  EmptyState,
  TableWrapper,
  TableHead,
  TableBody,
  TableRow,
  SortToggle,
  type SortDirection,
} from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import { sortByDateField } from "@/lib/date";
import type { ArchivoLegajo } from "@/lib/types";

export default function ArchivosPage() {
  const [cuil, setCuil] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [query, setQuery] = useState({ cuil: "", desde: "", hasta: "" });
  const [sort, setSort] = useState<SortDirection>("recent");

  const params = new URLSearchParams();
  if (query.cuil) params.set("cuil", query.cuil);
  if (query.desde) params.set("fechaDeCargaDesde", query.desde);
  if (query.hasta) params.set("fechaDeCargaHasta", query.hasta);
  const qs = params.toString();

  const { data, loading, error } = useApiGet<ArchivoLegajo[]>(
    `/api/empleados/archivos${qs ? `?${qs}` : ""}`,
    [qs]
  );

  const sorted = useMemo(
    () => (data ? sortByDateField(data, (a) => a.fechaDeCarga, sort) : []),
    [data, sort]
  );

  return (
    <div>
      <PageHeader
        title="Archivos de legajo"
        description="Documentos cargados como repositorio en el legajo de cada empleado (ej: DNI)."
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <form
          className="flex flex-wrap gap-2"
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
        <SortToggle value={sort} onChange={setSort} />
      </div>

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && sorted.length === 0 && (
        <EmptyState message="No se encontraron archivos de legajo." />
      )}

      {!loading && !error && sorted.length > 0 && (
        <TableWrapper>
          <TableHead>
            <th className="px-4 py-3">Archivo</th>
            <th className="px-4 py-3">Empleado</th>
            <th className="px-4 py-3">CUIL</th>
            <th className="px-4 py-3">Fecha de carga</th>
            <th className="px-4 py-3">Cargado por</th>
            <th className="px-4 py-3">Descargas</th>
          </TableHead>
          <TableBody>
            {sorted.map((archivo, idx) => (
              <TableRow key={idx}>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                  {archivo.nombre}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {archivo.empleado ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{archivo.cuil}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {archivo.fechaDeCarga ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {archivo.cargadoPor ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {archivo.archivos?.length ? (
                      archivo.archivos.map((f, i) => (
                        <a
                          key={i}
                          href={f.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-700 underline hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                        >
                          Archivo {i + 1}
                        </a>
                      ))
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">—</span>
                    )}
                  </div>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>
      )}
    </div>
  );
}
