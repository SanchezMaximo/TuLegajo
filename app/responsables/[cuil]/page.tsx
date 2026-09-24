"use client";

import { use, useState } from "react";
import { useApiGet, apiRequest } from "@/lib/useApi";
import { Card, PageHeader, Field, TextInput, Button, Spinner } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";
import type { Responsable } from "@/lib/types";

export default function ResponsableDetailPage({
  params,
}: {
  params: Promise<{ cuil: string }>;
}) {
  const { cuil } = use(params);
  const encodedCuil = encodeURIComponent(cuil);
  const { data: roles, loading, error, refetch } = useApiGet<Responsable[]>(
    `/api/responsables/${encodedCuil}`
  );

  const [nuevoRol, setNuevoRol] = useState("");
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState("");
  const [asignando, setAsignando] = useState(false);
  const [asignarError, setAsignarError] = useState<string | null>(null);

  const [removiendoRol, setRemoviendoRol] = useState<string | null>(null);
  const [removerError, setRemoverError] = useState<string | null>(null);

  async function handleAsignar(e: React.FormEvent) {
    e.preventDefault();
    setAsignando(true);
    setAsignarError(null);
    try {
      await apiRequest(`/api/asignar-rol/${encodedCuil}`, {
        method: "POST",
        body: { rol: nuevoRol, sobreEtiquetas: nuevaEtiqueta || undefined },
      });
      setNuevoRol("");
      setNuevaEtiqueta("");
      refetch();
    } catch (err) {
      setAsignarError(err instanceof Error ? err.message : "No se pudo asignar el rol.");
    } finally {
      setAsignando(false);
    }
  }

  async function handleRemover(rol: string) {
    setRemoviendoRol(rol);
    setRemoverError(null);
    try {
      await apiRequest(`/api/remover-rol/${encodedCuil}`, { method: "POST", body: { rol } });
      refetch();
    } catch (err) {
      setRemoverError(err instanceof Error ? err.message : "No se pudo remover el rol.");
    } finally {
      setRemoviendoRol(null);
    }
  }

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!roles || roles.length === 0) return <ErrorAlert message="Responsable no encontrado." />;

  const persona = roles[0];

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title={`${persona.nombre} ${persona.apellido}`}
        description={`CUIL ${persona.cuil}${persona.correoElectronico ? ` · ${persona.correoElectronico}` : ""}`}
      />

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Roles asignados
        </h2>
        {removerError && (
          <div className="mb-3">
            <ErrorAlert message={removerError} />
          </div>
        )}
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {roles.map((r, idx) => (
            <div key={idx} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{r.rol}</p>
                {r.sobreEtiquetas && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sobre etiquetas: {r.sobreEtiquetas}
                  </p>
                )}
              </div>
              <Button
                variant="danger"
                disabled={roles.length === 1 || removiendoRol === r.rol}
                onClick={() => handleRemover(r.rol)}
              >
                {removiendoRol === r.rol ? "Quitando..." : "Quitar"}
              </Button>
            </div>
          ))}
        </div>
        {roles.length === 1 && (
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            No se puede quitar el único rol de un responsable.
          </p>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Asignar nuevo rol
        </h2>
        <form onSubmit={handleAsignar} className="flex flex-wrap items-end gap-3">
          <Field label="Rol" htmlFor="nuevoRol" required>
            <TextInput
              id="nuevoRol"
              required
              value={nuevoRol}
              onChange={(e) => setNuevoRol(e.target.value)}
              className="w-56"
            />
          </Field>
          <Field label="Sobre etiquetas" htmlFor="nuevaEtiqueta">
            <TextInput
              id="nuevaEtiqueta"
              value={nuevaEtiqueta}
              onChange={(e) => setNuevaEtiqueta(e.target.value)}
              className="w-56"
            />
          </Field>
          <Button type="submit" variant="secondary" disabled={asignando}>
            {asignando ? "Asignando..." : "Asignar rol"}
          </Button>
        </form>
        {asignarError && (
          <div className="mt-3">
            <ErrorAlert message={asignarError} />
          </div>
        )}
      </Card>
    </div>
  );
}
