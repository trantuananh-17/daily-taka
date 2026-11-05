"use client"

import { useEffect, useRef } from "react"

import { authClient } from "@/lib/auth/client"
import { mergeGuestListeningIfNeeded } from "@/lib/learn/listening/merge-guest-listening-local"
import { mergeGuestVocabIfNeeded } from "@/lib/learn/vocab/merge-guest-vocab-local"
import { mergeGuestWritingIfNeeded } from "@/lib/learn/writing/merge-guest-writing-local"

type AuthSessionProviderProps = {
  children: React.ReactNode
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const { data: session } = authClient.useSession()
  const mergedRef = useRef(false)

  useEffect(() => {
    if (!session?.user || mergedRef.current) return
    mergedRef.current = true
    void Promise.all([
      mergeGuestListeningIfNeeded(),
      mergeGuestVocabIfNeeded(),
      mergeGuestWritingIfNeeded(),
    ]).catch(() => {
      mergedRef.current = false
    })
  }, [session?.user])

  return children
}
