"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/useApi";
import { fileToBase64 } from "@/lib/file";
import { Card, PageHeader, Field, TextInput, Select, Button } from "@/components/ui";
import { ErrorAlert } from "@/components/Alert";

export default function EnviarComunicacionPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [asunto, setAsunto] = useState("");
  const [cuilEmisor, setCuilEmisor] = useState("");
  const [modo, setModo] = useState<"todos" | "seleccionados">("todos");
  const [cuilDestinatarios, setCuilDestinatarios] = useState("");
  const [etiquetasDestinatarios, setEtiquetasDestinatarios] = useState("");
  const [firmaPosX, setFirmaPosX] = useState("50");
  const [firmaPosY, setFirmaPosY] = useState("50");
  const [firmaAncho, setFirmaAncho] = useState("300");
  const [firmaAlto, setFirmaAlto] = useState("150");
  const [paginaFirma, setPaginaFirma] = useState("1");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function splitList(value: string): string[] {
    return value
      .split(/[;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Seleccioná el archivo PDF a enviar.");
      return;
    }
    if (modo === "seleccionados" && !cuilDestinatarios.trim() && !etiquetasDestinatarios.trim()) {
      setError("Indicá al menos un CUIL o una etiqueta de destinatarios.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const archivo = await fileToBase64(file);
      const body: Record<string, unknown> = {
        asunto,
        cuilEmisor,
        aTodos: modo === "todos",
        archivo,
        firmaPosX: Number(firmaPosX),
        firmaPosY: Number(firmaPosY),
        firmaAncho: Number(firmaAncho),
        firmaAlto: Number(firmaAlto),
        paginaFirma: Number(paginaFirma),
      };
      if (modo === "seleccionados") {
        const cuils = splitList(cuilDestinatarios);
        const etiquetas = splitList(etiquetasDestinatarios);
        if (cuils.length) body.cuilDestinatarios = cuils;
        if (etiquetas.length) body.etiquetasDestinatarios = etiquetas;
      }

      await apiRequest("/api/comunicaciones/enviar", { method: "POST", body });
      router.push("/comunicaciones");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar la comunicación.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Enviar comunicación"
        description="Envía un PDF a uno o varios empleados para que lo acepten. No lleva firma de responsable."
      />
      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Asunto" htmlFor="asunto" required>
            <TextInput id="asunto" required value={asunto} onChange={(e) => setAsunto(e.target.value)} />
          </Field>
          <Field label="CUIL del emisor (responsable)" htmlFor="cuilEmisor" required>
            <TextInput
              id="cuilEmisor"
              required
              value={cuilEmisor}
              onChange={(e) => setCuilEmisor(e.target.value)}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Destinatarios" htmlFor="modo" required>
              <Select
                id="modo"
                value={modo}
                onChange={(e) => setModo(e.target.value as "todos" | "seleccionados")}
              >
                <option value="todos">Todos los empleados activos</option>
                <option value="seleccionados">Seleccionados (por CUIL y/o etiqueta)</option>
              </Select>
            </Field>
          </div>

          {modo === "seleccionados" && (
            <>
              <Field
                label="CUILs destinatarios"
                htmlFor="cuilDestinatarios"
                hint="Uno por línea o separados por ;"
              >
                <textarea
                  id="cuilDestinatarios"
                  value={cuilDestinatarios}
                  onChange={(e) => setCuilDestinatarios(e.target.value)}
                  rows={3}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-400 dark:focus:ring-slate-400"
                />
              </Field>
              <Field
                label="Etiquetas destinatarias"
                htmlFor="etiquetasDestinatarios"
                hint="Separadas por ;"
              >
                <textarea
                  id="etiquetasDestinatarios"
                  value={etiquetasDestinatarios}
                  onChange={(e) => setEtiquetasDestinatarios(e.target.value)}
                  rows={3}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-400 dark:focus:ring-slate-400"
                />
              </Field>
            </>
          )}

          <div className="sm:col-span-2">
            <Field label="Archivo PDF" htmlFor="archivo" required>
              <input
                id="archivo"
                type="file"
                ref={fileInputRef}
                accept=".pdf"
                required
                className="text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700 dark:text-slate-300 dark:file:bg-slate-100 dark:file:text-slate-900 dark:hover:file:bg-slate-300"
              />
            </Field>
          </div>

          <div className="sm:col-span-2 rounded-md bg-slate-50 p-4 dark:bg-slate-900/40">
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Ubicación de la imagen de firma
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <Field label="Página" htmlFor="paginaFirma" required>
                <TextInput
                  id="paginaFirma"
                  type="number"
                  min={1}
                  required
                  value={paginaFirma}
                  onChange={(e) => setPaginaFirma(e.target.value)}
                />
              </Field>
              <Field label="Pos. X" htmlFor="firmaPosX" required>
                <TextInput
                  id="firmaPosX"
                  type="number"
                  required
                  value={firmaPosX}
                  onChange={(e) => setFirmaPosX(e.target.value)}
                />
              </Field>
              <Field label="Pos. Y" htmlFor="firmaPosY" required>
                <TextInput
                  id="firmaPosY"
                  type="number"
                  required
                  value={firmaPosY}
                  onChange={(e) => setFirmaPosY(e.target.value)}
                />
              </Field>
              <Field label="Ancho" htmlFor="firmaAncho" required>
                <TextInput
                  id="firmaAncho"
                  type="number"
                  required
                  value={firmaAncho}
                  onChange={(e) => setFirmaAncho(e.target.value)}
                />
              </Field>
              <Field label="Alto" htmlFor="firmaAlto" required>
                <TextInput
                  id="firmaAlto"
                  type="number"
                  required
                  value={firmaAlto}
                  onChange={(e) => setFirmaAlto(e.target.value)}
                />
              </Field>
            </div>
          </div>

          {error && (
            <div className="sm:col-span-2">
              <ErrorAlert message={error} />
            </div>
          )}

          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar comunicación"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
