import type { ReactNode } from "react"

export const EN_TOPIC_ARTS: Record<string, () => ReactNode> = {
  "short-stories": () => (
    <>
      <path d="M60 39Q39 25 20 33v62q21-8 40 5 19-13 40-5V33q-19-8-40 6Z" className="cover-paper" />
      <path d="M60 40v59M29 46q11-3 21 3M29 58q11-3 21 3M29 70q11-3 21 3M70 49q10-6 21-3M70 61q10-6 21-3" />
      <path d="M76 30v25l7-5 7 3V29" className="cover-accent" />
      <path d="m29 19 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z" className="cover-accent" />
    </>
  ),
  conversations: () => (
    <>
      <path
        d="M23 34h48a9 9 0 0 1 9 9v25a9 9 0 0 1-9 9H48L31 89V77h-8a9 9 0 0 1-9-9V43a9 9 0 0 1 9-9Z"
        className="cover-paper"
      />
      <path
        d="M65 60h29a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8h-4v11L75 96H65a8 8 0 0 1-8-8V68a8 8 0 0 1 8-8Z"
        className="cover-accent"
      />
      <path d="M29 49h35M29 60h24M69 74h20M69 83h12" />
    </>
  ),
  toeic: () => (
    <>
      <path d="M46 40V30a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5v10M52 39v-8h16v8" />
      <rect x="22" y="40" width="76" height="60" rx="9" className="cover-paper" />
      <path d="M22 59q38 20 76 0M53 65h14v13H53Z" className="cover-accent" />
      <path d="M36 88h17M36 83h8" />
      <path d="m85 25 4 4 9-10" />
    </>
  ),
  "ielts-listening": () => (
    <>
      <rect x="26" y="24" width="64" height="82" rx="7" transform="rotate(-7 58 65)" className="cover-accent" />
      <circle cx="60" cy="61" r="23" className="cover-paper" />
      <ellipse cx="60" cy="61" rx="10" ry="23" />
      <path d="M38 61h44M41 49h38M41 73h38M44 94h27" />
      <path d="m91 28 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z" className="cover-paper" />
    </>
  ),
  toefl: () => (
    <>
      <path d="M28 79h58v13H28a6 6 0 0 1 0-13Z" className="cover-accent" />
      <path d="M31 92h62v13H31a6 6 0 0 1 0-13Z" className="cover-paper" />
      <path d="M38 51v17q22 18 44 0V51" className="cover-paper" />
      <path d="m15 45 45-20 45 20-45 20Z" className="cover-accent" />
      <path d="M96 49v27m-4 5 4-6 4 6M36 85h38M39 98h42" />
    </>
  ),
  "kid-stories": () => (
    <>
      <path d="M24 102V52h20v50M76 102V52h20v50" className="cover-paper" />
      <path d="m20 52 14-23 14 23m24 0 14-23 14 23" className="cover-accent" />
      <path d="M43 102V65h10V55h14v10h10v37Z" className="cover-paper" />
      <path d="M53 102V86a7 7 0 0 1 14 0v16M34 65v8M86 65v8M60 55V24l15 6-15 6" />
      <path d="m20 22 2-5 2 5 5 2-5 2-2 5-2-5-5-2Z" className="cover-accent" />
    </>
  ),
  news: () => (
    <>
      <path d="M23 29h65v67a9 9 0 0 0 9 9H32a9 9 0 0 1-9-9Z" className="cover-paper" />
      <path d="M88 48h15v49a8 8 0 0 1-15 0Z" className="cover-accent" />
      <path d="M35 43h41M35 49h25" />
      <rect x="35" y="60" width="22" height="21" rx="2" className="cover-accent" />
      <path d="M65 61h11M65 70h11M65 79h11M35 91h41" />
    </>
  ),
  "long-listening": () => (
    <>
      <path d="M27 72V54a33 33 0 0 1 66 0v18" strokeWidth="7" />
      <path d="M27 71V54a33 33 0 0 1 66 0v17" className="cover-highlight" strokeWidth="3" />
      <rect x="20" y="62" width="18" height="34" rx="8" className="cover-paper" />
      <rect x="82" y="62" width="18" height="34" rx="8" className="cover-paper" />
      <path d="M47 71v12M56 60v34M65 66v22M74 73v9" strokeWidth="4" />
      <path d="M60 102v5m-9-3v2m18-2v2" />
    </>
  ),
  "bbc-learnings": () => (
    <>
      <path d="m39 39 35-22M31 102v6M88 102v6" />
      <rect x="20" y="39" width="80" height="63" rx="10" className="cover-paper" />
      <rect x="31" y="49" width="58" height="12" rx="3" className="cover-accent" />
      <path d="M40 53v4m8-4v4m8-4v4m8-4v4m8-4v4M71 76h15M71 85h15" />
      <circle cx="45" cy="81" r="13" className="cover-accent" />
      <circle cx="45" cy="81" r="5" className="cover-paper" />
    </>
  ),
  "ted-talks": () => (
    <>
      <rect x="45" y="22" width="30" height="51" rx="15" transform="rotate(12 60 48)" className="cover-paper" />
      <path d="M35 53a25 25 0 0 0 50 0M60 80v22M44 103h32M54 33h12M54 41h12M54 49h12" />
      <path d="m22 35 6 4m64-4-6 4M19 55h8m74 0h-8" />
      <circle cx="60" cy="61" r="3" className="cover-accent" />
    </>
  ),
  number: () => (
    <>
      <rect x="17" y="31" width="42" height="48" rx="7" transform="rotate(-9 38 55)" className="cover-paper" />
      <rect x="58" y="55" width="43" height="49" rx="7" transform="rotate(9 79 79)" className="cover-accent" />
      <path d="m31 46 7-5v24m-6 0h14M72 70c1-9 17-9 17 0 0 6-16 9-16 18h17" strokeWidth="3" />
      <path d="M77 26v12m-6-6h12M27 96h12" />
    </>
  ),
  "name-spelling": () => (
    <>
      <path d="M45 34V23h30v11" />
      <rect x="24" y="34" width="72" height="70" rx="8" className="cover-paper" />
      <path d="M24 43a9 9 0 0 1 9-9h54a9 9 0 0 1 9 9v11H24Z" className="cover-accent" />
      <circle cx="44" cy="72" r="7" />
      <path d="M33 91a11 11 0 0 1 22 0M65 70h18M65 81h13M65 92h18" />
    </>
  ),
  "medical-oet": () => (
    <>
      <rect x="28" y="27" width="58" height="77" rx="7" className="cover-paper" />
      <rect x="45" y="21" width="24" height="12" rx="4" className="cover-accent" />
      <path d="M51 47h12v8h8v12h-8v8H51v-8h-8V55h8Z" className="cover-accent" />
      <path d="M41 89h16m-16 6h10M80 65v13a12 12 0 0 0 24 0V66" />
      <circle cx="80" cy="61" r="4" className="cover-paper" />
      <circle cx="104" cy="62" r="4" className="cover-paper" />
    </>
  ),
  "general-video": () => (
    <>
      <rect x="19" y="36" width="82" height="63" rx="8" className="cover-paper" />
      <path d="M19 45a9 9 0 0 1 9-9h64a9 9 0 0 1 9 9v8H19Z" className="cover-accent" />
      <path d="m35 36-9 17m29-17-9 17m29-17-9 17m29-17-9 17" />
      <path d="m52 65 20 12-20 12Z" className="cover-accent" />
    </>
  ),
}
