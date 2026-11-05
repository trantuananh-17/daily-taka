"use client"

import { Suspense, type ReactNode } from "react"

import { ListenCmsProvider } from "@/features/listen/context/listen-cms-context"

export default function ListenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <Suspense fallback={null}>
        <ListenCmsProvider>{children}</ListenCmsProvider>
      </Suspense>
    </div>
  )
}
