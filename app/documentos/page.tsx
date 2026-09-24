"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApiGet } from "@/lib/useApi";
import {
  PageHeader,
  LinkButton,
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
import StatusBadge from "@/components/StatusBadge";
import VacacionesBadge from "@/components/VacacionesBadge";
import { sortByPeriodo, periodoDentroDeRango } from "@/lib/date";
import { useVacacionesCheck } from "@/lib/useVacacionesCheck";
import type { Documento, EmpleadoResumen } from "@/lib/types";

const PERIODO_DEFECTO = "10-2022";

export default function DocumentosPage() {
  const [cuilFilter, setCuilFilter] = useState("");
  const [appliedCuil, setAppliedCuil] = useState("");
  const [periodoDesde, setPeriodoDesde] = useState(PERIODO_DEFECTO);
  const [sort, setSort] = useState<SortDirection>("recent");
  const { resultados, progreso, checkOne, checkMany } = useVacacionesCheck();
  const [exportando, setExportando] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const { data, loading, error } = useApiGet<Documento[]>(
    `/api/documentos${appliedCuil ? `?cuil=${encodeURIComponent(appliedCuil)}` : ""}`,
    [appliedCuil]
  );
  const { data: empleados } = useApiGet<EmpleadoResumen[]>("/api/empleados");

  const filtrados = useMemo(() => {
    if (!data) return [];
    return data.filter((d) => periodoDentroDeRango(d.lotePeriodo, periodoDesde));
  }, [data, periodoDesde]);

  const sorted = useMemo(
    () => sortByPeriodo(filtrados, (d) => d.lotePeriodo, sort),
    [filtrados, sort]
  );

  const nombresPorCuil = useMemo(() => {
    const map = new Map<string, string>();
    for (const emp of empleados ?? []) {
      map.set(emp.cuil, `${emp.nombre} ${emp.apellido}`);
    }
    return map;
  }, [empleados]);

  function handleVerificarTodos() {
    if (sorted.length > 40 && !window.confirm(
      `Esto va a descargar y leer ${sorted.length} recibos, uno por uno. Puede demorar. ¿Continuar?`
    )) {
      return;
    }
    checkMany(sorted.map((d) => d.id));
  }

  async function handleExportar() {
    const liquidados = sorted.filter((doc) => resultados[doc.id]?.status === "done" && resultados[doc.id]?.liquidada);

    if (liquidados.length === 0) {
      setExportError(
        'No hay recibos marcados como "Liquidada" todavía. Usá "Verificar vacaciones liquidadas" primero.'
      );
      return;
    }

    setExportando(true);
    setExportError(null);
    try {
      const rows = liquidados.map((doc) => ({
        empleado: nombresPorCuil.get(doc.cuil),
        cuil: doc.cuil,
        documento: doc.nombre,
        lote: doc.loteNombre,
        periodo: doc.lotePeriodo,
        estado: doc.estado,
        concepto: resultados[doc.id]?.lineas?.join(" | "),
      }));

      const res = await fetch("/api/documentos/exportar-vacaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message ?? "No se pudo generar el Excel.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vacaciones-liquidadas.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "No se pudo generar el Excel.");
    } finally {
      setExportando(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Documentos"
        description="Recibos, liquidaciones y demás documentos cargados por lote."
        action={<LinkButton href="/lotes">Ver lotes</LinkButton>}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <form
          className="flex flex-wrap gap-2"
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
          <TextInput
            value={periodoDesde}
            onChange={(e) => setPeriodoDesde(e.target.value)}
            placeholder="Periodo desde (MM-YYYY)"
            className="w-44"
          />
          <Button type="submit" variant="secondary">
            Filtrar
          </Button>
        </form>
        <SortToggle
          value={sort}
          onChange={setSort}
          recentLabel="Periodo más reciente"
          oldestLabel="Periodo más antiguo"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          onClick={handleVerificarTodos}
          disabled={!!progreso || sorted.length === 0}
        >
          {progreso ? `Verificando ${progreso.hecho}/${progreso.total}...` : "Verificar vacaciones liquidadas"}
        </Button>
        <Button variant="secondary" onClick={handleExportar} disabled={exportando}>
          {exportando ? "Generando Excel..." : "Exportar liquidadas a Excel"}
        </Button>
      </div>

      {exportError && (
        <div className="mb-4">
          <ErrorAlert message={exportError} />
        </div>
      )}

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && sorted.length === 0 && (
        <EmptyState message="No se encontraron documentos para ese filtro." />
      )}

      {!loading && !error && sorted.length > 0 && (
        <TableWrapper>
          <TableHead>
            <th className="px-4 py-3">Documento</th>
            <th className="px-4 py-3">CUIL</th>
            <th className="px-4 py-3">Lote</th>
            <th className="px-4 py-3">Periodo</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Vacaciones liquidadas</th>
          </TableHead>
          <TableBody>
            {sorted.map((doc) => (
              <TableRow key={doc.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/documentos/${doc.id}`}
                    className="font-medium text-slate-900 hover:underline dark:text-slate-100"
                  >
                    {doc.nombre}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{doc.cuil}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {doc.loteNombre ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {doc.lotePeriodo ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={doc.estado} />
                </td>
                <td className="px-4 py-3">
                  <VacacionesBadge
                    resultado={resultados[doc.id]}
                    onVerificar={() => checkOne(doc.id)}
                  />
                </td>
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>
      )}
    </div>
  );
}
