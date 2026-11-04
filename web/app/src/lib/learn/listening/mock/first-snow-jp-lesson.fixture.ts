import { createLocalizedFirstSnowFixture } from "@/lib/learn/listening/mock/create-localized-first-snow-fixture"

export const FIRST_SNOW_JP_MOCK_AUDIO_URL =
  "/listening/mock/jp/lessons/the-cranes-reward/audio.mp3"

/** Same timing as EN mock; transcripts are space-separated for dictation. */
const JP_TRANSCRIPTS = [
  "今日 は 十一月 二十六日 です。",
  "今日 は 一日中 雪 が 降り ました。",
  "雪 は きれい です。",
  "雪 は やっと 止み ました。",
  "姉 と 私 は わくわく してい ます。",
  "母 は 雪 が 好き では あり ません。",
  "母 は 私道 の 雪 を 除雪 し なけれ ば なり ません。",
  "姉 と 私 は 外 で 遊べ ます。",
  "私 は 帽子 と 手袋 を 着け ます。",
  "母 は 私 に マフラー を 巻い て くれ ます。",
  "母 は 私 の ジャケット の ファスナー を 上げ ます。",
  "姉 は 彼女 の 帽子 と 手袋 を 着け ます。",
  "母 は 彼女 の マフラー を 巻き ます。",
  "母 は 彼女 の ジャケット の ファスナー を 上げ ます。",
  "姉 と 私 は 外 に 出 ます。",
  "私 たち は 雪だるま を 作り 始め ます。",
  "母 は 雪 かき を 始め ます。",
  "姉 と 私 は 雪 天使 を 作り ます。",
  "姉 と 私 は 雪玉 を 投げ ます。",
  "また 雪 が 降り 始め ます。",
  "私 たち は 中 に 入っ て ホット チョコレート を 飲み ます。",
]

export const FIRST_SNOW_JP_LESSON_FIXTURE = createLocalizedFirstSnowFixture({
  languageCode: "jp",
  title: "つるの恩返し",
  slug: "the-cranes-reward",
  sectionId: "section-jp-folk-tales-1",
  categorySlug: "folk-tales",
  categoryName: "Folk tales",
  audioUrl: FIRST_SNOW_JP_MOCK_AUDIO_URL,
  transcripts: JP_TRANSCRIPTS,
  properNamesFirstSentence: ["十一月"],
})
