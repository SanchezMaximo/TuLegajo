"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/useApi";
import { Card, PageHeader, Field, TextInput, Button } from "@/components/ui";
import { ErrorAlert, SuccessAlert } from "@/components/Alert";

function ImportConsumoForm() {
  const [form, setForm] = useState({
    cuil: "",
    motivo: "",
    diasConsumidos: "",
    fechaDeAprobacion: "",
    fechaDeInicio: "",
    fechaDeFin: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await apiRequest("/api/licencias/importar/consumo", {
        method: "POST",
        body: { ...form, diasConsumidos: Number(form.diasConsumidos) },
      });
      setSuccess("Consumo importado correctamente.");
      setForm({ cuil: "", motivo: "", diasConsumidos: "", fechaDeAprobacion: "", fechaDeInicio: "", fechaDeFin: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo importar el consumo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Importar consumo de días
      </h2>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Registra días consumidos por un empleado sobre un motivo de licencia.
      </p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="CUIL del empleado" htmlFor="c-cuil" required>
          <TextInput id="c-cuil" required value={form.cuil} onChange={(e) => update("cuil", e.target.value)} />
        </Field>
        <Field label="Motivo (nombre o código)" htmlFor="c-motivo" required>
          <TextInput id="c-motivo" required value={form.motivo} onChange={(e) => update("motivo", e.target.value)} />
        </Field>
        <Field label="Días consumidos" htmlFor="c-dias" required>
          <TextInput
            id="c-dias"
            type="number"
            min={0}
            required
            value={form.diasConsumidos}
            onChange={(e) => update("diasConsumidos", e.target.value)}
          />
        </Field>
        <Field label="Fecha de aprobación" htmlFor="c-aprobacion" required hint="DD/MM/AAAA">
          <TextInput
            id="c-aprobacion"
            required
            placeholder="01/03/2026"
            value={form.fechaDeAprobacion}
            onChange={(e) => update("fechaDeAprobacion", e.target.value)}
          />
        </Field>
        <Field label="Fecha de inicio" htmlFor="c-inicio" required hint="DD/MM/AAAA">
          <TextInput
            id="c-inicio"
            required
            placeholder="01/03/2026"
            value={form.fechaDeInicio}
            onChange={(e) => update("fechaDeInicio", e.target.value)}
          />
        </Field>
        <Field label="Fecha de fin" htmlFor="c-fin" required hint="DD/MM/AAAA">
          <TextInput
            id="c-fin"
            required
            placeholder="05/03/2026"
            value={form.fechaDeFin}
            onChange={(e) => update("fechaDeFin", e.target.value)}
          />
        </Field>

        {error && (
          <div className="sm:col-span-2">
            <ErrorAlert message={error} />
          </div>
        )}
        {success && (
          <div className="sm:col-span-2">
            <SuccessAlert message={success} />
          </div>
        )}

        <div className="sm:col-span-2 flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Importando..." : "Importar consumo"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function ImportPeriodoForm() {
  const [form, setForm] = useState({
    cuil: "",
    motivo: "",
    año: "",
    diasOtorgados: "",
    fechaDeVencimiento: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await apiRequest("/api/licencias/importar/periodo", {
        method: "POST",
        body: { ...form, diasOtorgados: Number(form.diasOtorgados) },
      });
      setSuccess("Periodo importado correctamente.");
      setForm({ cuil: "", motivo: "", año: "", diasOtorgados: "", fechaDeVencimiento: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo importar el periodo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Importar días otorgados por periodo
      </h2>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Otorga una cantidad de días sobre un motivo de licencia a un empleado en un periodo.
      </p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="CUIL del empleado" htmlFor="p-cuil" required>
          <TextInput id="p-cuil" required value={form.cuil} onChange={(e) => update("cuil", e.target.value)} />
        </Field>
        <Field label="Motivo (nombre o código)" htmlFor="p-motivo" required>
          <TextInput id="p-motivo" required value={form.motivo} onChange={(e) => update("motivo", e.target.value)} />
        </Field>
        <Field label="Año" htmlFor="p-anio" required>
          <TextInput id="p-anio" required placeholder="2026" value={form.año} onChange={(e) => update("año", e.target.value)} />
        </Field>
        <Field label="Días otorgados" htmlFor="p-dias" required>
          <TextInput
            id="p-dias"
            type="number"
            min={0}
            required
            value={form.diasOtorgados}
            onChange={(e) => update("diasOtorgados", e.target.value)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Fecha de vencimiento" htmlFor="p-vencimiento" required hint="DD/MM/AAAA">
            <TextInput
              id="p-vencimiento"
              required
              placeholder="31/12/2026"
              value={form.fechaDeVencimiento}
              onChange={(e) => update("fechaDeVencimiento", e.target.value)}
            />
          </Field>
        </div>

        {error && (
          <div className="sm:col-span-2">
            <ErrorAlert message={error} />
          </div>
        )}
        {success && (
          <div className="sm:col-span-2">
            <SuccessAlert message={success} />
          </div>
        )}

        <div className="sm:col-span-2 flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Importando..." : "Importar periodo"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default function ImportarLicenciasPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Importar licencias"
        description="Cargar consumos u otorgamientos de días de licencia desde un sistema externo."
      />
      <ImportConsumoForm />
      <ImportPeriodoForm />
    </div>
  );
}
