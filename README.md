# TuLegajo · Panel

Frontend interno (Next.js) que consume la API de TuLegajo.com (v2.2.0) para
gestionar Empleados, Documentos/Lotes y Licencias sin usar la interfaz web.

La API KEY nunca llega al navegador: las páginas llaman a rutas propias bajo
`/api/*`, que actúan de proxy hacia `https://api.tulegajo.com/V2` agregando
los headers requeridos (`x-api-key`, `User-Agent`) desde el servidor.

## Configuración

1. Copiá `.env.local.example` a `.env.local`.
2. Completá `TULEGAJO_API_KEY` con la clave provista por soporte de TuLegajo
   (se obtiene desde la interfaz web con un usuario Administrador de
   Corporación).

```bash
cp .env.local.example .env.local
```

## Desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Módulos incluidos

- **Empleados**: listado, alta, edición, etiquetas, desvincular/revincular.
- **Documentos y Lotes**: listado y firma de documentos, alta de lotes,
  carga de archivos (PDF/ZIP) y envío de lotes.
- **Licencias**: listado con filtros, motivos configurados, e importación de
  consumos y periodos otorgados.

## Estructura

- `lib/tulegajo-client.ts`: cliente server-only que llama a la API real.
- `app/api/**`: route handlers que exponen ese cliente al frontend.
- `app/{empleados,documentos,lotes,licencias}/**`: páginas de UI.
