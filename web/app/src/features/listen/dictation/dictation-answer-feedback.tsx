"use client"

type DictationAnswerFeedbackProps = {
  status: "idle" | "wrong" | "correct"
  hintLine: string | null
}

export function DictationAnswerFeedback({ status, hintLine }: DictationAnswerFeedbackProps) {
  if (status === "idle" && !hintLine) return null

  return (
    <div className="mt-3 space-y-2">
      {status === "wrong" ? (
        <p className="m-0 font-body text-sm font-medium text-[var(--dlx-destructive,#c0392b)]">
          Chưa đúng — thử lại hoặc xem gợi ý từ bên dưới.
        </p>
      ) : null}
      {status === "correct" ? (
        <p className="m-0 font-body text-sm font-medium text-[var(--dlx-primary)]">Chính xác!</p>
      ) : null}
      {hintLine ? (
        <p className="m-0 rounded-lg bg-[var(--dlx-neutral-1)] px-3 py-2 font-body text-sm leading-relaxed tracking-wide text-[var(--dlx-body)]">
          {hintLine}
        </p>
      ) : null}
    </div>
  )
}
