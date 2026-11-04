import { EnglishFeatureCard } from "@/features/english/english-feature-card"
import type { LanguageHubCode } from "@/lib/learn/hub"
import { getLanguageFeatures } from "@/lib/learn/features"

type EnglishFeatureGridProps = {
  language: LanguageHubCode
}

export function EnglishFeatureGrid({ language }: EnglishFeatureGridProps) {
  const features = getLanguageFeatures(language)

  return (
    <ul className="english-feature-grid grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
      {features.map((feature, index) => (
        <li key={feature.id} className="min-h-0">
          <EnglishFeatureCard feature={feature} language={language} index={index} />
        </li>
      ))}
    </ul>
  )
}
