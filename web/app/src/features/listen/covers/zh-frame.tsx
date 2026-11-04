import type { ReactNode } from "react"

export function ZhCoverFrame({ art }: { art: ReactNode }) {
  return (
    <svg viewBox="0 0 120 128" fill="none" focusable="false">
      <path d="M14 29 69 17l34 13-5 61-33 15-46-12 5-39Z" className="zh-cover-wash" />
      <path
        d="M12 35V15h20v5H18v9h8v-4h-3M88 113h20V93h-5v14h-9v-8h4v3"
        className="zh-cover-border"
      />
      <path
        d="M12 47h10c12 0 15-6 10-10-4-4-10-1-8 3 2 3 6 1 5-1m-8 8c-7 0-9 6-4 8h15M85 22h9c-1-7 9-9 12-3 8-1 10 7 3 9H93m6-6c-2-4 3-6 5-3m-88 84h14m61-17h17"
        className="zh-cover-cloud"
      />
      <path
        d="M15 89c10-5 22-5 33-1-15-2-24-1-33 1Zm59-56c9-4 21-5 31-2l-3 2c-10-2-19-2-28 0Z"
        className="zh-cover-brush-wash"
      />
      <ellipse cx="60" cy="108" rx="35" ry="4" className="zh-cover-shadow" />
      {art}
      <g className="zh-cover-mark">
        <path d="M95 99h8v10h-8Z" />
        <path d="M97 101h4v2h-2v4h-2v-3m3 1h1v2" />
      </g>
    </svg>
  )
}

export function ZhCoverArtGroup({ children }: { children: ReactNode }) {
  return (
    <g
      className="zh-cover-art"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="butt"
      strokeLinejoin="miter"
    >
      {children}
    </g>
  )
}
