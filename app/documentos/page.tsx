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
import { sortById } from "@/lib/date";
import type { Documento } from "@/lib/types";

export default function DocumentosPage() {
  const [cuilFilter, setCuilFilter] = useState("");
  const [appliedCuil, setAppliedCuil] = useState("");
  const [sort, setSort] = useState<SortDirection>("recent");

  const { data, loading, error } = useApiGet<Documento[]>(
    `/api/documentos${appliedCuil ? `?cuil=${encodeURIComponent(appliedCuil)}` : ""}`,
    [appliedCuil]
  );

  const sorted = useMemo(() => (data ? sortById(data, sort) : []), [data, sort]);

  return (
    <div>
      <PageHeader
        title="Documentos"
        description="Recibos, liquidaciones y demás documentos cargados por lote."
        action={<LinkButton href="/lotes">Ver lotes</LinkButton>}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <form
          className="flex gap-2"
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
        <SortToggle
          value={sort}
          onChange={setSort}
          recentLabel="Cargado más reciente"
          oldestLabel="Cargado más antiguo"
        />
      </div>

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && sorted.length === 0 && (
        <EmptyState message="No se encontraron documentos." />
      )}

      {!loading && !error && sorted.length > 0 && (
        <TableWrapper>
          <TableHead>
            <th className="px-4 py-3">Documento</th>
            <th className="px-4 py-3">CUIL</th>
            <th className="px-4 py-3">Lote</th>
            <th className="px-4 py-3">Periodo</th>
            <th className="px-4 py-3">Estado</th>
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
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>
      )}
    </div>
  );
}
