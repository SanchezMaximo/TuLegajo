const STATUS_STYLES: Record<string, string> = {
  Nuevo: "bg-slate-100 text-slate-700 ring-slate-600/20",
  Pendiente: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Generado: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Activo: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Aprobada: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Conforme: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Cargado: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Validado: "bg-sky-50 text-sky-700 ring-sky-600/20",
  Firmado: "bg-violet-50 text-violet-700 ring-violet-600/20",
  Enviado: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  Desvinculado: "bg-rose-50 text-rose-700 ring-rose-600/20",
  Rechazada: "bg-rose-50 text-rose-700 ring-rose-600/20",
  Cancelada: "bg-rose-50 text-rose-700 ring-rose-600/20",
  "No Conforme": "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export function statusStyle(status: string | undefined): string {
  if (!status) return "bg-slate-100 text-slate-700 ring-slate-600/20";
  return STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700 ring-slate-600/20";
}
