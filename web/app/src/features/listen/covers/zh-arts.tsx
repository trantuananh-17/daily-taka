import type { ReactNode } from "react"

export const ZH_TOPIC_ARTS: Record<string, () => ReactNode> = {
  "short-stories": () => (
    <>
      <circle cx="82" cy="30" r="15" className="zh-cover-secondary" stroke="none" />
      <path d="m13 88 20-50 12 20 16-38 19 39 11-14 16 43Z" className="zh-cover-landscape" stroke="none" />
      <path d="m30 95 15-53 15 24 11-14 18 43Z" className="zh-cover-accent" />
      <path d="m45 42 2 18 8 8m18-12-6 21M18 92q42-16 85 0l-15 12H33Z" className="zh-cover-paper" />
      <path d="M43 88V68h28v20M35 65q22 7 44 0l-6 8H41Z" className="zh-cover-paper" />
      <path d="M29 54q9 9 18 4l11-10 4 1q12 14 24 5l-8 10H37Z" className="zh-cover-secondary" />
      <path d="M52 72v15m10-15v15M17 83q17-8 30 0m29-5q16-7 28 0M31 99h54" className="zh-cover-mist" />
      <path d="M22 52q6-7 12 0m5-5q5-6 10 0" />
      <path d="M29 54q15 11 29-6l4 1q13 16 24 5l-6 8q-13 5-20-9-12 15-24 7ZM42 73h4v15h-4Zm27 0h3v15h-3Z" className="zh-cover-brush" />
    </>
  ),
  "conversations": () => (
    <>
      <path d="M27 81C13 69 22 61 35 66l5 9 9 10-18 4Z" className="zh-cover-paper" />
      <path d="M34 70C49 58 23 44 35 30q6-6 12-1l-2 6c-12-6-12 6-3 18q9 13-4 24Z" className="zh-cover-paper" />
      <path d="m45 30 17 6-18-2ZM23 72q5 6 19 11l-20 1 12-4Z" className="zh-cover-brush" />
      <path d="M93 81c14-12 5-20-8-15l-5 9-9 10 18 4Z" className="zh-cover-paper" />
      <path d="M86 70C71 58 97 44 85 30q-6-6-12-1l2 6c12-6 12 6 3 18q-9 13 4 24Z" className="zh-cover-paper" />
      <path d="m75 30-17 6 18-2ZM97 72q-5 6-19 11l20 1-12-4Z" className="zh-cover-brush" />
      <path d="M36 27q5-4 10 1l-1 3-9-1Zm48 0q-5-4-10 1l1 3 9-1Z" className="zh-cover-cinnabar" />
      <path d="m31 87-2 17m7-16 4 15m49-16 2 17m-7-16-4 15M23 105h21m32 0h21" className="zh-cover-fine" />
      <path d="M49 65q11-13 22 0-11 14-22 0Z" className="zh-cover-secondary" />
      <path d="m53 65 7-4 7 4-7 4ZM51 63q-12-1-16-13m34 13q12-1 16-13" className="zh-cover-fine" />
      <path d="M14 96q8-5 16 0m62 0q8-5 14 0" className="zh-cover-mist" />
    </>
  ),
  "fairy-tales": () => (
    <>
      <circle cx="68" cy="40" r="25" className="zh-cover-secondary" stroke="none" />
      <path d="M48 86C9 80 9 50 23 45q-4 28 25 31C12 61 25 24 39 29q-8 25 13 41C35 38 49 19 59 24q-7 22 2 46C64 33 83 25 91 35q-18 12-20 38 24-26 35-13-13 17-35 27Z" className="zh-cover-accent" />
      <path d="M27 53q6 15 22 23m-11-35q3 16 16 30m8-35-1 33m24-25Q74 57 70 73m24-6L74 82" className="zh-cover-fine" />
      <path d="m47 67-4-16 14 10q7-2 13 0l13-10-4 17q4 12-13 21l-11-4q-12-7-8-18Z" className="zh-cover-paper" />
      <path d="m51 69 6 4m12 0 6-4m-15 6 3 3 3-3m-8 9 5 3 5-3" />
      <path d="M50 86q-10 13 6 17 16 3 21-10L67 84" className="zh-cover-paper" />
      <path d="M22 103q18-10 31-3m22 5q17-12 28-6" className="zh-cover-mist" />
      <path d="M26 49q-2 17 22 27-26-6-22-27Zm14-17q-5 20 12 38-21-13-12-38Zm15 31-8-9 3 13 10 7-6-10ZM73 63l7-9-4 13-8 7Z" className="zh-cover-brush" />
    </>
  ),
  "hsk-course": () => (
    <>
      <path d="m28 31 56-8 11 68-56 9Z" className="zh-cover-secondary" />
      <path d="m25 35 51-8 10 65-51 8Z" className="zh-cover-paper" />
      <path d="m31 34 10 64m-2-65 10 63m-2-65 10 63m-2-64 10 63m-2-64 10 62" className="zh-cover-fine" />
      <path d="m29 48 50-8m-43 45 49-8" />
      <path d="m51 53 11-2 3 14-11 2Z" className="zh-cover-accent" />
      <path d="m84 72 9-44 6 2-9 44-6 10-2-5Z" className="zh-cover-ink" />
      <path d="m93 28 1-8m-9 64q-1 10-8 12m-56 10q17-9 28-2m26 0q14-6 27-1" className="zh-cover-mist" />
      <path d="m12 72 8-27m-4 14-7-7m9 2 8-6" className="zh-cover-leaf" />
      <path d="M16 60Q5 55 7 47q8 4 9 13Zm3-6q3-11 12-13-3 9-12 13Zm-3 10q-8 0-10-6 7-1 10 6Z" className="zh-cover-brush" />
    </>
  ),
  "hsk-contest": () => (
    <>
      <circle cx="60" cy="62" r="34" className="zh-cover-halo" />
      <path d="M32 95q-20-25 0-48-2 20 8 25M88 95q20-25 0-48 2 20-8 25" className="zh-cover-secondary" />
      <path d="m55 65 1-39 4-10 4 10 1 39-5 10Z" className="zh-cover-paper" />
      <path d="m43 68 17-5 17 5-7 6-10-3-10 3ZM56 76h8v18h-8Z" className="zh-cover-accent" />
      <path d="M60 29v29m-8 41h16M55 94l5 6 5-6" />
      <path d="m21 40 5-4m72 4-5-4M33 26l3 6m48-6-3 6M20 102q40-14 80 0" className="zh-cover-mist" />
      <circle cx="29" cy="67" r="4" className="zh-cover-accent" />
      <circle cx="91" cy="67" r="4" className="zh-cover-accent" />
      <path d="m60 22-2 39 3-5ZM35 92q-12-13-7-33 0 23 12 29Zm50 0q12-13 7-33 0 23-12 29Z" className="zh-cover-brush" />
    </>
  ),
  "chinese-course": () => (
    <>
      <path d="M24 40q19-15 39-7 17 6 31-5v63q-17 11-34 4-18-7-36 7Z" className="zh-cover-paper" />
      <path d="M19 36h10v69H19Zm70-11h10v68H89Z" className="zh-cover-accent" />
      <path d="m50 82 33-38 6 5-34 38-11 5Z" className="zh-cover-ink" />
      <path d="m82 44 7-9 6 5-6 9M45 91q-8 7-16 4" className="zh-cover-gold-line" />
      <path d="M34 30q4-10 15-7m20 1q10 5 17-3M30 109q16-8 30-2m13-3q14-7 27-1" className="zh-cover-mist" />
      <path d="m40 47 28-3-3 3-25 2Zm3 8 2-6 2 9-3 9-3 2 2-10Zm7 0 19-3-2 3-18 2Zm9-6 3-1-2 16 5 2-9 2 1-9Z" className="zh-cover-brush" />
    </>
  ),
  "kid": () => (
    <>
      <path d="M31 63q-8-14 4-19l11 7m28 0 11-7q12 5 4 19" className="zh-cover-secondary" />
      <path d="M32 62q0-21 28-21t28 21v16q0 21-28 21T32 78Z" className="zh-cover-secondary" />
      <path d="M40 72q-1-18 11-13l9 8 9-8q12-5 11 13 0 20-20 20T40 72Z" className="zh-cover-paper" />
      <path d="m44 71 5 1m22 0 5-1m-21 8 5 4 5-4-5-3Zm5 4v6m-6 0q6 5 12 0M43 50l5 6m29-6-5 6m-39 9 7 3m40 0 7-3" />
      <path d="M56 46h8m-4-5v12M47 28l4-9 6 8-5 8ZM65 29l9-8 2 11-8 5Z" className="zh-cover-accent" />
      <path d="M17 98q-5-10 7-12 5-12 15-4m42 4q11-9 18 1 12 2 8 12M24 103q17-8 28-2m15 1q16-8 30-1" className="zh-cover-mist" />
      <path d="M53 44h14v3H53Zm5-4h4v16h-4Zm-5 9h14v3H53ZM34 64l9 5-8-1Zm52 0-9 5 8-1Z" className="zh-cover-brush" />
    </>
  ),
  "chinese-animation": () => (
    <>
      <circle cx="63" cy="56" r="33" className="zh-cover-halo" />
      <path d="M85 37C102 54 89 78 68 82 39 88 22 73 28 56 32 43 48 43 54 52 62 64 49 72 41 64" className="zh-cover-dragon-body" />
      <path d="M85 37C100 55 86 75 65 78 44 82 28 71 33 58" className="zh-cover-gold-line" />
      <path d="m79 27-1-13 11 11 11-3-4 14-10 12-15-7 2-11Z" className="zh-cover-accent" />
      <path d="m79 27-12-9m22 7 3-12M74 34l-11-1m11 5-15 6m31-9 13 6-7 5-13-2" />
      <path d="m82 32 5 1m1 10q6 8 15 4M66 77l4 13 9 2m-34-13-3 12-9 4m28-44-6-10-9-3" />
      <path d="m54 43-2-9m1 9-8-3m28 48 7-2m-42 5-4-3" />
      <circle cx="65" cy="98" r="8" className="zh-cover-secondary" />
      <path d="m59 96 5-3m-48 1q10-9 20-2m45 8q12-9 22-1" className="zh-cover-mist" />
      <path d="M77 29 66 17l10 5-3-9 7 12ZM87 24l6-13-1 10 8-3-10 10ZM76 39C56 30 56 50 43 44c13 11 16-13 33-5ZM90 46c17 18 23 0 18-4 2 14-9 9-18 4ZM36 53l6-6 5 4 5-3 5 9-7-5-4 3-4-4Z" className="zh-cover-brush" />
    </>
  ),
  "podcast": () => (
    <>
      <circle cx="61" cy="56" r="33" className="zh-cover-halo" />
      <path d="M59 20v13m-11-13h22M39 41q20-12 40 0l4 47q-22 15-44 0Z" className="zh-cover-accent" />
      <path d="m40 49 39-1M39 82q22 11 43 0M49 45v34m23-34v34" />
      <path d="m55 56 10-1 1 16-10 2Z" className="zh-cover-paper" />
      <path d="M60 95v12m-5-6 5 8 5-8m-39-56q-9 17 0 35m69-35q9 17 0 35" className="zh-cover-signal" />
      <path d="M16 53q-5 10 0 20m88-20q5 10 0 20" className="zh-cover-fine" />
      <path d="M40 43q20-10 39 0-21-6-39 0Zm1 39q22 10 40 0-17 15-40 0Z" className="zh-cover-brush" />
    </>
  ),
  "ted-talks": () => (
    <>
      <path d="M21 87Q6 53 38 33q22-15 53 3 21 14 17 43L64 99Z" className="zh-cover-accent" />
      <path d="M18 65q13-23 46-25 26-1 42 20" className="zh-cover-paper" />
      <path d="m64 97-43-43m43 43L36 36m28 61L55 29m9 68 12-65m-12 65 30-52m-30 52 43-32" className="zh-cover-fine" />
      <path d="M35 64q13-4 29-3 17 1 30 9m-47 9 9-12 13 6 8-9" />
      <path d="m61 95 5 4-2 10m-4-6 5 2m-38-7q9-6 18-3m37 7q10-8 20-4" className="zh-cover-mist" />
      <circle cx="64" cy="97" r="3" className="zh-cover-secondary" />
      <path d="M22 29q8-7 16-2m55 3q8 6 9 14" className="zh-cover-signal" />
      <path d="M37 63 52 49l8 9 10-13 15 21-14-15-9 12-10-9Zm39 5 4-16 1 16Zm4-11 8-6-5 7 9-1-8 3Z" className="zh-cover-brush" />
    </>
  ),
  "culture": () => (
    <>
      <circle cx="67" cy="56" r="32" className="zh-cover-halo" />
      <path d="M64 59C37 65 21 36 28 23q6 19 23 21C40 31 49 17 57 18q-2 18 13 22" className="zh-cover-accent" />
      <path d="M67 57C92 59 105 36 96 25q-2 15-18 17 9-16-1-25-2 16-12 23" className="zh-cover-secondary" />
      <path d="M59 45q-4-15 4-18l8 3 1 8-9 4 6 19q10 13-2 22-10 7-17-1" className="zh-cover-paper" />
      <path d="m71 31 12 3-12 3m-9-10-3-8m6 9 1-10M64 82q-25 6-30 23 19-5 25-16m5-6q-3 20 8 26 6-17-3-27m0 0q18 3 25 18-17-1-25-11" className="zh-cover-accent" />
      <path d="m37 40 17 12m33-13-12 13M35 103l23-17m11 17-4-17m23 11-18-12" className="zh-cover-gold-line" />
      <path d="m61 65-13 8-6 7m27-14 10 7 4 6" />
      <path d="M28 23q2 23 28 29C37 47 34 33 28 23Zm68 2Q91 49 72 53q21-2 24-28ZM61 83q-24 6-27 22 12-15 27-22Zm8 1q14 1 25 16-13-9-25-16Z" className="zh-cover-brush" />
    </>
  ),
  "home-cooking": () => (
    <>
      <path d="M29 61q-8-20-16-10-8 13 16 25m62-15q8-20 16-10 8 13-16 25" className="zh-cover-secondary" />
      <path d="M27 61h66v16q0 20-33 20T27 77Z" className="zh-cover-accent" />
      <path d="M34 94v12h8l4-11m28 0 4 11h8V94" className="zh-cover-secondary" />
      <ellipse cx="60" cy="61" rx="33" ry="9" className="zh-cover-paper" />
      <path d="m40 59 9-8 10 8m2 0 8-8 10 8M34 72h18v9H41v-5h6m39-4H68v9h11v-5h-6M55 72h10v6h-3v9l-2 4-2-4v-9h-3Z" />
      <path d="M45 45q-17-18 3-21 13-2 10 9m3 8q-2-16 15-16 17 1 10 13M60 49q-8-8 1-13" className="zh-cover-mist" />
      <path d="m32 107 9-2m38 0 9 2" />
      <path d="M28 70q1 21 25 24-28 0-25-24Zm64 0q-1 21-25 24 28 0 25-24Z" className="zh-cover-brush" />
    </>
  ),
  "business": () => (
    <>
      <circle cx="81" cy="31" r="16" className="zh-cover-secondary" stroke="none" />
      <path d="M58 24v65m0-58Q34 40 29 76h28Zm7 7q23 7 26 35H65Z" className="zh-cover-paper" />
      <path d="M58 40 45 43m13 7-20 4m20 6-24 4m24 6-27 3m34-26 12 3m-12 7 19 3m-19 5 23 3M58 22l13 3-13 6" className="zh-cover-accent" />
      <path d="M18 82q40 12 84-5l-13 22H33Z" className="zh-cover-accent" />
      <path d="M31 92q30 6 60-2m-71 14q11-6 20 0 10-6 20 0 10-6 20 0 10-6 20 0" className="zh-cover-mist" />
      <path d="M22 71q8 4 16 0l-3 9H25Zm55 2q8 4 16 0l-3 8H80Z" className="zh-cover-secondary" />
      <path d="M19 82q38 12 82-5-42 19-77 9Zm12-9q4-24 24-39-15 16-24 39Z" className="zh-cover-brush" />
    </>
  ),
}
