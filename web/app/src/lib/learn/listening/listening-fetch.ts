/** Credentialed fetch for session cookies (API on another port, same localhost site). */
export const listeningCredentials: RequestCredentials = "include"

export function listeningFetchInit(init?: RequestInit): RequestInit {
  return { ...init, credentials: listeningCredentials }
}
