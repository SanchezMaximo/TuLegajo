"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApiGet } from "@/lib/useApi";
import {
  PageHeader,
  LinkButton,
  TextInput,
  Select,
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
import { sortByDateField } from "@/lib/date";
import type { Comunicacion } from "@/lib/types";

export default function ComunicacionesPage() {
  const [cuil, setCuil] = useState("");
  const [direccion, setDireccion] = useState("por-empleados");
  const [query, setQuery] = useState({ cuil: "", enviadasAEmpleados: "false" });
  const [sort, setSort] = useState<SortDirection>("recent");

  const params = new URLSearchParams();
  if (query.cuil) params.set("cuil", query.cuil);
  params.set("enviadasAEmpleados", query.enviadasAEmpleados);
  const qs = params.toString();

  const { data, loading, error } = useApiGet<Comunicacion[]>(`/api/comunicaciones?${qs}`, [qs]);

  const sorted = useMemo(
    () => (data ? sortByDateField(data, (c) => c.fechaDeEnvio, sort) : []),
    [data, sort]
  );

  return (
    <div>
      <PageHeader
        title="Comunicaciones"
        description="PDFs enviados entre la organización y los empleados."
        action={<LinkButton href="/comunicaciones/enviar">Enviar comunicación</LinkButton>}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery({ cuil: cuil.trim(), enviadasAEmpleados: direccion === "a-empleados" ? "true" : "false" });
          }}
        >
          <TextInput
            placeholder="Filtrar por CUIL..."
            value={cuil}
            onChange={(e) => setCuil(e.target.value)}
            className="w-full max-w-xs"
          />
          <Select value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-64">
            <option value="por-empleados">Enviadas por empleados</option>
            <option value="a-empleados">Enviadas a empleados</option>
          </Select>
          <Button type="submit" variant="secondary">
            Filtrar
          </Button>
        </form>
        <SortToggle value={sort} onChange={setSort} />
      </div>

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && sorted.length === 0 && (
        <EmptyState message="No se encontraron comunicaciones." />
      )}

      {!loading && !error && sorted.length > 0 && (
        <TableWrapper>
          <TableHead>
            <th className="px-4 py-3">Asunto</th>
            <th className="px-4 py-3">Empleado</th>
            <th className="px-4 py-3">Fecha de envío</th>
            <th className="px-4 py-3">Estado</th>
          </TableHead>
          <TableBody>
            {sorted.map((com) => (
              <TableRow key={com.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/comunicaciones/${com.id}`}
                    className="font-medium text-slate-900 hover:underline dark:text-slate-100"
                  >
                    {com.asunto}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {com.empleado ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {com.fechaDeEnvio ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={com.estado} />
                </td>
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>
      )}
    </div>
  );
}
