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
import type { Documento } from "@/lib/types";

const PERIODO_DEFECTO = "10-2022";

export default function DocumentosPage() {
  const [cuilFilter, setCuilFilter] = useState("");
  const [appliedCuil, setAppliedCuil] = useState("");
  const [periodoDesde, setPeriodoDesde] = useState(PERIODO_DEFECTO);
  const [sort, setSort] = useState<SortDirection>("recent");
  const { resultados, progreso, checkOne, checkMany } = useVacacionesCheck();

  const { data, loading, error } = useApiGet<Documento[]>(
    `/api/documentos${appliedCuil ? `?cuil=${encodeURIComponent(appliedCuil)}` : ""}`,
    [appliedCuil]
  );

  const filtrados = useMemo(() => {
    if (!data) return [];
    return data.filter((d) => periodoDentroDeRango(d.lotePeriodo, periodoDesde));
  }, [data, periodoDesde]);

  const sorted = useMemo(
    () => sortByPeriodo(filtrados, (d) => d.lotePeriodo, sort),
    [filtrados, sort]
  );

  function handleVerificarTodos() {
    if (sorted.length > 40 && !window.confirm(
      `Esto va a descargar y leer ${sorted.length} recibos, uno por uno. Puede demorar. ¿Continuar?`
    )) {
      return;
    }
    checkMany(sorted.map((d) => d.id));
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

      <div className="mb-4 flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={handleVerificarTodos}
          disabled={!!progreso || sorted.length === 0}
        >
          {progreso ? `Verificando ${progreso.hecho}/${progreso.total}...` : "Verificar vacaciones liquidadas"}
        </Button>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Descarga y lee cada PDF buscando el concepto &quot;VACACIONES&quot;. Puede tardar.
        </span>
      </div>

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
