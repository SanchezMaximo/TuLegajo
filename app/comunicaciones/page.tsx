"use client";

import { useState } from "react";
import Link from "next/link";
import { useApiGet } from "@/lib/useApi";
import { PageHeader, LinkButton, TextInput, Select, Button, Spinner, EmptyState } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import StatusBadge from "@/components/StatusBadge";
import type { Comunicacion } from "@/lib/types";

export default function ComunicacionesPage() {
  const [cuil, setCuil] = useState("");
  const [direccion, setDireccion] = useState("por-empleados");
  const [query, setQuery] = useState({ cuil: "", enviadasAEmpleados: "false" });

  const params = new URLSearchParams();
  if (query.cuil) params.set("cuil", query.cuil);
  params.set("enviadasAEmpleados", query.enviadasAEmpleados);
  const qs = params.toString();

  const { data, loading, error } = useApiGet<Comunicacion[]>(`/api/comunicaciones?${qs}`, [qs]);

  return (
    <div>
      <PageHeader
        title="Comunicaciones"
        description="PDFs enviados entre la organización y los empleados."
        action={<LinkButton href="/comunicaciones/enviar">Enviar comunicación</LinkButton>}
      />

      <form
        className="mb-4 flex flex-wrap gap-2"
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

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState message="No se encontraron comunicaciones." />
      )}

      {!loading && !error && (data?.length ?? 0) > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Asunto</th>
                <th className="px-4 py-3">Empleado</th>
                <th className="px-4 py-3">Fecha de envío</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data!.map((com) => (
                <tr key={com.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/comunicaciones/${com.id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {com.asunto}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{com.empleado ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{com.fechaDeEnvio ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={com.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
