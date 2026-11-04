type FlagCnProps = {
  className?: string
  width?: number
  height?: number
}

export function FlagCn({ className, width = 28, height = 20 }: FlagCnProps) {
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
      <path fill="#c95252" d="M0 0h32v22H0z" />
      <path
        d="m7 4 1.1 3.4h3.6l-2.9 2.1 1.1 3.4L7 10.8l-2.9 2.1 1.1-3.4-2.9-2.1h3.6Z"
        fill="#ffe09a"
      />
      <g fill="#ffe09a">
        <path
          transform="translate(14 4) scale(.65)"
          d="M0 -2 .5 -.6 2 -.6 .8 .4 1.2 2 0 1 -1.2 2 -.8 .4 -2 -.6 -.5 -.6Z"
        />
        <path
          transform="translate(17 7) scale(.65)"
          d="M0 -2 .5 -.6 2 -.6 .8 .4 1.2 2 0 1 -1.2 2 -.8 .4 -2 -.6 -.5 -.6Z"
        />
        <path
          transform="translate(17 11) scale(.65)"
          d="M0 -2 .5 -.6 2 -.6 .8 .4 1.2 2 0 1 -1.2 2 -.8 .4 -2 -.6 -.5 -.6Z"
        />
        <path
          transform="translate(14 14) scale(.65)"
          d="M0 -2 .5 -.6 2 -.6 .8 .4 1.2 2 0 1 -1.2 2 -.8 .4 -2 -.6 -.5 -.6Z"
        />
      </g>
    </svg>
  )
}
