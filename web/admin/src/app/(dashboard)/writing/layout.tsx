"use client"

import { Suspense, type ReactNode } from "react"

import { WritingCmsProvider } from "@/features/writing/context/writing-cms-context"

export default function WritingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <Suspense fallback={null}>
        <WritingCmsProvider>{children}</WritingCmsProvider>
      </Suspense>
    </div>
  )
}
