import type { ReactNode } from "react"

export function JpCoverFrame({ art }: { art: ReactNode }) {
  return (
    <svg viewBox="0 0 120 128" fill="none" focusable="false">
      <circle cx="65" cy="53" r="37" className="jp-cover-wash" />
      <path
        d="M13 108q9-11 18 0 9-11 18 0 9-11 18 0 9-11 18 0 9-11 18 0M13 114q9-11 18 0 9-11 18 0 9-11 18 0 9-11 18 0 9-11 18 0"
        className="jp-cover-pattern"
      />
      <g className="jp-cover-grain">
        <circle cx="16" cy="31" r="1" />
        <circle cx="99" cy="52" r=".8" />
        <circle cx="24" cy="91" r=".8" />
        <circle cx="83" cy="17" r="1" />
      </g>
      <ellipse cx="60" cy="106" rx="34" ry="4" className="jp-cover-shadow" />
      {art}
      <g className="jp-cover-seal" transform="rotate(-8 99 101)">
        <rect x="94" y="95" width="10" height="12" rx="2" />
        <path d="M97 98v6m4-6v6m-4-3h4" />
      </g>
    </svg>
  )
}

export function JpCoverArtGroup({ children }: { children: ReactNode }) {
  return (
    <g
      className="jp-cover-art"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </g>
  )
}
