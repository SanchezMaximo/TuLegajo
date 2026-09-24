# TuLegajo · Panel

Frontend interno (Next.js) que consume la API de TuLegajo.com (v2.2.0) para
gestionar Empleados, Documentos/Lotes, Comunicaciones, Archivos de legajo,
Licencias y Responsables sin usar la interfaz web.

La API KEY nunca llega al navegador: las páginas llaman a rutas propias bajo
`/api/*`, que actúan de proxy hacia `https://api.tulegajo.com/V2` agregando
los headers requeridos (`x-api-key`, `User-Agent`) desde el servidor. Los
links de descarga de la API (recibos, archivos de legajo, comunicaciones)
también pasan por un proxy propio (`/api/descargar`), porque esos endpoints
exigen el mismo header y un link directo del navegador no puede mandarlo.

## Configuración

1. Copiá `.env.local.example` a `.env.local`.
2. Completá `TULEGAJO_API_KEY` con la clave provista por soporte de TuLegajo
   (se obtiene desde la interfaz web con un usuario Administrador de
   Corporación).
3. (Recomendado si vas a desplegarlo) Completá `AUTH_USER` y `AUTH_PASSWORD`
   para proteger el acceso al panel con usuario y contraseña — ver más abajo.

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
  carga de archivos (PDF/ZIP), envío de lotes, y verificación de vacaciones
  liquidadas (lee el PDF del recibo buscando el concepto "VACACIONES").
- **Vacaciones por empleado**: cruza vacaciones liquidadas (recibos) contra
  vacaciones gozadas (Licencias aprobadas con motivo Vacaciones) y marca
  inconsistencias año por año.
- **Comunicaciones**: listado, firma, y envío de PDFs a empleados.
- **Archivos de legajo**: listado filtrable por CUIL y fecha de carga.
- **Licencias**: listado con filtros, motivos configurados, e importación de
  consumos y periodos otorgados.
- **Responsables**: alta y gestión de roles.
- Ordenamiento por fecha/período y modo oscuro en toda la app.

## Protección de acceso (usuario y contraseña)

La app maneja legajos y datos de sueldo, así que **no la despliegues sin
protección**. `proxy.ts` (la convención de Next.js para correr código antes
de cada request — antes se llamaba `middleware.ts`) pide usuario y
contraseña vía autenticación básica del navegador si están configuradas las
variables `AUTH_USER` y `AUTH_PASSWORD`. Si las dejás vacías, no pide nada
(pensado para desarrollo local).

## Desplegar en Vercel

1. Si todavía no tenés el código en GitHub, creá un repo (puede ser
   privado) y subí este proyecto:
   ```bash
   git remote add origin <url-de-tu-repo>
   git push -u origin master
   ```
2. Entrá a [vercel.com](https://vercel.com), iniciá sesión y hacé
   **Add New → Project**, importando ese repositorio. Vercel detecta
   Next.js automáticamente, no hace falta tocar nada del build.
3. Antes de darle a Deploy (o después, en **Settings → Environment
   Variables**), cargá:
   - `TULEGAJO_API_KEY`
   - `TULEGAJO_API_BASE` (opcional, si no la ponés usa el valor por defecto)
   - `AUTH_USER` y `AUTH_PASSWORD` (para que pida login)
4. Deploy. Vercel te da una URL (`https://tu-proyecto.vercel.app`) — esa es
   la que compartís. Cada `git push` a la rama principal vuelve a desplegar
   solo.

Alternativa sin GitHub: instalar `npm i -g vercel`, correr `vercel login` y
después `vercel --prod` desde esta carpeta — te va a pedir las mismas
variables de entorno la primera vez.

## Estructura

- `lib/tulegajo-client.ts`: cliente server-only que llama a la API real.
- `app/api/**`: route handlers que exponen ese cliente al frontend.
- `app/**`: páginas de UI, una carpeta por módulo.
- `proxy.ts`: gate de usuario/contraseña para toda la app.
