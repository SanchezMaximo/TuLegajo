"use client";

import { useState } from "react";
import Link from "next/link";
import { useApiGet } from "@/lib/useApi";
import { PageHeader, LinkButton, TextInput, Select, Button, Spinner, EmptyState } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import StatusBadge from "@/components/StatusBadge";
import type { Licencia } from "@/lib/types";

export default function LicenciasPage() {
  const [cuil, setCuil] = useState("");
  const [estado, setEstado] = useState("");
  const [query, setQuery] = useState<{ cuil: string; estado: string }>({ cuil: "", estado: "" });

  const params = new URLSearchParams();
  if (query.cuil) params.set("cuil", query.cuil);
  if (query.estado) params.set("estado", query.estado);
  const qs = params.toString();

  const { data, loading, error } = useApiGet<Licencia[]>(
    `/api/licencias${qs ? `?${qs}` : ""}`,
    [qs]
  );

  return (
    <div>
      <PageHeader
        title="Licencias"
        description="Solicitudes de ausencias de los empleados."
        action={
          <div className="flex gap-2">
            <LinkButton href="/licencias/motivos" variant="secondary">
              Motivos
            </LinkButton>
            <LinkButton href="/licencias/importar">Importar</LinkButton>
          </div>
        }
      />

      <form
        className="mb-4 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery({ cuil: cuil.trim(), estado });
        }}
      >
        <TextInput
          placeholder="Filtrar por CUIL..."
          value={cuil}
          onChange={(e) => setCuil(e.target.value)}
          className="w-full max-w-xs"
        />
        <Select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-48">
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Aprobada">Aprobada</option>
          <option value="Rechazada">Rechazada</option>
          <option value="Cancelada">Cancelada</option>
        </Select>
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>

      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState message="No se encontraron solicitudes de licencia." />
      )}

      {!loading && !error && (data?.length ?? 0) > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Empleado</th>
                <th className="px-4 py-3">Motivo</th>
                <th className="px-4 py-3">Desde</th>
                <th className="px-4 py-3">Hasta</th>
                <th className="px-4 py-3">Días</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data!.map((lic) => (
                <tr key={lic.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/licencias/${lic.id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {lic.nombre} {lic.apellido}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{lic.nombreMotivo ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{lic.fechaDeInicio ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{lic.fechaDeFin ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{lic.diasSolicitados ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lic.estadoLicencia} />
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
