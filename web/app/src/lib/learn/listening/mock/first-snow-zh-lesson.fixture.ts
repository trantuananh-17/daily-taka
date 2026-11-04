import { createLocalizedFirstSnowFixture } from "@/lib/learn/listening/mock/create-localized-first-snow-fixture"

export const FIRST_SNOW_ZH_MOCK_AUDIO_URL =
  "/listening/mock/zh/lessons/first-snow/audio.mp3"

const ZH_TRANSCRIPTS = [
  "今天 是 十一月 二十六日。",
  "今天 一整天 都 在 下雪。",
  "雪 很 漂亮。",
  "雪 终于 停了。",
  "姐姐 和 我 很 兴奋。",
  "妈妈 不 喜欢 雪。",
  "妈妈 必须 铲 车道 上 的 雪。",
  "姐姐 和 我 可以 出去玩。",
  "我 戴上 帽子 和 手套。",
  "妈妈 给 我 围 围巾。",
  "妈妈 给 我 拉 上 外套 的 拉链。",
  "姐姐 戴上 她的 帽子 和 手套。",
  "妈妈 围 上 她的 围巾。",
  "妈妈 给 她 拉 上 外套 的 拉链。",
  "姐姐 和 我 走到 外面。",
  "我们 开始 堆 雪人。",
  "妈妈 开始 铲 雪。",
  "姐姐 和 我 做 雪 天使。",
  "姐姐 和 我 打 雪球。",
  "又 开始 下雪 了。",
  "我们 进 屋里 喝 热 巧克力。",
]

export const FIRST_SNOW_ZH_LESSON_FIXTURE = createLocalizedFirstSnowFixture({
  languageCode: "zh",
  title: "初雪",
  slug: "first-snow",
  sectionId: "section-zh-short-stories-1",
  categorySlug: "short-stories",
  categoryName: "Short Stories",
  audioUrl: FIRST_SNOW_ZH_MOCK_AUDIO_URL,
  transcripts: ZH_TRANSCRIPTS,
  properNamesFirstSentence: ["十一月"],
})
