/**
 * API utilities – centralised URL builder & typed fetch helpers.
 *
 * The backend base URL is read from NEXT_PUBLIC_API_BASE_URL (should include
 * the /api prefix, e.g. http://localhost:8080/api).
 */

/** Return the backend base URL with trailing slash stripped. */
export function apiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  return raw.replace(/\/$/, "");
}

/** Build a full endpoint URL. */
export function apiUrl(path = ""): string {
  const base = apiBase();
  const clean = String(path).replace(/^\//, "");
  return clean ? `${base}/${clean}` : base;
}

/** Type-safe GET helper with error handling. */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(apiUrl(path), {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
