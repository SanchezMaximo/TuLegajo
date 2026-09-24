"use client";

import { use, useState } from "react";
import { useApiGet, apiRequest } from "@/lib/useApi";
import { Card, PageHeader, Field, TextInput, Button, Spinner } from "@/components/ui";
import { ErrorAlert, SuccessAlert } from "@/components/Alert";
import StatusBadge from "@/components/StatusBadge";
import type { Comunicacion } from "@/lib/types";

export default function ComunicacionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: com, loading, error, refetch } = useApiGet<Comunicacion>(`/api/comunicaciones/${id}`);

  const [pinFirma, setPinFirma] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [firmError, setFirmError] = useState<string | null>(null);
  const [firmSuccess, setFirmSuccess] = useState<string | null>(null);

  async function handleFirmar(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFirmError(null);
    setFirmSuccess(null);
    try {
      await apiRequest(`/api/comunicaciones/${id}/firmar`, { method: "POST", body: { pinFirma } });
      setFirmSuccess(
        "Firma solicitada. El proceso es asincrónico, actualizá para ver el estado final."
      );
      refetch();
    } catch (err) {
      setFirmError(err instanceof Error ? err.message : "No se pudo firmar la comunicación.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!com) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title={com.asunto}
        description={`${com.empleado ?? com.cuil ?? ""} · Enviada ${com.fechaDeEnvio ?? "—"}`}
        action={<StatusBadge status={com.estado} />}
      />

      {com.firmaEnProgreso && (
        <SuccessAlert message="El proceso de firma está en progreso. Actualizá la página en unos instantes." />
      )}

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Documento
        </h2>
        {com.uri ? (
          <a
            href={`${com.uri}${com.uri.includes("?") ? "&" : "?"}cuil=${encodeURIComponent(com.cuil ?? "")}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-700 underline hover:text-slate-900"
          >
            Descargar PDF
          </a>
        ) : (
          <p className="text-sm text-slate-400">Sin archivo disponible.</p>
        )}
      </Card>

      {com.estado === "Pendiente" && (
        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Firmar comunicación
          </h2>
          <form onSubmit={handleFirmar} className="flex flex-col gap-4">
            <Field label="Pin de firma del empleado" htmlFor="pinFirma" required>
              <TextInput
                id="pinFirma"
                type="password"
                required
                value={pinFirma}
                onChange={(e) => setPinFirma(e.target.value)}
                className="max-w-xs"
              />
            </Field>

            {firmError && <ErrorAlert message={firmError} />}
            {firmSuccess && <SuccessAlert message={firmSuccess} />}

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Firmando..." : "Firmar"}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
