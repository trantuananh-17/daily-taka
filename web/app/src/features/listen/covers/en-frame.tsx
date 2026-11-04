import type { ReactNode } from "react"

export function EnCoverFrame({ art }: { art: ReactNode }) {
  return (
    <svg viewBox="0 0 120 128" fill="none" focusable="false">
      <ellipse cx="60" cy="111" rx="36" ry="5" className="en-cover-shadow" />
      <circle cx="61" cy="59" r="40" className="en-cover-wash" />
      {art}
    </svg>
  )
}

export function EnCoverArtGroup({ children }: { children: ReactNode }) {
  return (
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  )
}
