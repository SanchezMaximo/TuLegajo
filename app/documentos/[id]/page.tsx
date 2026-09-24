"use client";

import { use, useState } from "react";
import { useApiGet, apiRequest } from "@/lib/useApi";
import { Card, PageHeader, Field, TextInput, Select, Button, Spinner } from "@/components/ui";
import { ErrorAlert, SuccessAlert } from "@/components/Alert";
import StatusBadge from "@/components/StatusBadge";
import type { Documento } from "@/lib/types";

const DOWNLOAD_LINKS: { key: keyof Documento; label: string }[] = [
  { key: "descargaOriginalURL", label: "Original" },
  { key: "descargaDuplicadoURL", label: "Duplicado (sin firmar)" },
  { key: "descargaOriginalFirmadoURL", label: "Original firmado" },
  { key: "descargaDuplicadoFirmadoURL", label: "Duplicado firmado" },
];

export default function DocumentoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: doc, loading, error, refetch } = useApiGet<Documento>(`/api/documentos/${id}`);

  const [pinFirma, setPinFirma] = useState("");
  const [conforme, setConforme] = useState("true");
  const [motivo, setMotivo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [firmError, setFirmError] = useState<string | null>(null);
  const [firmSuccess, setFirmSuccess] = useState<string | null>(null);

  async function handleFirmar(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFirmError(null);
    setFirmSuccess(null);
    try {
      const body: Record<string, unknown> = {
        pinFirma,
        conforme: conforme === "true",
      };
      if (conforme === "false" && motivo) body.motivo = motivo;

      await apiRequest(`/api/documentos/${id}/firmar`, { method: "POST", body });
      setFirmSuccess(
        "Firma solicitada. El proceso es asincrónico, actualizá para ver el estado final."
      );
      refetch();
    } catch (err) {
      setFirmError(err instanceof Error ? err.message : "No se pudo firmar el documento.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!doc) return null;

  const canFirmar = doc.estado === "Validado" || doc.estado === "Firmado" || doc.estado === "Enviado";

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title={doc.nombre}
        description={`CUIL ${doc.cuil}${doc.loteNombre ? ` · Lote ${doc.loteNombre}` : ""}`}
        action={<StatusBadge status={doc.estado} />}
      />

      {doc.firmaEnProgreso && (
        <SuccessAlert message="El proceso de firma está en progreso. Actualizá la página en unos instantes." />
      )}

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Descargas
        </h2>
        <ul className="space-y-2 text-sm">
          {DOWNLOAD_LINKS.filter((link) => doc[link.key]).map((link) => (
            <li key={link.key}>
              <a
                href={`${doc[link.key] as string}${
                  (doc[link.key] as string).includes("?") ? "&" : "?"
                }cuil=${encodeURIComponent(doc.cuil)}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 underline hover:text-slate-900"
              >
                {link.label}
              </a>
            </li>
          ))}
          {DOWNLOAD_LINKS.every((link) => !doc[link.key]) && (
            <li className="text-slate-400">Sin archivos disponibles todavía.</li>
          )}
        </ul>
      </Card>

      {canFirmar && (
        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Firmar documento
          </h2>
          <form onSubmit={handleFirmar} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Pin de firma del empleado" htmlFor="pinFirma" required>
              <TextInput
                id="pinFirma"
                type="password"
                required
                value={pinFirma}
                onChange={(e) => setPinFirma(e.target.value)}
              />
            </Field>
            <Field label="Resultado de la firma" htmlFor="conforme" required>
              <Select id="conforme" value={conforme} onChange={(e) => setConforme(e.target.value)}>
                <option value="true">Conforme</option>
                <option value="false">No conforme</option>
              </Select>
            </Field>
            {conforme === "false" && (
              <div className="sm:col-span-2">
                <Field label="Motivo de disconformidad" htmlFor="motivo">
                  <TextInput
                    id="motivo"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                  />
                </Field>
              </div>
            )}

            {firmError && (
              <div className="sm:col-span-2">
                <ErrorAlert message={firmError} />
              </div>
            )}
            {firmSuccess && (
              <div className="sm:col-span-2">
                <SuccessAlert message={firmSuccess} />
              </div>
            )}

            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Enviando..." : "Firmar"}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
