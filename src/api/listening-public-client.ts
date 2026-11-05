import { hc } from "hono/client"
import { Hono } from "hono"

import { listeningRoutesStubApp } from "../modules/listening/listening.routes.builder"

export const listeningPublicApp = new Hono().route(
  "/v1/languages/:languageCode/listening",
  listeningRoutesStubApp,
)

export type ListeningPublicAppType = typeof listeningPublicApp

export function createListeningPublicClient(
  baseUrl: string,
  options?: { fetch?: typeof fetch },
) {
  return hc<ListeningPublicAppType>(baseUrl, options)
}

export type ListeningPublicClient = ReturnType<typeof createListeningPublicClient>
