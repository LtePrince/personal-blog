/**
 * API utilities – centralised URL builder & typed fetch helpers.
 *
 * SSR pages call the Next.js internal API routes (/api/blog, etc.) which in
 * turn proxy requests to the Go backend specified by BLOG_BACKEND_URL.
 *
 * NEXT_PUBLIC_API_BASE_URL is the origin of this Next.js app itself, used to
 * build absolute URLs during SSR (e.g. http://localhost:3000).
 */

import type { ApiResponse } from "@/types/blog";

/** Return the app origin (for SSR absolute fetch). Trailing slash stripped. */
export function apiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

/** Build a full endpoint URL under /api/. */
export function apiUrl(path = ""): string {
  const base = apiBase();
  const clean = String(path).replace(/^\//, "");
  return clean ? `${base}/api/${clean}` : `${base}/api`;
}

/**
 * Type-safe GET helper that unwraps the standard ApiResponse envelope.
 *
 * Returns `T | null` — callers don't need to deal with the envelope.
 */
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
    const body: ApiResponse<T> = await res.json();
    return body.success ? (body.data ?? null) : null;
  } catch {
    return null;
  }
}
