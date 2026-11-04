export async function unwrapHonoJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`)
  }
  return response.json() as Promise<T>
}
