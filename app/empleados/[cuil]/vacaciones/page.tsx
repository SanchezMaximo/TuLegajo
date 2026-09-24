"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useApiGet } from "@/lib/useApi";
import {
  Card,
  PageHeader,
  TextInput,
  Button,
  Spinner,
  EmptyState,
  TableWrapper,
  TableHead,
  TableBody,
  TableRow,
} from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import StatusBadge from "@/components/StatusBadge";
import VacacionesBadge from "@/components/VacacionesBadge";
import { useVacacionesCheck } from "@/lib/useVacacionesCheck";
import {
  sortByPeriodo,
  periodoDentroDeRango,
  anioDePeriodo,
  anioDeFecha,
} from "@/lib/date";
import type { Documento, Empleado, Licencia, MotivoLicencia } from "@/lib/types";

const PERIODO_DEFECTO = "10-2022";

type Consistencia = "verificar" | "consistente" | "revisar";

interface ResumenAnio {
  anio: number;
  liquidada: boolean | null;
  sinRecibos: boolean;
  gozada: boolean;
  consistencia: Consistencia;
}

export default function VacacionesEmpleadoPage({
  params,
}: {
  params: Promise<{ cuil: string }>;
}) {
  const { cuil } = use(params);
  const encodedCuil = encodeURIComponent(cuil);
  const [periodoDesde, setPeriodoDesde] = useState(PERIODO_DEFECTO);
  const { resultados, progreso, checkOne, checkMany } = useVacacionesCheck();

  const { data: empleado } = useApiGet<Empleado>(`/api/empleados/${encodedCuil}`);
  const { data: documentos, loading: loadingDocs, error: errorDocs } = useApiGet<Documento[]>(
    `/api/documentos?cuil=${encodedCuil}`
  );
  const { data: licencias, loading: loadingLic, error: errorLic } = useApiGet<Licencia[]>(
    `/api/licencias?cuil=${encodedCuil}`
  );
  const { data: motivos } = useApiGet<MotivoLicencia[]>("/api/licencias/motivos");

  const recibos = useMemo(() => {
    if (!documentos) return [];
    const filtrados = documentos.filter((d) => periodoDentroDeRango(d.lotePeriodo, periodoDesde));
    return sortByPeriodo(filtrados, (d) => d.lotePeriodo, "recent");
  }, [documentos, periodoDesde]);

  const nombresMotivosVacacionales = useMemo(() => {
    return new Set((motivos ?? []).filter((m) => m.vacaciones).map((m) => m.nombreMotivo));
  }, [motivos]);

  const licenciasVacaciones = useMemo(() => {
    if (!licencias) return [];
    return licencias
      .filter((l) => nombresMotivosVacacionales.has(l.nombreMotivo ?? ""))
      .filter((l) => {
        const anio = anioDeFecha(l.fechaDeInicio ?? l.fechaDeSolicitud);
        const limite = anioDePeriodo(periodoDesde);
        return anio !== null && limite !== null ? anio >= limite : true;
      })
      .sort((a, b) => (b.fechaDeInicio ?? "").localeCompare(a.fechaDeInicio ?? ""));
  }, [licencias, nombresMotivosVacacionales, periodoDesde]);

  const resumenPorAnio = useMemo<ResumenAnio[]>(() => {
    const anioActual = new Date().getFullYear();
    const anioInicio = anioDePeriodo(periodoDesde) ?? anioActual;
    const anios: number[] = [];
    for (let a = anioInicio; a <= anioActual; a++) anios.push(a);

    return anios.map((anio) => {
      const recibosDelAnio = recibos.filter((d) => anioDePeriodo(d.lotePeriodo) === anio);
      const sinRecibos = recibosDelAnio.length === 0;
      const estadosConocidos = recibosDelAnio.map((d) => resultados[d.id]);
      const algunoLiquidado = estadosConocidos.some((r) => r?.status === "done" && r.liquidada);
      const todosVerificados = !sinRecibos && estadosConocidos.every((r) => r?.status === "done");

      let liquidada: boolean | null = sinRecibos ? false : null;
      if (algunoLiquidado) liquidada = true;
      else if (todosVerificados) liquidada = false;

      const gozada = licenciasVacaciones.some(
        (l) => anioDeFecha(l.fechaDeInicio ?? l.fechaDeSolicitud) === anio && l.estadoLicencia === "Aprobada"
      );

      let consistencia: Consistencia = "verificar";
      if (liquidada !== null) {
        consistencia = liquidada === gozada ? "consistente" : "revisar";
      }

      return { anio, liquidada, sinRecibos, gozada, consistencia };
    });
  }, [recibos, resultados, licenciasVacaciones, periodoDesde]);

  function handleVerificarTodos() {
    const ids = recibos.map((d) => d.id);
    if (ids.length > 40 && !window.confirm(`Esto va a leer ${ids.length} recibos. ¿Continuar?`)) {
      return;
    }
    checkMany(ids);
  }

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title={empleado ? `Vacaciones de ${empleado.nombre} ${empleado.apellido}` : "Vacaciones"}
        description={`CUIL ${cuil} · Liquidadas (recibos) vs. gozadas (licencias aprobadas)`}
      />

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="periodoDesde" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Periodo desde
            </label>
            <TextInput
              id="periodoDesde"
              value={periodoDesde}
              onChange={(e) => setPeriodoDesde(e.target.value)}
              placeholder="MM-YYYY"
              className="w-40"
            />
          </div>
          <Link
            href={`/empleados/${encodedCuil}`}
            className="text-sm text-slate-600 underline hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Volver a la ficha del empleado
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Resumen por año
        </h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Una fila queda marcada para revisar cuando la vacación se liquidó en los recibos pero no
          hay una licencia de vacaciones aprobada ese año, o viceversa.
        </p>
        <TableWrapper>
          <TableHead>
            <th className="px-4 py-3">Año</th>
            <th className="px-4 py-3">Liquidada (recibos)</th>
            <th className="px-4 py-3">Gozada (licencias)</th>
            <th className="px-4 py-3">Consistencia</th>
          </TableHead>
          <TableBody>
            {resumenPorAnio.map((r) => (
              <TableRow key={r.anio}>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{r.anio}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {r.sinRecibos
                    ? "Sin recibos"
                    : r.liquidada === null
                      ? "Sin verificar"
                      : r.liquidada
                        ? "Sí"
                        : "No"}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {r.gozada ? "Sí" : "No"}
                </td>
                <td className="px-4 py-3">
                  {r.consistencia === "verificar" && (
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Verificá los recibos de este año
                    </span>
                  )}
                  {r.consistencia === "consistente" && (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-500/30">
                      Consistente
                    </span>
                  )}
                  {r.consistencia === "revisar" && (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-500/30">
                      Revisar inconsistencia
                    </span>
                  )}
                </td>
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Recibos desde {periodoDesde}
          </h2>
          <Button
            variant="secondary"
            onClick={handleVerificarTodos}
            disabled={!!progreso || recibos.length === 0}
          >
            {progreso ? `Verificando ${progreso.hecho}/${progreso.total}...` : "Verificar todos"}
          </Button>
        </div>

        {loadingDocs && <Spinner />}
        {errorDocs && <ErrorAlert message={errorDocs} />}
        {!loadingDocs && !errorDocs && recibos.length === 0 && (
          <EmptyState message="No hay recibos en ese rango de periodos." />
        )}
        {!loadingDocs && !errorDocs && recibos.length > 0 && (
          <TableWrapper>
            <TableHead>
              <th className="px-4 py-3">Documento</th>
              <th className="px-4 py-3">Periodo</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Vacaciones liquidadas</th>
            </TableHead>
            <TableBody>
              {recibos.map((doc) => (
                <TableRow key={doc.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/documentos/${doc.id}`}
                      className="font-medium text-slate-900 hover:underline dark:text-slate-100"
                    >
                      {doc.nombre}
                    </Link>
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
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Licencias de vacaciones (gozadas)
        </h2>

        {loadingLic && <Spinner />}
        {errorLic && <ErrorAlert message={errorLic} />}
        {!loadingLic && !errorLic && licenciasVacaciones.length === 0 && (
          <EmptyState message="No hay licencias de vacaciones registradas en ese rango." />
        )}
        {!loadingLic && !errorLic && licenciasVacaciones.length > 0 && (
          <TableWrapper>
            <TableHead>
              <th className="px-4 py-3">Desde</th>
              <th className="px-4 py-3">Hasta</th>
              <th className="px-4 py-3">Días</th>
              <th className="px-4 py-3">Estado</th>
            </TableHead>
            <TableBody>
              {licenciasVacaciones.map((l) => (
                <TableRow key={l.id}>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {l.fechaDeInicio ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {l.fechaDeFin ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {l.diasSolicitados ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={l.estadoLicencia} />
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </TableWrapper>
        )}
      </Card>
    </div>
  );
}
