import type { ReactNode } from "react"

export const JP_TOPIC_ARTS: Record<string, () => ReactNode> = {
  "anime": () => (
    <>
      <path d="M22 29 83 24l9 73-61 7Z" className="jp-cover-secondary" />
      <rect x="25" y="25" width="69" height="73" rx="9" className="jp-cover-paper" />
      <path d="M38 64V49a22 22 0 0 1 44 0v17L72 56l-8 6-9-13-8 14-9-5Z" className="jp-cover-accent" />
      <path d="M40 60v13a20 20 0 0 0 40 0V60" className="jp-cover-paper" />
      <path d="m47 69 7-2m12 0 7 2M56 81q5 4 10-1" />
      <ellipse cx="51" cy="72" rx="2.5" ry="4" className="jp-cover-ink" />
      <ellipse cx="69" cy="72" rx="2.5" ry="4" className="jp-cover-ink" />
      <path d="M18 46h-6m8-10-5-4M96 27l3-7 3 7 7 3-7 3-3 7-3-7-7-3Z" className="jp-cover-secondary" />
    </>
  ),
  "japan-history": () => (
    <>
      <circle cx="84" cy="32" r="14" className="jp-cover-secondary" stroke="none" />
      <path d="M30 99V72h60v27M39 67V48h42v19M48 44V31h24v13" className="jp-cover-paper" />
      <path d="M20 76q40 8 80 0L80 60H40ZM30 50q30 8 60 0L72 36H48ZM40 32q20 6 40 0L60 18Z" className="jp-cover-accent" />
      <path d="M27 101h68M52 99V85h16v14M41 83v6m38-6v6M48 60v6m24-6v6M56 40v6m8-6v6" />
      <path d="m22 100 7-5 6 5m48 0 8-5 7 5" className="jp-cover-secondary" />
    </>
  ),
  "jlpt": () => (
    <>
      <rect x="25" y="24" width="61" height="79" rx="7" transform="rotate(-6 55 64)" className="jp-cover-secondary" />
      <rect x="31" y="24" width="59" height="77" rx="7" className="jp-cover-paper" />
      <path d="M42 24v20l7-4 7 4V24" className="jp-cover-accent" />
      <path d="M64 36h15m-15 7h10M43 57h9v9h-9Zm0 19h9v9h-9ZM60 61h19m-19 19h10" />
      <path d="m43 60 4 4 8-11m-12 26 4 4 8-11" strokeWidth="2.8" />
      <circle cx="87" cy="88" r="14" className="jp-cover-secondary" />
      <path d="m80 88 5 5 9-11" strokeWidth="2.6" />
    </>
  ),
  "kids": () => (
    <>
      <path d="M37 48h46v9q-5 10-17 11v28H54V68q-12-1-17-11Z" className="jp-cover-accent" />
      <path d="M37 48q4 12 13 0m20 0q8 12 13 0M54 96h12v7H54Z" className="jp-cover-secondary" />
      <circle cx="62" cy="30" r="17" className="jp-cover-secondary" />
      <path d="M48 25q12-12 27 1" className="jp-cover-paper" />
      <path d="M76 39q27 21 12 42t-23-9" strokeWidth="1.4" />
      <path d="m23 33 2-6 2 6 6 2-6 2-2 6-2-6-6-2ZM26 84l4-4 4 4-4 4Z" className="jp-cover-paper" />
    </>
  ),
  "music": () => (
    <>
      <path d="m69 21 11 4-19 58-11-4Z" className="jp-cover-ink" />
      <path d="m69 19 12 4 3-10-12-4Z" className="jp-cover-accent" />
      <path d="m69 24-7-2m7 10 8 3m-9 4-8-3" strokeWidth="3" />
      <rect x="31" y="66" width="38" height="35" rx="9" transform="rotate(18 50 83)" className="jp-cover-paper" />
      <path d="m73 22-22 75m19-76L48 96m28-73L54 98" strokeWidth=".9" className="jp-cover-string" />
      <path d="m83 79 10 15-20-1Z" className="jp-cover-secondary" />
      <path d="M25 50V34l12-3v15" />
      <ellipse cx="21" cy="51" rx="5" ry="3.5" className="jp-cover-accent" />
      <ellipse cx="33" cy="47" rx="5" ry="3.5" className="jp-cover-accent" />
    </>
  ),
  "news": () => (
    <>
      <path d="M22 32h66v61a9 9 0 0 0 9 9H31a9 9 0 0 1-9-9Z" className="jp-cover-paper" />
      <path d="M88 48h12v46a8 8 0 0 1-12 0Z" className="jp-cover-accent" />
      <path d="M32 43h44" strokeWidth="4" />
      <path d="M32 51h27m-27 9h14m-14 7h14m-14 7h14M32 87h44m-44 7h31" />
      <rect x="53" y="59" width="24" height="21" rx="3" className="jp-cover-accent" />
      <path d="m57 75 5-5 3 2 7-9" />
      <circle cx="84" cy="27" r="11" className="jp-cover-secondary" />
      <path d="m79 27 3 3 6-6" />
    </>
  ),
  "podcast": () => (
    <>
      <rect x="43" y="26" width="34" height="53" rx="17" className="jp-cover-paper" />
      <path d="M43 52h34v10a17 17 0 0 1-34 0Z" className="jp-cover-accent" />
      <path d="M51 37h18m-18 7h18M34 59v6a26 26 0 0 0 52 0v-6M60 91v12m-16 0h32" />
      <path d="M26 38q-9 13 0 26m-9-32q-14 20 0 38M94 38q9 13 0 26m9-32q14 20 0 38" className="jp-cover-signal" />
      <circle cx="60" cy="66" r="3" className="jp-cover-secondary" />
    </>
  ),
  "business-japanese": () => (
    <>
      <path d="M24 43V29h35v14m5-2V22h29v29" className="jp-cover-accent" />
      <path d="M33 35h15m24-6h12m-12 7h12" />
      <rect x="16" y="48" width="53" height="34" rx="5" transform="rotate(-9 42 65)" className="jp-cover-paper" />
      <rect x="53" y="63" width="51" height="34" rx="5" transform="rotate(8 78 80)" className="jp-cover-secondary" />
      <circle cx="29" cy="61" r="4" className="jp-cover-accent" />
      <path d="m38 58 18-3m-31 15 28-4M64 76l26 4m-27 4 18 3" />
      <path d="m39 97 7 5 9-5m-3-2 3 2-1 4" />
    </>
  ),
  "travel": () => (
    <>
      <circle cx="86" cy="29" r="12" className="jp-cover-secondary" stroke="none" />
      <path d="m20 66 35-44 36 44Z" className="jp-cover-accent" />
      <path d="m41 40 14-18 15 18-11-4-5 5-5-5Z" className="jp-cover-paper" />
      <path d="M29 68q8-19 35-19h12q15 0 20 20l6 25H20Z" className="jp-cover-paper" />
      <path d="M38 62h43l5 14H31Z" className="jp-cover-accent" />
      <path d="M24 84h75M33 100h55m-48-6-6 10m45-10 6 10" />
      <path d="M34 87h7m39 0h7" strokeWidth="3" className="jp-cover-lamp" />
    </>
  ),
  "daily-conversation": () => (
    <>
      <path d="M20 26h43a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H41L28 73V62h-8a8 8 0 0 1-8-8V34a8 8 0 0 1 8-8Z" className="jp-cover-paper" />
      <path d="M73 40h20a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8h-3v9L77 72h-6" className="jp-cover-accent" />
      <path d="M25 40h31m-31 9h19m34 4h11m-11 8h8" />
      <path d="M45 82h29l-3 17H49Z" className="jp-cover-secondary" />
      <path d="M74 84h6a6 6 0 0 1 0 12h-8M40 103h40m-27-28q-5-5 0-10m10 10q-5-5 0-10" />
    </>
  ),
  "folk-tales": () => (
    <>
      <path d="m30 45 2-23 19 13q9-3 18 0l19-13 2 23q8 11 0 28L60 99 30 73q-8-17 0-28Z" className="jp-cover-paper" />
      <path d="m32 23 7 22 12-10m18 0 12 10 7-22M31 54l20 9-15 6m53-15-20 9 15 6" className="jp-cover-accent" />
      <path d="m39 58 11 5m31-5-11 5m-14 11 4 4 4-4-4-3Z" className="jp-cover-ink" />
      <path d="m51 85 9 5 9-5M57 45l3 6 3-6" />
      <path d="m15 78 7 2-2 7-7-2Zm78 6 9 1-1 9-9-1Z" className="jp-cover-secondary" />
    </>
  ),
  "mixing": () => (
    <>
      <rect x="19" y="34" width="47" height="63" rx="6" transform="rotate(-12 42 65)" className="jp-cover-secondary" />
      <rect x="54" y="28" width="44" height="65" rx="6" transform="rotate(12 76 60)" className="jp-cover-accent" />
      <rect x="37" y="37" width="47" height="66" rx="6" className="jp-cover-paper" />
      <path d="m45 69 15 3 15-12-5 15 7 8-15-4-9 10 1-13Z" className="jp-cover-accent" />
      <path d="m45 48 8 5-8 5ZM69 49h8m-4-4v8M24 50l6-2m-5 10 7-2m54-6 7 2m-9 6 7 2" />
    </>
  ),
}
