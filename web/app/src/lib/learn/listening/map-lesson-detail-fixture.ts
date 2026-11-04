import type { DictationLessonDetail, DictationSentence, DictationGradingDefaults } from "@/lib/learn/listening/types"
import type { ListeningLesson } from "@/lib/learn/listening/types"

import type { ListeningLessonDetailFixture } from "./mock/first-snow-fall-lesson.fixture"
import { formatDictationSegmentDuration } from "./dictation-time"

export function mapListeningLessonDetailFixture(
  fixture: ListeningLessonDetailFixture,
  catalogLesson: ListeningLesson,
  categorySlug: string,
  categoryName: string,
  nextLesson: DictationLessonDetail["nextLesson"],
): DictationLessonDetail {
  const gradingDefaults: DictationGradingDefaults = fixture.lesson.dictation_grading_defaults ?? {
    ignoreCase: true,
    ignorePunctuation: true,
  }

  const sentences: DictationSentence[] = fixture.sentences.map((row) => {
    const segmentMs = row.end_ms - row.start_ms
    const properNames = row.metadata.properNames ?? []
    return {
      id: row.id,
      index: row.position,
      transcript: row.transcript,
      startMs: row.start_ms,
      endMs: row.end_ms,
      durationLabel: formatDictationSegmentDuration(segmentMs),
      properNouns: properNames.length > 0 ? properNames : undefined,
      grading: row.metadata.grading,
      metadata: {
        ipa: row.metadata.ipa,
        confidence: row.metadata.confidence,
      },
    }
  })

  return {
    lesson: catalogLesson,
    categorySlug,
    categoryName,
    sectionTitle: fixture.lesson.section_title,
    audioUrl: fixture.lesson.audio_url,
    durationMs: fixture.lesson.duration_ms,
    gradingDefaults,
    sentences,
    nextLesson,
  }
}
