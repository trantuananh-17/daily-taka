"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Dialog as DialogPrimitive } from "@animate-ui/react/primitives/base-ui/dialog"
import { Settings2, X } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ListenUiSelect } from "@/features/listen/listen-ui-select"
import { LISTENING_SETTINGS_DIALOG_MOTION } from "@/lib/learn/listening/listening-dialog-entrance"
import {
  LISTENING_PLAYBACK_KEY_OPTIONS,
  formatListeningPlaybackKeyLabel,
  type ListeningPlaybackKey,
  type ListeningPlaybackSettings,
} from "@/lib/learn/listening/listening-playback-settings"

type ListeningPlaybackSettingsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: ListeningPlaybackSettings
  onSave: (settings: ListeningPlaybackSettings) => void
}

function SettingRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <span className="font-body text-sm text-[var(--dlx-body)]">{label}</span>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function SettingToggleRow({
  label,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <span className="font-body text-sm text-[var(--dlx-body)]">{label}</span>
      <Switch
        size="default"
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  )
}

function SelectField({
  value,
  onChange,
  options,
  disabled,
  className,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  disabled?: boolean
  className?: string
}) {
  return (
    <ListenUiSelect
      value={value}
      onChange={onChange}
      options={options}
      disabled={disabled}
      className={cn("min-w-[7rem]", className)}
    />
  )
}

export function ListeningPlaybackSettingsDialog({
  open,
  onOpenChange,
  settings,
  onSave,
}: ListeningPlaybackSettingsDialogProps) {
  const [draft, setDraft] = useState(settings)

  useEffect(() => {
    if (open) setDraft(settings)
  }, [open, settings])

  function patch(partial: Partial<ListeningPlaybackSettings>) {
    setDraft((current) => ({ ...current, ...partial }))
  }

  function handleSave() {
    onSave(draft)
    onOpenChange(false)
  }

  function handleCancel() {
    setDraft(settings)
    onOpenChange(false)
  }

  const keyOptions = LISTENING_PLAYBACK_KEY_OPTIONS.map((key) => ({
    value: key,
    label: formatListeningPlaybackKeyLabel(key),
  }))

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/20 supports-backdrop-filter:backdrop-blur-xs" />
        <DialogPrimitive.Popup
          data-side={LISTENING_SETTINGS_DIALOG_MOTION["data-side"]}
          className={LISTENING_SETTINGS_DIALOG_MOTION.className}
        >
          <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex items-start gap-2">
              <Settings2 className="mt-0.5 size-5 text-[var(--dlx-primary)]" strokeWidth={2} aria-hidden />
              <div>
                <DialogPrimitive.Title className="m-0 font-heading text-base font-bold text-[var(--dlx-ink)]">
                  Cài đặt bài nghe
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-1 mb-0 font-body text-xs text-[var(--dlx-muted)]">
                  Các tùy chọn này được lưu riêng cho tài khoản của bạn.
                </DialogPrimitive.Description>
              </div>
            </div>
            <DialogPrimitive.Close
              render={<Button variant="ghost" size="icon" className="size-9 shrink-0" />}
              aria-label="Đóng"
            >
              <X className="size-5" strokeWidth={2} aria-hidden />
            </DialogPrimitive.Close>
          </div>

          <div className="overflow-y-auto px-5 py-1">
            <SettingRow label="Phím nghe lại">
              <SelectField
                value={draft.replayKey}
                onChange={(value) => patch({ replayKey: value as ListeningPlaybackKey })}
                options={keyOptions}
              />
            </SettingRow>
            <SettingRow label="Phím phát / tạm dừng">
              <SelectField
                value={draft.playPauseKey}
                onChange={(value) => patch({ playPauseKey: value as ListeningPlaybackKey })}
                options={keyOptions}
              />
            </SettingRow>
            <SettingRow label="Phím kiểm tra / tiếp">
              <SelectField
                value={draft.checkNextKey}
                onChange={(value) => patch({ checkNextKey: value as ListeningPlaybackKey })}
                options={keyOptions}
              />
            </SettingRow>
            <SettingRow label="Phím bỏ qua">
              <SelectField
                value={draft.skipKey}
                onChange={(value) => patch({ skipKey: value as ListeningPlaybackKey })}
                options={keyOptions}
              />
            </SettingRow>
            <SettingToggleRow
              label="Tự động nghe lại"
              checked={draft.autoReplay}
              onCheckedChange={(checked) => patch({ autoReplay: checked })}
            />
            <SettingRow label="Thời gian giữa các lần nghe">
              <SelectField
                value={String(draft.replayGapSeconds)}
                disabled={!draft.autoReplay}
                onChange={(value) =>
                  patch({ replayGapSeconds: Number(value) as ListeningPlaybackSettings["replayGapSeconds"] })
                }
                options={[
                  { value: "0.5", label: "0.5 giây" },
                  { value: "1", label: "1 giây" },
                  { value: "1.5", label: "1.5 giây" },
                  { value: "2", label: "2 giây" },
                ]}
              />
            </SettingRow>
            <SettingToggleRow
              label="Hiển thị mẹo phím tắt"
              checked={draft.showShortcutTips}
              onCheckedChange={(checked) => patch({ showShortcutTips: checked })}
            />
            <SettingToggleRow
              label="Hiển thị học lại từ đầu"
              checked={draft.showRestartFromBeginning}
              onCheckedChange={(checked) => patch({ showRestartFromBeginning: checked })}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="button" className="dlx-btn-primary" onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
