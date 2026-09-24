"use client";

import { use } from "react";
import Link from "next/link";
import { useApiGet } from "@/lib/useApi";
import { Card, PageHeader, Spinner } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import StatusBadge from "@/components/StatusBadge";
import type { Licencia } from "@/lib/types";

function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-2 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value ?? "—"}</span>
    </div>
  );
}

export default function LicenciaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: lic, loading, error } = useApiGet<Licencia>(`/api/licencias/${id}`);

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!lic) return null;

  return (
    <div className="max-w-xl space-y-6">
      <PageHeader
        title={`${lic.nombre} ${lic.apellido}`}
        description={`Legajo ${lic.legajo ?? "—"} · CUIL ${lic.cuil}`}
        action={<StatusBadge status={lic.estadoLicencia} />}
      />
      <Card>
        <Row label="Motivo" value={lic.nombreMotivo} />
        <Row label="Código de motivo" value={lic.codigoMotivo} />
        <Row label="Días solicitados" value={lic.diasSolicitados} />
        <Row label="Fecha de solicitud" value={lic.fechaDeSolicitud} />
        <Row label="Fecha de inicio" value={lic.fechaDeInicio} />
        <Row label="Fecha de fin" value={lic.fechaDeFin} />
      </Card>
      <Link href="/licencias" className="text-sm text-slate-600 underline hover:text-slate-900">
        Volver al listado
      </Link>
    </div>
  );
}
