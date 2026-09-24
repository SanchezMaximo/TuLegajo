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
import type { MotivoLicencia } from "@/lib/types";

export default function MotivosLicenciaPage() {
  const { data, loading, error } = useApiGet<MotivoLicencia[]>("/api/licencias/motivos");

  return (
    <div>
      <PageHeader
        title="Motivos de licencia"
        description="Motivos configurados en la organización."
      />

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState message="No hay motivos de licencia configurados." />
      )}

      {!loading && !error && (data?.length ?? 0) > 0 && (
        <TableWrapper>
          <TableHead>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Código</th>
            <th className="px-4 py-3">Vacaciones</th>
          </TableHead>
          <TableBody>
            {data!.map((motivo) => (
              <TableRow key={motivo.id}>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                  {motivo.nombreMotivo}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {motivo.codigoMotivo ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {motivo.vacaciones ? "Sí" : "No"}
                </td>
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>
      )}
    </div>
  );
}
