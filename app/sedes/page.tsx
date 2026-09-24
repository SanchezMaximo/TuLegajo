"use client";

import { useApiGet } from "@/lib/useApi";
import {
  PageHeader,
  Spinner,
  EmptyState,
  TableWrapper,
  TableHead,
  TableBody,
  TableRow,
} from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import type { Sede } from "@/lib/types";

export default function SedesPage() {
  const { data, loading, error } = useApiGet<Sede[]>("/api/sedes");

  return (
    <div>
      <PageHeader title="Sedes" description="Sedes configuradas en la organización." />

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState message="No hay sedes configuradas." />
      )}

      {!loading && !error && (data?.length ?? 0) > 0 && (
        <TableWrapper>
          <TableHead>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Código</th>
          </TableHead>
          <TableBody>
            {data!.map((sede) => (
              <TableRow key={sede.codigo}>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                  {sede.nombre}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{sede.codigo}</td>
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>
      )}
    </div>
  );
}
