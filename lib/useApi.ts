"use client";

import { useCallback, useEffect, useState } from "react";

interface ApiErrorShape {
  message: string;
}

export function useApiGet<T>(url: string | null, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (!url) return;
    setLoading(true);
    setError(null);
    fetch(url)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error((json as ApiErrorShape).message ?? "Error al consultar la API.");
        }
        setData(json as T);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export async function apiRequest<T>(
  url: string,
  options: { method?: string; body?: unknown; formData?: FormData } = {}
): Promise<T> {
  const init: RequestInit = { method: options.method ?? "GET" };
  if (options.formData) {
    init.body = options.formData;
  } else if (options.body !== undefined) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(options.body);
  }
  const res = await fetch(url, init);
  const text = await res.text();
  const json = text ? JSON.parse(text) : undefined;
  if (!res.ok) {
    throw new Error((json as ApiErrorShape)?.message ?? "Error al comunicarse con la API.");
  }
  return json as T;
}
