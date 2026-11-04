"use client"

import { cn } from "cn"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ListenUiSelectProps = {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  disabled?: boolean
  className?: string
  triggerClassName?: string
  "aria-label"?: string
}

export function ListenUiSelect({
  value,
  onChange,
  options,
  disabled,
  className,
  triggerClassName,
  "aria-label": ariaLabel,
}: ListenUiSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        size="sm"
        aria-label={ariaLabel}
        className={cn(
          "min-w-[5.5rem] border-border !bg-white font-body font-semibold text-[var(--dlx-ink)] shadow-none hover:!bg-white",
          triggerClassName,
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        side="bottom"
        align="end"
        sideOffset={6}
        alignItemWithTrigger={false}
        className="z-[100] border-border bg-white text-[var(--dlx-ink)] shadow-lg ring-1 ring-black/5"
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="focus:bg-[var(--dlx-neutral-1)] focus:text-[var(--dlx-ink)]"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
