"use client";

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
} from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import type { Responsable } from "@/lib/types";

export default function ResponsablesPage() {
  const { data, loading, error } = useApiGet<Responsable[]>("/api/responsables");

  return (
    <div>
      <PageHeader
        title="Responsables"
        description="Usuarios con roles de gestión sobre empleados u etiquetas."
        action={<LinkButton href="/responsables/nuevo">Nuevo responsable</LinkButton>}
      />

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState message="No hay responsables cargados." />
      )}

      {!loading && !error && (data?.length ?? 0) > 0 && (
        <TableWrapper>
          <TableHead>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">CUIL</th>
            <th className="px-4 py-3">Rol</th>
            <th className="px-4 py-3">Sobre etiquetas</th>
            <th className="px-4 py-3">Email</th>
          </TableHead>
          <TableBody>
            {data!.map((r, idx) => (
              <TableRow key={`${r.cuil}-${r.rol}-${idx}`}>
                <td className="px-4 py-3">
                  <Link
                    href={`/responsables/${encodeURIComponent(r.cuil)}`}
                    className="font-medium text-slate-900 hover:underline dark:text-slate-100"
                  >
                    {r.nombre} {r.apellido}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.cuil}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.rol}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {r.sobreEtiquetas ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {r.correoElectronico ?? "—"}
                </td>
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>
      )}
    </div>
  );
}
