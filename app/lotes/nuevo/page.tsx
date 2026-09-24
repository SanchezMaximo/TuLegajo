"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/useApi";
import { Card, PageHeader, Field, TextInput, Button } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";

export default function NuevoLotePage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [comentario, setComentario] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const created = await apiRequest<{ result?: { id: number } }>("/api/lotes", {
        method: "POST",
        body: { nombre, periodo, comentario: comentario || undefined },
      });
      if (created.result?.id) {
        router.push(`/lotes/${created.result.id}`);
      } else {
        router.push("/lotes");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el lote.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <PageHeader title="Nuevo lote de documentos" description="El lote se crea con estado Nuevo." />
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Nombre" htmlFor="nombre" required>
            <TextInput
              id="nombre"
              required
              maxLength={250}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Field>
          <Field label="Periodo" htmlFor="periodo" required hint="Formato MM-YYYY">
            <TextInput
              id="periodo"
              required
              placeholder="03-2026"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
            />
          </Field>
          <Field label="Comentario" htmlFor="comentario">
            <TextInput
              id="comentario"
              maxLength={500}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </Field>

          {error && <ErrorAlert message={error} />}

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creando..." : "Crear lote"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
