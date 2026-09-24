"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApiGet } from "@/lib/useApi";
import {
  PageHeader,
  LinkButton,
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
import { sortById } from "@/lib/date";
import type { Lote } from "@/lib/types";

export default function LotesPage() {
  const { data, loading, error } = useApiGet<Lote[]>("/api/lotes");
  const [sort, setSort] = useState<SortDirection>("recent");

  const sorted = useMemo(() => (data ? sortById(data, sort) : []), [data, sort]);

  return (
    <div>
      <PageHeader
        title="Lotes de documentos"
        description="Conjuntos de documentos agrupados por periodo."
        action={
          <div className="flex gap-2">
            <LinkButton href="/lotes/cargar-rapido" variant="secondary">
              Carga rápida
            </LinkButton>
            <LinkButton href="/lotes/nuevo">Nuevo lote</LinkButton>
          </div>
        }
      />

      <div className="mb-4 flex justify-end">
        <SortToggle
          value={sort}
          onChange={setSort}
          recentLabel="Creado más reciente"
          oldestLabel="Creado más antiguo"
        />
      </div>

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && sorted.length === 0 && (
        <EmptyState message="Todavía no hay lotes creados." />
      )}

      {!loading && !error && sorted.length > 0 && (
        <TableWrapper>
          <TableHead>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Periodo</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Procesando</th>
          </TableHead>
          <TableBody>
            {sorted.map((lote) => (
              <TableRow key={lote.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/lotes/${lote.id}`}
                    className="font-medium text-slate-900 hover:underline dark:text-slate-100"
                  >
                    {lote.nombre}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{lote.periodo}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={lote.estado} />
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {lote.procesando ? "Sí" : "No"}
                </td>
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>
      )}
    </div>
  );
}
