"use client"

import { ListenUiSelect } from "@/features/listen/listen-ui-select"

const PLAYBACK_RATE_OPTIONS = [
  { value: "1", label: "1x" },
  { value: "0.75", label: "0.75x" },
  { value: "1.25", label: "1.25x" },
]

type PlaybackRateSelectProps = {
  value: number
  onChange: (rate: number) => void
}

export function PlaybackRateSelect({ value, onChange }: PlaybackRateSelectProps) {
  return (
    <ListenUiSelect
      aria-label="Tốc độ phát"
      value={String(value)}
      onChange={(next) => onChange(Number(next))}
      options={PLAYBACK_RATE_OPTIONS}
      triggerClassName="min-w-[4.75rem]"
    />
  )
}
