import { FlagCn } from "@/components/icons/flag-cn"
import { FlagJp } from "@/components/icons/flag-jp"
import { FlagUk } from "@/components/icons/flag-uk"
import type { LanguageFlag } from "@/lib/landing/languages"

export function LanguageFlag({ flag }: { flag: LanguageFlag }) {
  switch (flag.kind) {
    case "uk-svg":
      return <FlagUk />
    case "cn-svg":
      return <FlagCn />
    case "jp-svg":
      return <FlagJp />
  }
}
