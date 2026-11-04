/** Grammar tab — content document (matches docs/design/fixtures/grammar-units-en.sample.json). */

export type GrammarBilingualExample = {
  en: string
  vi: string
}

export type GrammarSectionTable = {
  kind: "table"
  heading: string
  head: string[]
  rows: string[][]
}

export type GrammarSectionUsage = {
  kind: "usage"
  heading: string
  items: Array<{
    use: string
    examples: GrammarBilingualExample[]
  }>
}

export type GrammarSectionExplain = {
  kind: "explain"
  heading: string
  bullets: string[]
}

export type GrammarSectionFormula = {
  kind: "formula"
  heading: string
  rows: Array<{
    label: string
    formula: string
    example?: GrammarBilingualExample
  }>
}

export type GrammarSection =
  | GrammarSectionTable
  | GrammarSectionUsage
  | GrammarSectionExplain
  | GrammarSectionFormula

export type GrammarPointLesson = {
  type: "lesson"
  title: string
  /** HTML subset: <b> for emphasis in UI. */
  intro: string
  sections: GrammarSection[]
  example: string
  content: string
}

export type GrammarPointContent = {
  type: "content"
  title: string
  intro: string
  sections: GrammarSection[]
  example: string
  /** Plain text or light markdown; may use \\n bullets. */
  content: string
}

export type GrammarPoint = GrammarPointLesson | GrammarPointContent

export type GrammarUnit = {
  moduleId: string
  unitId: string
  points: GrammarPoint[]
}

export type GrammarUnitsDocument = {
  units: GrammarUnit[]
}
