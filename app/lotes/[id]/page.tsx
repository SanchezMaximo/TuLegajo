"use client";

import { use, useRef, useState } from "react";
import { useApiGet, apiRequest } from "@/lib/useApi";
import {
  Card,
  PageHeader,
  Field,
  TextInput,
  Select,
  Button,
  Spinner,
} from "@/components/ui";
import { ErrorAlert, SuccessAlert } from "@/components/Alert";
import StatusBadge from "@/components/StatusBadge";
import type { Lote, TipoDocumento } from "@/lib/types";

export default function LoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: lote, loading, error, refetch } = useApiGet<Lote>(`/api/lotes/${id}`);
  const { data: tipos } = useApiGet<TipoDocumento[]>("/api/documentos/tipos");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [tipoDocumentoId, setTipoDocumentoId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setUploadError("Seleccioná un archivo PDF o ZIP.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      const formData = new FormData();
      formData.set("archivo", file);
      formData.set("nombre", nombreArchivo);
      if (tipoDocumentoId) formData.set("tipoDocumentoId", tipoDocumentoId);

      await apiRequest(`/api/lotes/${id}/cargar-documentos`, { formData });
      setUploadSuccess(
        "Carga solicitada. El procesado es asincrónico, puede demorar varios minutos."
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      setNombreArchivo("");
      refetch();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "No se pudo cargar el archivo.");
    } finally {
      setUploading(false);
    }
  }

  async function handleEnviar() {
    setSending(true);
    setSendError(null);
    setSendSuccess(null);
    try {
      await apiRequest(`/api/lotes/${id}/enviar`, { method: "POST", body: {} });
      setSendSuccess("Lote enviado. Los documentos ya son visibles para los empleados.");
      refetch();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "No se pudo enviar el lote.");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!lote) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title={lote.nombre}
        description={`Periodo ${lote.periodo}${lote.comentario ? ` · ${lote.comentario}` : ""}`}
        action={<StatusBadge status={lote.estado} />}
      />

      {lote.procesando && (
        <SuccessAlert message="Este lote está procesando una operación. Actualizá en unos minutos." />
      )}

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Cargar documentos
        </h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Archivo (PDF o ZIP)"
              htmlFor="archivo"
              required
              hint="Cada página debe incluir el CUIL del empleado correspondiente."
            >
              <input
                id="archivo"
                type="file"
                ref={fileInputRef}
                accept=".pdf,.zip"
                required
                className="text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700 dark:text-slate-300 dark:file:bg-slate-100 dark:file:text-slate-900 dark:hover:file:bg-slate-300"
              />
            </Field>
          </div>
          <Field
            label="Nombre agrupador"
            htmlFor="nombreArchivo"
            required
            hint="Este nombre será visible para los empleados."
          >
            <TextInput
              id="nombreArchivo"
              required
              maxLength={250}
              value={nombreArchivo}
              onChange={(e) => setNombreArchivo(e.target.value)}
            />
          </Field>
          <Field label="Tipo de documento" htmlFor="tipoDocumentoId">
            <Select
              id="tipoDocumentoId"
              value={tipoDocumentoId}
              onChange={(e) => setTipoDocumentoId(e.target.value)}
            >
              <option value="">Por defecto de la empresa</option>
              {tipos?.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </Select>
          </Field>

          {uploadError && (
            <div className="sm:col-span-2">
              <ErrorAlert message={uploadError} />
            </div>
          )}
          {uploadSuccess && (
            <div className="sm:col-span-2">
              <SuccessAlert message={uploadSuccess} />
            </div>
          )}

          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={uploading}>
              {uploading ? "Cargando..." : "Cargar archivo"}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Enviar lote
        </h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Hace visibles los documentos de este lote para los empleados correspondientes.
        </p>
        {sendError && <div className="mb-3"><ErrorAlert message={sendError} /></div>}
        {sendSuccess && <div className="mb-3"><SuccessAlert message={sendSuccess} /></div>}
        <Button onClick={handleEnviar} disabled={sending} variant="secondary">
          {sending ? "Enviando..." : "Enviar lote"}
        </Button>
      </Card>
    </div>
  );
}
