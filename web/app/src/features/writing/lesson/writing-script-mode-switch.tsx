"use client"

import { cn } from "cn"

import type { WritingScriptModeDef } from "@/lib/learn/writing/types/lesson"

type WritingScriptModeSwitchProps = {
  modes: WritingScriptModeDef[]
  value: string
  onChange: (modeId: string) => void
}

export function WritingScriptModeSwitch({ modes, value, onChange }: WritingScriptModeSwitchProps) {
  if (modes.length < 2) return null

  return (
    <div
      className="inline-flex rounded-full border border-[var(--dlx-hairline)] bg-[color-mix(in_srgb,var(--dlx-neutral-1)_65%,#fff)] p-0.5"
      role="tablist"
      aria-label="Kiểu chữ luyện viết"
    >
      {modes.map((mode) => {
        const active = mode.id === value
        return (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={cn(
              "rounded-full px-3 py-1.5 font-body text-[11px] font-semibold transition-colors sm:text-xs",
              active
                ? "bg-[var(--dlx-primary)] text-white shadow-sm"
                : "text-[var(--dlx-muted)] hover:text-[var(--dlx-ink)]",
            )}
            onClick={() => onChange(mode.id)}
          >
            {mode.label}
          </button>
        )
      })}
    </div>
  )
}
