"use client";

import { useCallback, useRef, useState } from "react";

export interface VacacionesResultado {
  status: "loading" | "done" | "error";
  liquidada?: boolean;
  lineas?: string[];
  error?: string;
}

const CONCURRENCIA = 3;

export function useVacacionesCheck() {
  const [resultados, setResultados] = useState<Record<number, VacacionesResultado>>({});
  const [progreso, setProgreso] = useState<{ hecho: number; total: number } | null>(null);
  const cancelRef = useRef(false);

  const checkOne = useCallback(async (id: number) => {
    setResultados((prev) => ({ ...prev, [id]: { status: "loading" } }));
    try {
      const res = await fetch(`/api/documentos/${id}/vacaciones`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "No se pudo verificar el recibo.");
      setResultados((prev) => ({
        ...prev,
        [id]: { status: "done", liquidada: json.liquidada, lineas: json.lineas },
      }));
    } catch (err) {
      setResultados((prev) => ({
        ...prev,
        [id]: { status: "error", error: err instanceof Error ? err.message : "Error desconocido." },
      }));
    }
  }, []);

  const checkMany = useCallback(
    async (ids: number[]) => {
      cancelRef.current = false;
      setProgreso({ hecho: 0, total: ids.length });
      let index = 0;
      let hecho = 0;

      async function worker() {
        while (index < ids.length) {
          if (cancelRef.current) return;
          const id = ids[index++];
          await checkOne(id);
          hecho++;
          setProgreso({ hecho, total: ids.length });
        }
      }

      await Promise.all(
        Array.from({ length: Math.min(CONCURRENCIA, ids.length) }, () => worker())
      );
      setProgreso(null);
    },
    [checkOne]
  );

  const cancel = useCallback(() => {
    cancelRef.current = true;
    setProgreso(null);
  }, []);

  return { resultados, progreso, checkOne, checkMany, cancel };
}
