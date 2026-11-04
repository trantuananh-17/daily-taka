import type { ListeningLessonDetailFixture } from "@/lib/learn/listening/mock/first-snow-fall-lesson.fixture"
import { FIRST_SNOW_FALL_LESSON_FIXTURE } from "@/lib/learn/listening/mock/first-snow-fall-lesson.fixture"

type LocalizedFirstSnowOptions = {
  languageCode: string
  title: string
  slug: string
  sectionId: string
  categorySlug: string
  categoryName: string
  audioUrl: string
  transcripts: string[]
  properNamesFirstSentence?: string[]
}

export function createLocalizedFirstSnowFixture(
  options: LocalizedFirstSnowOptions,
): ListeningLessonDetailFixture {
  const base = FIRST_SNOW_FALL_LESSON_FIXTURE
  if (options.transcripts.length !== base.sentences.length) {
    throw new Error("Localized first-snow transcripts must match EN sentence count")
  }

  return {
    ...base,
    lesson: {
      ...base.lesson,
      slug: options.slug,
      title: options.title,
      language_code: options.languageCode,
      section_id: options.sectionId,
      category_slug: options.categorySlug,
      category_name: options.categoryName,
      audio_url: options.audioUrl,
      path: `/lessons/${options.categorySlug}/${options.sectionId}/${options.slug}`,
    },
    sentences: base.sentences.map((row, index) => {
      const transcript = options.transcripts[index] ?? row.transcript
      const properNames =
        index === 0 && options.properNamesFirstSentence?.length
          ? options.properNamesFirstSentence
          : (row.metadata.properNames ?? [])
      return {
        ...row,
        transcript,
        metadata: {
          ...row.metadata,
          properNames,
          ipa: undefined,
        },
      }
    }),
    nextLesson: base.nextLesson
      ? {
          ...base.nextLesson,
          categoryName: options.categoryName,
        }
      : null,
  }
}
