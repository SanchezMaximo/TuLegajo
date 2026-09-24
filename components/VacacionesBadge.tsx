import type { VacacionesResultado } from "@/lib/useVacacionesCheck";

export default function VacacionesBadge({
  resultado,
  onVerificar,
}: {
  resultado?: VacacionesResultado;
  onVerificar: () => void;
}) {
  if (!resultado) {
    return (
      <button
        type="button"
        onClick={onVerificar}
        className="text-xs font-medium text-slate-500 underline hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      >
        Verificar
      </button>
    );
  }

  if (resultado.status === "loading") {
    return <span className="text-xs text-slate-400 dark:text-slate-500">Verificando…</span>;
  }

  if (resultado.status === "error") {
    return (
      <span
        title={resultado.error}
        className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-300 dark:bg-slate-700/40 dark:text-slate-400 dark:ring-slate-600"
      >
        Error
      </span>
    );
  }

  if (resultado.liquidada) {
    return (
      <span
        title={resultado.lineas?.join(" · ")}
        className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-500/30"
      >
        Liquidada
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-300 dark:bg-slate-700/40 dark:text-slate-300 dark:ring-slate-600">
      No liquidada
    </span>
  );
}
