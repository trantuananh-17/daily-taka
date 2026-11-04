type LevelLessonGridSkeletonProps = {
  count: number
}

export function LevelLessonGridSkeleton({ count }: LevelLessonGridSkeletonProps) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-2 min-[1100px]:grid-cols-3" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          className="h-[4.25rem] animate-pulse rounded-[10px] border border-border bg-[var(--dlx-neutral-1)]"
        />
      ))}
    </ul>
  )
}
