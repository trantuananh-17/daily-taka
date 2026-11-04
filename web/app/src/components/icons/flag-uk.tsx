type FlagUkProps = {
  className?: string
  width?: number
  height?: number
}

export function FlagUk({ className, width = 28, height = 20 }: FlagUkProps) {
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
      <path fill="#28466f" d="M0 0h32v22H0z" />
      <path d="m0 0 32 22m0-22L0 22" stroke="#fff" strokeWidth="6" />
      <path d="m0 0 32 22m0-22L0 22" stroke="#c95252" strokeWidth="2" />
      <path d="M16 0v22M0 11h32" stroke="#fff" strokeWidth="8" />
      <path d="M16 0v22M0 11h32" stroke="#c95252" strokeWidth="4" />
    </svg>
  )
}
