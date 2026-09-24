// Cliente server-side para la API de TuLegajo.com.
// IMPORTANTE: no importar este archivo desde componentes "use client" -
// usa la API KEY, que solo debe vivir en el servidor.

const API_BASE = process.env.TULEGAJO_API_BASE ?? "https://api.tulegajo.com/V2";

export class TuLegajoApiError extends Error {
  statusCode: number;
  path?: string;
  timestamp?: string;

  constructor(statusCode: number, message: string, path?: string, timestamp?: string) {
    super(message);
    this.name = "TuLegajoApiError";
    this.statusCode = statusCode;
    this.path = path;
    this.timestamp = timestamp;
  }
}

type QueryValue = string | number | boolean | undefined | null;

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(API_BASE + path);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url;
}

// Los links de descarga que devuelve la API (descargaOriginalURL, archivos[].uri,
// comunicacion.uri, etc.) a veces vienen como ruta relativa en lugar de URL
// absoluta. Si se usan tal cual en un <a href> o en un fetch server-side, una
// ruta relativa se resuelve contra el origen equivocado (nuestra propia app) y
// rompe con 404 en el browser o "Invalid URL" en el servidor. Esto la normaliza
// contra el host de la API; si ya es absoluta, la deja igual.
export function resolveTuLegajoUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  try {
    return new URL(url, API_BASE).toString();
  } catch {
    return url;
  }
}

// Estos endpoints de descarga viven en el mismo host que la API y, como
// cualquier otro endpoint, requieren el header x-api-key (la API los rechaza
// con 401 si falta). Solo dejamos pasar URLs que efectivamente apunten al
// host configurado, para no convertir esta ruta en un proxy abierto.
export function isTuLegajoUrl(url: string): boolean {
  try {
    return new URL(url).origin === new URL(API_BASE).origin;
  } catch {
    return false;
  }
}

export async function tuLegajoFetchBinary(url: string): Promise<Response> {
  return fetch(url, {
    headers: baseHeaders(),
    cache: "no-store",
  });
}

function baseHeaders(): HeadersInit {
  const apiKey = process.env.TULEGAJO_API_KEY;
  if (!apiKey) {
    throw new TuLegajoApiError(
      500,
      "Falta configurar TULEGAJO_API_KEY en el servidor (.env.local)."
    );
  }
  return {
    "User-Agent": "api-consumer",
    "x-api-key": apiKey,
  };
}

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const message = data?.error?.message ?? res.statusText ?? "Error desconocido";
    throw new TuLegajoApiError(res.status, message, data?.error?.path, data?.error?.timestamp);
  }

  return data as T;
}

export async function tuLegajoGet<T>(
  path: string,
  query?: Record<string, QueryValue>
): Promise<T> {
  const res = await fetch(buildUrl(path, query), {
    method: "GET",
    headers: baseHeaders(),
    cache: "no-store",
  });
  return parseResponse<T>(res);
}

export async function tuLegajoPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: {
      ...baseHeaders(),
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  return parseResponse<T>(res);
}

export async function tuLegajoPut<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "PUT",
    headers: {
      ...baseHeaders(),
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  return parseResponse<T>(res);
}

export async function tuLegajoPostFormData<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: baseHeaders(),
    body: formData,
    cache: "no-store",
  });
  return parseResponse<T>(res);
}
