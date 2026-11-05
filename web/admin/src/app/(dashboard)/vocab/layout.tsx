"use client"

import { Suspense, type ReactNode } from "react"

import { VocabCmsProvider } from "@/features/vocab/context/vocab-cms-context"

export default function VocabLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <Suspense fallback={null}>
        <VocabCmsProvider>{children}</VocabCmsProvider>
      </Suspense>
    </div>
  )
}
