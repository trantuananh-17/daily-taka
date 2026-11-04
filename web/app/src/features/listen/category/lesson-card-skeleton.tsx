export function LessonCardSkeleton() {
  return (
    <li
      className="flex animate-pulse items-center gap-2.5 rounded-[10px] border border-[color-mix(in_srgb,var(--dlx-hairline)_90%,#fff)] bg-white px-3 py-2.5"
      aria-hidden
    >
      <span className="h-4 w-7 rounded bg-[var(--dlx-neutral-1)]" />
      <span className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="h-4 w-[70%] rounded bg-[var(--dlx-neutral-1)]" />
        <span className="h-3 w-[55%] rounded bg-[color-mix(in_srgb,var(--dlx-neutral-1)_70%,#fff)]" />
      </span>
      <span className="size-[18px] rounded-full bg-[var(--dlx-neutral-1)]" />
    </li>
  )
}

export function LessonGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <LessonCardSkeleton key={index} />
      ))}
    </ul>
  )
}
