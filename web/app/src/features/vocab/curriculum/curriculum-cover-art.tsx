import {
  Atom,
  BookOpen,
  CheckCircle2,
  Compass,
  Flag,
  Flower2,
  GraduationCap,
  Headphones,
  Leaf,
  MapPin,
  Microscope,
  Palette,
  Plane,
  Target,
} from "lucide-react"
import type { ReactNode } from "react"

import type { LanguageHubCode } from "@/lib/learn/hub"
import type { CurriculumLevelCover } from "@/lib/learn/curriculum-level"
import type { VocabScene } from "@/lib/learn/vocab/types"

type CurriculumCoverArtProps = {
  level: CurriculumLevelCover
  language: LanguageHubCode
}

function Wash({ backdrop }: { backdrop: number }) {
  switch (backdrop) {
    case 0:
      return <circle cx="166" cy="84" r="69" />
    case 1:
      return <rect x="95" y="13" width="140" height="142" rx="65" />
    case 2:
      return <path d="M87 148V83a77 77 0 0 1 154 0v65Z" />
    case 3:
      return <ellipse cx="165" cy="87" rx="91" ry="58" />
    case 4:
      return <path d="M82 123 124 22l97 12 35 103-111 22Z" />
    case 5:
      return (
        <>
          <circle cx="133" cy="83" r="60" />
          <circle cx="207" cy="106" r="47" />
        </>
      )
    case 6:
      return <rect x="89" y="21" width="150" height="132" rx="30" transform="rotate(-8 164 87)" />
    case 7:
      return <path d="M91 137C48 60 124 1 176 28s105 25 72 91-132 55-157 18Z" />
    default:
      return <circle cx="166" cy="84" r="69" />
  }
}

function Deco({ language }: { language: LanguageHubCode }) {
  if (language === "jp") {
    return (
      <g stroke="currentColor" opacity=".16">
        <path d="M0 180a32 32 0 0 1 64 0m-56 0a24 24 0 0 1 48 0m-48 0a32 32 0 0 1 64 0m-56 0a24 24 0 0 1 48 0M256 180a32 32 0 0 1 64 0m-56 0a24 24 0 0 1 48 0" />
        <circle cx="264" cy="36" r="12" fill="var(--art-accent)" stroke="none" />
      </g>
    )
  }
  if (language === "zh") {
    return (
      <g stroke="currentColor" opacity=".22">
        <path d="M24 54V24h30m212 132h30v-30M242 36h24a7 7 0 1 0-7-7m-25 7h-10" />
        <circle cx="165" cy="84" r="77" />
      </g>
    )
  }
  return (
    <g stroke="currentColor" opacity=".2">
      <path d="M42 50h20m-10-10v20M262 121h16m-8-8v16" />
      <circle cx="269" cy="42" r="5" />
    </g>
  )
}

function Detail({ layout }: { layout: number }) {
  if (layout === 2) {
    return (
      <g className="curriculum-detail" stroke="currentColor" opacity=".28" strokeWidth="1" fill="none">
        <path d="m42 83 14-14 14 14-14 14Z" />
      </g>
    )
  }
  if (layout === 1 || layout === 7) {
    return (
      <g className="curriculum-detail" stroke="currentColor" opacity=".28" strokeWidth="1" fill="none">
        <circle cx="272" cy="119" r="16" />
        <circle cx="272" cy="119" r="9" />
      </g>
    )
  }
  if (layout === 5) {
    return (
      <g className="curriculum-detail" stroke="currentColor" opacity=".28" strokeWidth="1" fill="none">
        <path d="m42 83 14-14 14 14-14 14Z" />
      </g>
    )
  }
  return (
    <g className="curriculum-detail" stroke="currentColor" opacity=".28" strokeWidth="1" fill="none">
      <path d="M32 111h35m-28 9h23m-18 9h13" />
    </g>
  )
}

function topicBadgeTransform(layout: number): string {
  if (layout === 0) return "translate(246 106)"
  if (layout === 4 || layout === 6) return "translate(246 49)"
  if (layout === 2) return "translate(246 106)"
  if (layout === 5 || layout === 7) return "translate(44 49)"
  return "translate(44 106)"
}

function TopicBadge({ scene, layout }: { scene: VocabScene; layout: number }) {
  const rx = layout === 0 || layout === 2 || layout === 6 ? 17 : 10
  const transform = topicBadgeTransform(layout)
  const iconMap: Record<VocabScene, ReactNode> = {
    learning: <BookOpen width={20} height={20} strokeWidth={1.3} x={-10} y={-10} />,
    travel: <MapPin width={20} height={20} strokeWidth={1.3} x={-10} y={-10} />,
    culture: <Flower2 width={20} height={20} strokeWidth={1.3} x={-10} y={-10} />,
    nature: <Compass width={20} height={20} strokeWidth={1.3} x={-10} y={-10} />,
    science: <Atom width={20} height={20} strokeWidth={1.3} x={-10} y={-10} />,
    goals: <Target width={20} height={20} strokeWidth={1.3} x={-10} y={-10} />,
    food: <Leaf width={20} height={20} strokeWidth={1.3} x={-10} y={-10} />,
    time: <CheckCircle2 width={20} height={20} strokeWidth={1.3} x={-10} y={-10} />,
    music: <Headphones width={20} height={20} strokeWidth={1.3} x={-10} y={-10} />,
  }
  return (
    <g className="curriculum-topic-detail" transform={transform}>
      <rect x="-17" y="-17" width="34" height="34" rx={rx} fill="var(--art-paper)" opacity=".9" />
      {iconMap[scene]}
    </g>
  )
}

function Scene({
  scene,
  language,
  artwork,
}: {
  scene: VocabScene
  language: LanguageHubCode
  artwork: string
}) {
  const isWriting = artwork.startsWith("writing/")

  switch (scene) {
    case "learning":
      if (isWriting && language === "jp") {
        return (
          <g transform="translate(24 0)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M91 54q34-13 70 3 36-16 70-3v88q-35-10-70 3-35-13-70-3Z" fill="var(--art-paper)" />
            <path d="M161 58v86M105 77h37m-37 13h29m46 27h34m-34 11h24" opacity=".35" />
            <GraduationCap width={38} height={38} strokeWidth={1.5} x={176} y={68} />
            <path d="m118 40 8-13 8 13v62l-8 9-8-9Z" fill="var(--art-accent)" stroke="none" />
          </g>
        )
      }
      if (isWriting && language === "zh") {
        return (
          <g transform="translate(20 0)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="112" y="37" width="105" height="116" rx="9" fill="var(--art-paper)" />
            <path d="M129 38v114M146 126h52m-52 12h36" opacity=".4" />
            <GraduationCap width={46} height={46} strokeWidth={1.4} x={145} y={62} />
            <path d="M194 37v24l-8-5-8 5V37" fill="var(--art-accent)" stroke="none" />
          </g>
        )
      }
      if (isWriting && language === "en") {
        return (
          <g transform="translate(15 0)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M100 131h124v23H100a11 11 0 0 1 0-23Zm6-27h112v24H106a12 12 0 0 1 0-24Z" fill="var(--art-paper)" />
            <path d="M117 102V48h88v54" fill="var(--art-paper)" />
            <GraduationCap width={35} height={35} strokeWidth={1.5} x={143} y={57} />
            <path d="M112 141h96m-89-24h89M127 48v53" opacity=".3" />
          </g>
        )
      }
      return (
        <g transform="translate(-22 0)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M100 131h124v23H100a11 11 0 0 1 0-23Zm6-27h112v24H106a12 12 0 0 1 0-24Z" fill="var(--art-paper)" />
          <path d="M117 102V48h88v54" fill="var(--art-paper)" />
          <GraduationCap width={35} height={35} strokeWidth={1.5} x={143} y={57} />
          <path d="M112 141h96m-89-24h89M127 48v53" opacity=".3" />
        </g>
      )
    case "travel":
      return (
        <g
          transform={isWriting && language === "jp" ? "translate(0 0)" : "translate(20 0)"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="205" cy="48" r="17" fill="var(--art-accent)" stroke="none" />
          <path d="m60 143 63-80 37 43 28-25 69 62Z" fill="var(--art-wash)" stroke="none" />
          <path d="m70 144 55-70 20 25m40 44 37-35 35 35" opacity=".3" />
          <path d="M123 150c20-30 55-16 59-43" stroke="var(--art-paper)" strokeWidth="9" />
          <rect x="130" y="57" width="62" height="62" rx="20" fill="var(--art-paper)" />
          <Plane width={36} height={36} strokeWidth={1.6} x={143} y={70} />
        </g>
      )
    case "culture":
      return (
        <g transform="translate(6 0)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="99" y="40" width="130" height="107" rx="16" fill="var(--art-paper)" />
          <path d="M99 63h130" opacity=".2" />
          <circle cx="112" cy="52" r="2" fill="currentColor" stroke="none" />
          <circle cx="121" cy="52" r="2" fill="currentColor" stroke="none" opacity=".4" />
          <Palette width={49} height={49} strokeWidth={1.4} x={139} y={76} />
          <path d="M121 135h83" opacity=".15" />
          <rect x="210" y="116" width="27" height="34" rx="7" fill="var(--art-accent)" stroke="none" />
        </g>
      )
    case "nature":
      return (
        <g transform="translate(24 0)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M139 113h48l-7 40h-34Z" fill="var(--art-paper)" />
          <path
            d="M163 113V57m0 27c-28 0-36-13-34-30 25 1 34 12 34 30Zm0 14c28 0 36-13 34-30-25 1-34 12-34 30Z"
            fill="var(--art-accent)"
          />
        </g>
      )
    case "science":
      return (
        <g transform="translate(20 0)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="99" y="40" width="130" height="107" rx="16" fill="var(--art-paper)" />
          <path d="M99 63h130" opacity=".2" />
          <circle cx="112" cy="52" r="2" fill="currentColor" stroke="none" />
          <circle cx="121" cy="52" r="2" fill="currentColor" stroke="none" opacity=".4" />
          <Microscope width={49} height={49} strokeWidth={1.4} x={139} y={76} />
          <path d="M121 135h83" opacity=".15" />
          <rect x="210" y="116" width="27" height="34" rx="7" fill="var(--art-accent)" stroke="none" />
        </g>
      )
    case "goals":
      return (
        <g transform="translate(15 0)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="99" y="40" width="130" height="107" rx="16" fill="var(--art-paper)" />
          <path d="M99 63h130" opacity=".2" />
          <circle cx="112" cy="52" r="2" fill="currentColor" stroke="none" />
          <circle cx="121" cy="52" r="2" fill="currentColor" stroke="none" opacity=".4" />
          <Flag width={49} height={49} strokeWidth={1.4} x={139} y={76} />
          <path d="M121 135h83" opacity=".15" />
          <rect x="210" y="116" width="27" height="34" rx="7" fill="var(--art-accent)" stroke="none" />
        </g>
      )
    case "food":
      if (isWriting) {
        return (
          <g transform="translate(20 0)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="163" cy="100" rx="67" ry="49" fill="var(--art-paper)" />
            <ellipse cx="163" cy="100" rx="50" ry="34" opacity=".4" />
            <path d="M144 111c-29-23 4-43 19-13 21-34 49-4 12 16Z" fill="var(--art-accent)" stroke="none" />
            <path d="M83 63v71m-8-71v22h16V63m158 0v71m0-71q20 25 0 39" />
          </g>
        )
      }
      return (
        <g transform="translate(-18 0)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="163" cy="150" rx="72" ry="8" fill="var(--art-accent)" opacity=".3" stroke="none" />
          <path d="M99 94h128c-4 36-27 54-64 54S103 130 99 94Z" fill="var(--art-paper)" />
          <path d="M110 104h106M145 150h36" opacity=".4" />
          <path d="m155 79 72-43m-61 48 72-42" strokeWidth="3" />
        </g>
      )
    case "time":
      return (
        <g transform="translate(6 0)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="163" cy="95" r="54" fill="var(--art-paper)" />
          <path d="M163 54v8m41 33h-8m-33 41v-8m-41-33h8M163 72v25l19 11" />
          <path d="m129 44-12-8m80 8 12-8" strokeWidth="6" />
        </g>
      )
    case "music":
      return (
        <g
          transform={isWriting ? "translate(-22 0)" : "translate(6 0)"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="103" y="48" width="120" height="98" rx="15" fill="var(--art-paper)" />
          <circle cx="143" cy="94" r="28" fill="var(--art-accent)" stroke="none" />
          <circle cx="143" cy="94" r="17" />
          <circle cx="143" cy="94" r="4" />
          <path d="M185 78h22m-22 11h22m-22 11h22m-11 16v9m-5-4h10M118 148v7m90-7v7M145 46l52-20" />
        </g>
      )
    default:
      return null
  }
}

export function CurriculumCoverArt({ level, language }: CurriculumCoverArtProps) {
  return (
    <svg viewBox="0 0 320 180" fill="none" focusable="false">
      <ellipse cx="166" cy="159" rx="105" ry="9" fill="currentColor" opacity=".09" />
      <g fill="var(--art-wash)">
        <Wash backdrop={level.backdrop} />
      </g>
      <Detail layout={level.layout} />
      <Deco language={language} />
      <g className="curriculum-scene">
        <Scene scene={level.scene} language={language} artwork={level.artwork} />
      </g>
      <TopicBadge scene={level.scene} layout={level.layout} />
      <text x="24" y="31" fill="currentColor" opacity=".48" fontSize="13" fontFamily="serif">
        {level.glyph}
      </text>
    </svg>
  )
}
