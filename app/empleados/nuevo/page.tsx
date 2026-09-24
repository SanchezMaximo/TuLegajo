"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApiGet, apiRequest } from "@/lib/useApi";
import { Card, PageHeader, Field, TextInput, Select, Button } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import type { Sede } from "@/lib/types";

export default function NuevoEmpleadoPage() {
  const router = useRouter();
  const { data: sedes } = useApiGet<Sede[]>("/api/sedes");

  const [form, setForm] = useState({
    cuil: "",
    nombre: "",
    apellido: "",
    sedeCodigo: "",
    legajo: "",
    emailCorporativo: "",
    fechaDeIngreso: "",
    tipoInvitacion: "EMAIL",
    sexo: "",
    etiquetas: "",
    informacionExtra: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: string) {
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
        legajo: form.legajo,
        fechaDeIngreso: form.fechaDeIngreso,
        tipoInvitacion: form.tipoInvitacion,
      };
      if (form.sedeCodigo) payload.sedeCodigo = form.sedeCodigo;
      if (form.emailCorporativo) payload.emailCorporativo = form.emailCorporativo;
      if (form.sexo) payload.sexo = form.sexo;
      if (form.etiquetas) payload.etiquetas = form.etiquetas;
      if (form.informacionExtra) payload.informacionExtra = form.informacionExtra;

      const created = await apiRequest<{ result?: { cuil: string } }>("/api/empleados", {
        method: "POST",
        body: payload,
      });
      const cuil = created.result?.cuil ?? form.cuil;
      router.push(`/empleados/${encodeURIComponent(cuil)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el empleado.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Nuevo empleado" description="El empleado se crea con estado Nuevo." />

      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="CUIL / identificador" htmlFor="cuil" required>
            <TextInput
              id="cuil"
              required
              value={form.cuil}
              onChange={(e) => update("cuil", e.target.value)}
              placeholder="20-12345678-9"
            />
          </Field>
          <Field label="Legajo" htmlFor="legajo" required>
            <TextInput
              id="legajo"
              required
              value={form.legajo}
              onChange={(e) => update("legajo", e.target.value)}
            />
          </Field>
          <Field label="Nombre" htmlFor="nombre" required>
            <TextInput
              id="nombre"
              required
              value={form.nombre}
              onChange={(e) => update("nombre", e.target.value)}
            />
          </Field>
          <Field label="Apellido" htmlFor="apellido" required>
            <TextInput
              id="apellido"
              required
              value={form.apellido}
              onChange={(e) => update("apellido", e.target.value)}
            />
          </Field>
          <Field label="Sede" htmlFor="sedeCodigo" hint="Requerido si la empresa tiene más de una sede.">
            <Select
              id="sedeCodigo"
              value={form.sedeCodigo}
              onChange={(e) => update("sedeCodigo", e.target.value)}
            >
              <option value="">Sin especificar</option>
              {sedes?.map((sede) => (
                <option key={sede.codigo} value={sede.codigo}>
                  {sede.nombre}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Fecha de ingreso" htmlFor="fechaDeIngreso" required hint="DD/MM/YYYY">
            <TextInput
              id="fechaDeIngreso"
              required
              placeholder="01/03/2026"
              value={form.fechaDeIngreso}
              onChange={(e) => update("fechaDeIngreso", e.target.value)}
            />
          </Field>
          <Field label="Email corporativo" htmlFor="emailCorporativo">
            <TextInput
              id="emailCorporativo"
              type="email"
              value={form.emailCorporativo}
              onChange={(e) => update("emailCorporativo", e.target.value)}
            />
          </Field>
          <Field label="Tipo de invitación" htmlFor="tipoInvitacion" required>
            <Select
              id="tipoInvitacion"
              required
              value={form.tipoInvitacion}
              onChange={(e) => update("tipoInvitacion", e.target.value)}
            >
              <option value="EMAIL">Email</option>
              <option value="IMPRESO">Impreso</option>
            </Select>
          </Field>
          <Field label="Sexo" htmlFor="sexo">
            <Select id="sexo" value={form.sexo} onChange={(e) => update("sexo", e.target.value)}>
              <option value="">Sin especificar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </Select>
          </Field>
          <Field
            label="Etiquetas"
            htmlFor="etiquetas"
            hint="Separadas por punto y coma (;)"
          >
            <TextInput
              id="etiquetas"
              value={form.etiquetas}
              onChange={(e) => update("etiquetas", e.target.value)}
              placeholder="Ventas;Remoto"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Información extra" htmlFor="informacionExtra">
              <TextInput
                id="informacionExtra"
                value={form.informacionExtra}
                onChange={(e) => update("informacionExtra", e.target.value)}
              />
            </Field>
          </div>

          {error && (
            <div className="sm:col-span-2">
              <ErrorAlert message={error} />
            </div>
          )}

          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creando..." : "Crear empleado"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
