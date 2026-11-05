"use client"

import { createAuthClient } from "better-auth/react"

import { getPublicApiBaseUrl } from "@/lib/api/env"

export const authClient = createAuthClient({
  baseURL: getPublicApiBaseUrl(),
})
