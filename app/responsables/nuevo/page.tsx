"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/useApi";
import { Card, PageHeader, Field, TextInput, Button } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";

export default function NuevoResponsablePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    cuil: "",
    nombre: "",
    apellido: "",
    correoElectronico: "",
    descripcion: "",
    rol: "",
    sobreEtiquetas: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, string> = {
        cuil: form.cuil,
        nombre: form.nombre,
        apellido: form.apellido,
        correoElectronico: form.correoElectronico,
        rol: form.rol,
      };
      if (form.descripcion) payload.descripcion = form.descripcion;
      if (form.sobreEtiquetas) payload.sobreEtiquetas = form.sobreEtiquetas;

      await apiRequest("/api/responsables", { method: "POST", body: payload });
      router.push(`/responsables/${encodeURIComponent(form.cuil)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo dar de alta al responsable.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <PageHeader title="Nuevo responsable" description="Da de alta un responsable con un rol inicial." />
      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="CUIL" htmlFor="cuil" required>
            <TextInput id="cuil" required value={form.cuil} onChange={(e) => update("cuil", e.target.value)} />
          </Field>
          <Field label="Rol" htmlFor="rol" required hint="Ej: Administrador de Corporación">
            <TextInput id="rol" required value={form.rol} onChange={(e) => update("rol", e.target.value)} />
          </Field>
          <Field label="Nombre" htmlFor="nombre" required>
            <TextInput id="nombre" required value={form.nombre} onChange={(e) => update("nombre", e.target.value)} />
          </Field>
          <Field label="Apellido" htmlFor="apellido" required>
            <TextInput
              id="apellido"
              required
              value={form.apellido}
              onChange={(e) => update("apellido", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Correo electrónico" htmlFor="correoElectronico" required>
              <TextInput
                id="correoElectronico"
                type="email"
                required
                value={form.correoElectronico}
                onChange={(e) => update("correoElectronico", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Descripción" htmlFor="descripcion">
            <TextInput
              id="descripcion"
              value={form.descripcion}
              onChange={(e) => update("descripcion", e.target.value)}
            />
          </Field>
          <Field
            label="Sobre etiquetas"
            htmlFor="sobreEtiquetas"
            hint="Deja el rol acotado a empleados con estas etiquetas"
          >
            <TextInput
              id="sobreEtiquetas"
              value={form.sobreEtiquetas}
              onChange={(e) => update("sobreEtiquetas", e.target.value)}
            />
          </Field>

          {error && (
            <div className="sm:col-span-2">
              <ErrorAlert message={error} />
            </div>
          )}

          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creando..." : "Crear responsable"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
