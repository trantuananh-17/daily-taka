type FlagJpProps = {
  className?: string
  width?: number
  height?: number
}

export function FlagJp({ className, width = 28, height = 20 }: FlagJpProps) {
  return (
    <svg
      viewBox="0 0 32 22"
      width={width}
      height={height}
      fill="none"
      aria-hidden
      focusable={false}
      className={className}
    >
      <path fill="#fff" stroke="#e4e7e5" d="M.5.5h31v21H.5z" />
      <circle cx="16" cy="11" r="6" fill="#c95252" />
    </svg>
  )
}
