"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { UploadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ListenLessonAudioFieldProps = {
  audioPublicPath: string | null
  onAudioPublicPathChange: (path: string | null) => void
  onLocalPreviewUrlChange?: (url: string | null) => void
}

export function ListenLessonAudioField({
  audioPublicPath,
  onAudioPublicPathChange,
  onLocalPreviewUrlChange,
}: ListenLessonAudioFieldProps) {
  const inputId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl)
    }
  }, [localPreviewUrl])

  const playbackSrc = useMemo(() => {
    if (localPreviewUrl) return localPreviewUrl
    const path = audioPublicPath?.trim()
    if (!path) return null
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
      return path
    }
    return `/${path.replace(/^\//, "")}`
  }, [audioPublicPath, localPreviewUrl])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl)
    const url = URL.createObjectURL(file)
    setLocalPreviewUrl(url)
    onLocalPreviewUrlChange?.(url)
    setFileName(file.name)
    if (!audioPublicPath?.trim()) {
      onAudioPublicPathChange(`/listening/mock/upload/${file.name}`)
    }
    e.target.value = ""
  }

  function clearLocalFile() {
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl)
    setLocalPreviewUrl(null)
    onLocalPreviewUrlChange?.(null)
    setFileName(null)
  }

  return (
    <div className="grid gap-3 rounded-lg border p-4">
      <div>
        <p className="text-sm font-medium">Audio bài học</p>
        <p className="text-xs text-muted-foreground">
          Một file cho cả bài. Tab nghe–viết và Transcript trên app learner dùng chung file này; mỗi câu
          có <code className="text-[11px]">startMs</code>/<code className="text-[11px]">endMs</code> +{" "}
          <code className="text-[11px]">transcript</code>.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          id={inputId}
          type="file"
          accept="audio/*"
          className="sr-only"
          onChange={handleFileChange}
        />
        <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
          <UploadIcon className="size-4" aria-hidden />
          Chọn file audio
        </Button>
        {fileName ? (
          <span className="text-xs text-muted-foreground">
            Preview: {fileName}
            <Button type="button" variant="link" className="h-auto p-0 pl-1 text-xs" onClick={clearLocalFile}>
              Bỏ preview
            </Button>
          </span>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${inputId}-path`}>URL / đường dẫn công khai (audioPublicPath)</Label>
        <Input
          id={`${inputId}-path`}
          value={audioPublicPath ?? ""}
          placeholder="/listening/mock/en/lessons/.../audio.mp3"
          onChange={(e) => onAudioPublicPathChange(e.target.value.trim() || null)}
        />
        <p className="text-xs text-muted-foreground">
          Khi nối API: upload → <code className="text-[11px]">audioStorageKey</code>; mock dùng path hoặc file
          local ở trên.
        </p>
      </div>
      {playbackSrc ? (
        <audio controls className="w-full max-w-md" src={playbackSrc} preload="metadata">
          Trình duyệt không hỗ trợ audio.
        </audio>
      ) : (
        <p className="text-xs text-muted-foreground">Chưa có audio để nghe thử.</p>
      )}
    </div>
  )
}
