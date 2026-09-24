"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/empleados", label: "Empleados" },
  { href: "/documentos", label: "Documentos" },
  { href: "/lotes", label: "Lotes" },
  { href: "/comunicaciones", label: "Comunicaciones" },
  { href: "/archivos", label: "Archivos" },
  { href: "/licencias", label: "Licencias" },
  { href: "/responsables", label: "Responsables" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-2 px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          TuLegajo <span className="font-normal text-slate-400 dark:text-slate-500">· Panel</span>
        </Link>
        <div className="flex flex-wrap items-center gap-1">
          <nav className="flex flex-wrap gap-1">
            {LINKS.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-slate-900 text-white dark:bg-slate-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
