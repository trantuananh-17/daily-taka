/**
 * One-shot helper: merge cover themes + copy into listen category mocks.
 * Run from web/app: node scripts/apply-listen-cover-themes.mjs
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const mockDir = path.join(__dirname, "../src/lib/learn/listening/mock")
const themesDir = path.join(mockDir, "cover-themes")

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(mockDir, name), "utf8"))
}

function readTheme(name) {
  return JSON.parse(fs.readFileSync(path.join(themesDir, name), "utf8"))
}

function writeJson(name, data) {
  fs.writeFileSync(path.join(mockDir, name), `${JSON.stringify(data, null, 2)}\n`)
}

const jpThemes = readTheme("jp.json")
const zhThemes = readTheme("zh.json")
const enToneThemes = readTheme("en-by-tone.json")
const jpDesc = readTheme("jp-descriptions.json")
const zhDesc = readTheme("zh-descriptions.json")

function patchRows(rows, variant, themes, descriptions) {
  return rows.map((row) => ({
    ...row,
    descriptionVi: descriptions[row.slug] ?? row.descriptionVi,
    cover: {
      variant,
      topicKey: row.slug,
      theme: themes[row.slug],
    },
  }))
}

const jp = readJson("jp-categories.json")
jp.rows = patchRows(jp.rows, "jp", jpThemes, jpDesc)
writeJson("jp-categories.json", jp)

const zh = readJson("zh-categories.json")
zh.rows = patchRows(zh.rows, "zh", zhThemes, zhDesc)
writeJson("zh-categories.json", zh)

const en = readJson("en-categories.json")
en.rows = en.rows.map((row) => {
  const legacy = row.cover ?? {}
  const tone = legacy.tone ?? "sage"
  const topicKey = legacy.artKey ?? row.slug
  return {
    ...row,
    cover: {
      variant: "en",
      topicKey,
      theme: enToneThemes[tone] ?? enToneThemes.sage,
    },
  }
})
writeJson("en-categories.json", en)

console.log("Updated en/zh/jp category mocks with locale cover themes.")
