"use client";

import { use, useEffect, useState } from "react";
import { useApiGet, apiRequest } from "@/lib/useApi";
import {
  Card,
  PageHeader,
  Field,
  TextInput,
  Select,
  Button,
  LinkButton,
  Spinner,
} from "@/components/ui";
import { ErrorAlert, SuccessAlert } from "@/components/Alert";
import StatusBadge from "@/components/StatusBadge";
import type { Empleado, Etiqueta, Sede } from "@/lib/types";

export default function EmpleadoDetailPage({
  params,
}: {
  params: Promise<{ cuil: string }>;
}) {
  const { cuil } = use(params);
  const encodedCuil = encodeURIComponent(cuil);

  const {
    data: empleado,
    loading,
    error,
    refetch,
  } = useApiGet<Empleado>(`/api/empleados/${encodedCuil}`);
  const { data: sedes } = useApiGet<Sede[]>("/api/sedes");
  const { data: etiquetasAsignadas, refetch: refetchEtiquetas } = useApiGet<Etiqueta[]>(
    `/api/etiquetas/empleados/${encodedCuil}`
  );
  const { data: catalogoEtiquetas } = useApiGet<Etiqueta[]>("/api/etiquetas/empleados");

  const [form, setForm] = useState<Partial<Empleado>>({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  const [etiquetasInput, setEtiquetasInput] = useState("");
  const [savingTags, setSavingTags] = useState(false);
  const [tagsError, setTagsError] = useState<string | null>(null);

  const [lifecycleBusy, setLifecycleBusy] = useState(false);
  const [lifecycleError, setLifecycleError] = useState<string | null>(null);

  useEffect(() => {
    if (empleado) {
      setForm(empleado);
    }
  }, [empleado]);

  useEffect(() => {
    if (etiquetasAsignadas) {
      setEtiquetasInput(etiquetasAsignadas.map((e) => e.nombre).join(";"));
    }
  }, [etiquetasAsignadas]);

  function update<K extends keyof Empleado>(key: K, value: Empleado[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSavingEdit(true);
    setEditError(null);
    setEditSuccess(null);
    try {
      await apiRequest(`/api/empleados/${encodedCuil}`, {
        method: "PUT",
        body: {
          nombre: form.nombre,
          apellido: form.apellido,
          sedeCodigo: form.sedeCodigo,
          legajo: form.legajo,
          emailCorporativo: form.emailCorporativo,
          fechaDeIngreso: form.fechaDeIngreso,
          celularLaboralCodigoPais: form.celularLaboralCodigoPais,
          celularLaboral: form.celularLaboral,
          sexo: form.sexo,
          informacionExtra: form.informacionExtra,
        },
      });
      setEditSuccess("Empleado actualizado correctamente.");
      refetch();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "No se pudo actualizar el empleado.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleSaveTags(e: React.FormEvent) {
    e.preventDefault();
    setSavingTags(true);
    setTagsError(null);
    try {
      await apiRequest(`/api/etiquetas/empleados/${encodedCuil}`, {
        method: "PUT",
        body: { etiquetas: etiquetasInput },
      });
      refetchEtiquetas();
    } catch (err) {
      setTagsError(err instanceof Error ? err.message : "No se pudieron actualizar las etiquetas.");
    } finally {
      setSavingTags(false);
    }
  }

  async function handleLifecycle(action: "desvincular" | "revincular") {
    setLifecycleBusy(true);
    setLifecycleError(null);
    try {
      await apiRequest(`/api/empleados/${encodedCuil}/${action}`, { method: "POST", body: {} });
      refetch();
    } catch (err) {
      setLifecycleError(
        err instanceof Error ? err.message : `No se pudo ${action} al empleado.`
      );
    } finally {
      setLifecycleBusy(false);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!empleado) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title={`${empleado.nombre} ${empleado.apellido}`}
        description={`CUIL ${empleado.cuil} · Legajo ${empleado.legajo}`}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={empleado.estado} />
            <LinkButton href={`/empleados/${encodedCuil}/vacaciones`} variant="secondary">
              Vacaciones
            </LinkButton>
            {empleado.estado === "Desvinculado" ? (
              <Button
                variant="secondary"
                disabled={lifecycleBusy}
                onClick={() => handleLifecycle("revincular")}
              >
                Revincular
              </Button>
            ) : (
              <Button
                variant="danger"
                disabled={lifecycleBusy}
                onClick={() => handleLifecycle("desvincular")}
              >
                Desvincular
              </Button>
            )}
          </div>
        }
      />

      {lifecycleError && <ErrorAlert message={lifecycleError} />}

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Datos del empleado
        </h2>
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="nombre">
            <TextInput
              id="nombre"
              value={form.nombre ?? ""}
              onChange={(e) => update("nombre", e.target.value)}
            />
          </Field>
          <Field label="Apellido" htmlFor="apellido">
            <TextInput
              id="apellido"
              value={form.apellido ?? ""}
              onChange={(e) => update("apellido", e.target.value)}
            />
          </Field>
          <Field label="Sede" htmlFor="sedeCodigo">
            <Select
              id="sedeCodigo"
              value={form.sedeCodigo ?? ""}
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
          <Field label="Legajo" htmlFor="legajo">
            <TextInput
              id="legajo"
              value={form.legajo ?? ""}
              onChange={(e) => update("legajo", e.target.value)}
            />
          </Field>
          <Field label="Email corporativo" htmlFor="emailCorporativo">
            <TextInput
              id="emailCorporativo"
              type="email"
              value={form.emailCorporativo ?? ""}
              onChange={(e) => update("emailCorporativo", e.target.value)}
            />
          </Field>
          <Field label="Fecha de ingreso" htmlFor="fechaDeIngreso" hint="DD/MM/YYYY">
            <TextInput
              id="fechaDeIngreso"
              value={form.fechaDeIngreso ?? ""}
              onChange={(e) => update("fechaDeIngreso", e.target.value)}
            />
          </Field>
          <Field label="Sexo" htmlFor="sexo">
            <Select
              id="sexo"
              value={form.sexo ?? ""}
              onChange={(e) => update("sexo", e.target.value as Empleado["sexo"])}
            >
              <option value="">Sin especificar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Información extra" htmlFor="informacionExtra">
              <TextInput
                id="informacionExtra"
                value={form.informacionExtra ?? ""}
                onChange={(e) => update("informacionExtra", e.target.value)}
              />
            </Field>
          </div>

          {editError && (
            <div className="sm:col-span-2">
              <ErrorAlert message={editError} />
            </div>
          )}
          {editSuccess && (
            <div className="sm:col-span-2">
              <SuccessAlert message={editSuccess} />
            </div>
          )}

          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={savingEdit}>
              {savingEdit ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Etiquetas
        </h2>
        <form onSubmit={handleSaveTags} className="flex flex-wrap items-end gap-3">
          <Field
            label="Etiquetas del empleado"
            htmlFor="etiquetas"
            hint="Separadas por punto y coma (;). Reemplazan todas las etiquetas actuales."
          >
            <TextInput
              id="etiquetas"
              value={etiquetasInput}
              onChange={(e) => setEtiquetasInput(e.target.value)}
              className="w-80"
            />
          </Field>
          <Button type="submit" variant="secondary" disabled={savingTags}>
            {savingTags ? "Guardando..." : "Actualizar etiquetas"}
          </Button>
        </form>
        {tagsError && <div className="mt-3"><ErrorAlert message={tagsError} /></div>}

        {(catalogoEtiquetas?.length ?? 0) > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              Catálogo de etiquetas de la organización (click para agregar):
            </p>
            <div className="flex flex-wrap gap-2">
              {catalogoEtiquetas!.map((et) => {
                const actuales = etiquetasInput
                  .split(";")
                  .map((s) => s.trim())
                  .filter(Boolean);
                const yaAsignada = actuales.includes(et.nombre);
                return (
                  <button
                    key={et.nombre}
                    type="button"
                    disabled={yaAsignada}
                    onClick={() => setEtiquetasInput([...actuales, et.nombre].join(";"))}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors ${
                      yaAsignada
                        ? "cursor-default bg-slate-100 text-slate-400 ring-slate-200 dark:bg-slate-700/40 dark:text-slate-500 dark:ring-slate-600"
                        : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600 dark:hover:bg-slate-700"
                    }`}
                  >
                    {et.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
