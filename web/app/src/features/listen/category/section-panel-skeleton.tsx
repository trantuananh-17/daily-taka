export function SectionPanelSkeleton() {
  return (
    <div
      className="animate-pulse overflow-hidden rounded-xl border border-border bg-white px-4 py-3.5 shadow-[rgba(35,58,44,0.04)_0_1px_4px]"
      aria-hidden
    >
      <div className="flex items-center gap-3">
        <div className="h-4 flex-1 max-w-[12rem] rounded bg-[var(--dlx-neutral-1)]" />
        <div className="h-3 w-10 rounded bg-[var(--dlx-neutral-1)]" />
        <div className="hidden h-[5px] w-[5.5rem] rounded-full bg-[var(--dlx-neutral-1)] sm:block" />
      </div>
    </div>
  )
}
