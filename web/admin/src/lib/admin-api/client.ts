"use client"

export type AdminProxyMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = "AdminApiError"
  }
}

export async function adminApiRequest<T>(
  method: AdminProxyMethod,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch("/api/admin/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, path, body }),
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new AdminApiError(text || res.statusText, res.status)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
