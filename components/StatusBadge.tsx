import { statusStyle } from "@/lib/format";

export default function StatusBadge({ status }: { status?: string }) {
  if (!status) return <span className="text-slate-400 dark:text-slate-500">—</span>;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
}
