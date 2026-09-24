"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApiGet, apiRequest } from "@/lib/useApi";
import { Card, PageHeader, Field, TextInput, Select, Button } from "@/components/ui";
import { ErrorAlert, SuccessAlert } from "@/components/Alert";
import type { TipoDocumento } from "@/lib/types";

export default function CargarRapidoPage() {
  const router = useRouter();
  const { data: tipos } = useApiGet<TipoDocumento[]>("/api/documentos/tipos");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nombre, setNombre] = useState("");
  const [tipoDocumentoId, setTipoDocumentoId] = useState("");
  const [nombreLote, setNombreLote] = useState("");
  const [periodoLote, setPeriodoLote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Seleccioná un archivo PDF o ZIP.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.set("archivo", file);
      formData.set("nombre", nombre);
      formData.set("nombreLote", nombreLote);
      formData.set("periodoLote", periodoLote);
      if (tipoDocumentoId) formData.set("tipoDocumentoId", tipoDocumentoId);

      await apiRequest("/api/lotes/cargar-documentos", { formData });
      setSuccess(
        `Carga solicitada al lote "${nombreLote}" (${periodoLote}). Si no existía, se creó automáticamente.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el archivo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Carga rápida de documentos"
        description="Subí un archivo referenciando el lote por nombre y periodo, sin tener que crearlo antes. Si no existe, se crea automáticamente."
      />
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Nombre del lote" htmlFor="nombreLote" required>
            <TextInput
              id="nombreLote"
              required
              value={nombreLote}
              onChange={(e) => setNombreLote(e.target.value)}
            />
          </Field>
          <Field label="Periodo del lote" htmlFor="periodoLote" required hint="Formato MM-YYYY">
            <TextInput
              id="periodoLote"
              required
              placeholder="03-2026"
              value={periodoLote}
              onChange={(e) => setPeriodoLote(e.target.value)}
            />
          </Field>
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
              className="text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
            />
          </Field>
          <Field
            label="Nombre agrupador"
            htmlFor="nombre"
            required
            hint="Este nombre será visible para los empleados."
          >
            <TextInput id="nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
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

          {error && <ErrorAlert message={error} />}
          {success && <SuccessAlert message={success} />}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => router.push("/lotes")}>
              Ver lotes
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Cargando..." : "Cargar archivo"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
