const STATUS_STYLES: Record<string, string> = {
  Nuevo: "bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-700/40 dark:text-slate-300 dark:ring-slate-500/30",
  Pendiente:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-500/30",
  Generado: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-500/30",
  Activo:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-500/30",
  Aprobada:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-500/30",
  Conforme:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-500/30",
  Cargado: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-500/30",
  Validado: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-500/30",
  Firmado:
    "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-900/30 dark:text-violet-300 dark:ring-violet-500/30",
  Enviado:
    "bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-500/30",
  Desvinculado:
    "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-900/30 dark:text-rose-300 dark:ring-rose-500/30",
  Rechazada:
    "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-900/30 dark:text-rose-300 dark:ring-rose-500/30",
  Cancelada:
    "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-900/30 dark:text-rose-300 dark:ring-rose-500/30",
  "No Conforme":
    "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-900/30 dark:text-rose-300 dark:ring-rose-500/30",
};

const DEFAULT_STATUS_STYLE =
  "bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-700/40 dark:text-slate-300 dark:ring-slate-500/30";

export function statusStyle(status: string | undefined): string {
  if (!status) return DEFAULT_STATUS_STYLE;
  return STATUS_STYLES[status] ?? DEFAULT_STATUS_STYLE;
}
