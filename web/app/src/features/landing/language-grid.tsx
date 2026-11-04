import { LanguageCard } from "@/features/landing/language-card"
import { LANDING_LANGUAGES } from "@/lib/landing/languages"

export function LanguageGrid() {
  return (
    <section aria-labelledby="languages-heading" className="w-full">
      <h2 id="languages-heading" className="sr-only">
        Chọn ngôn ngữ học
      </h2>
      <ul className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
        {LANDING_LANGUAGES.map((language, index) => (
          <li key={language.code}>
            <LanguageCard language={language} index={index} />
          </li>
        ))}
      </ul>
    </section>
  )
}
