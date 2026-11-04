import type { ReactNode } from "react"
import { cn } from "cn"

import { vocabLessonPanelClass } from "@/features/vocab/lesson/vocab-lesson-styles"

type VocabLessonShellProps = {
  children: ReactNode
  className?: string
}

export function VocabLessonShell({ children, className }: VocabLessonShellProps) {
  return (
    <div className={cn("vocab-lesson-shell mx-auto flex w-full max-w-[48rem] flex-col gap-4", className)}>
      {children}
    </div>
  )
}

type VocabLessonPanelProps = {
  children: ReactNode
  className?: string
}

export function VocabLessonPanel({ children, className }: VocabLessonPanelProps) {
  return <div className={cn(vocabLessonPanelClass, className)}>{children}</div>
}
