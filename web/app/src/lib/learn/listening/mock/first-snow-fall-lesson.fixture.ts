/**
 * Frozen API-shaped payload for First Snow Fall (import SRT + package update).
 * Source: admin alignment export — use as contract for future GET lesson detail.
 * Audio file: `public/listening/mock/en/lessons/first-snow-fall/audio.mp3`
 */
export type ListeningLessonSentenceFixture = {
  id: string
  position: number
  start_ms: number
  end_ms: number
  transcript: string
  metadata: {
    ipa?: string
    confidence?: number
    properNames?: string[]
    /** When set, overrides lesson defaults for dictation grading UI + check. */
    grading?: {
      ignoreCase?: boolean
      ignorePunctuation?: boolean
    }
  }
}

export type ListeningLessonDetailFixture = {
  lesson: {
    id: string
    slug: string
    level: string
    title: string
    metadata: Record<string, string>
    audio_key: string
    media_type: string
    section_id: string
    description: string | null
    duration_ms: number
    templateType: string
    category_name: string
    category_slug: string
    language_code: string
    section_title: string
    thumbnail_key: string | null
    section_number: number
    sentence_count: number
    youtube_video_id: string | null
    path: string
    media: { type: string; key: string }
    audio_url: string
    /** Lesson-wide defaults; per-sentence metadata.grading may override. */
    dictation_grading_defaults?: {
      ignoreCase: boolean
      ignorePunctuation: boolean
    }
  }
  sentences: ListeningLessonSentenceFixture[]
  nextLesson: {
    id: string
    name: string
    path: string
    categoryName: string
    sectionTitle: string
    level: string
    sentenceCount: number
  } | null
}

/** Public mock URL (replaces R2 + `/api/listening/audio/...` until backend ships). */
export const FIRST_SNOW_FALL_MOCK_AUDIO_URL =
  "/listening/mock/en/lessons/first-snow-fall/audio.mp3"

export const FIRST_SNOW_FALL_LESSON_FIXTURE: ListeningLessonDetailFixture = {
  lesson: {
    id: "b5111744-6823-4965-aa7b-970869a0f134",
    slug: "first-snow-fall",
    level: "A1",
    title: "First Snow Fall",
    metadata: {
      importMode: "srt",
      lastImportMode: "package_update",
      sourceFilename: "01_First Snow Fall.mp3",
      alignmentProvider: "standard-srt",
    },
    audio_key:
      "listening/en/lessons/b5111744-6823-4965-aa7b-970869a0f134/audio-0c384571-287d-4c8d-b8ab-c8385ce01d0b.mp3",
    media_type: "r2_audio",
    section_id: "section-en-short-stories-1",
    description: null,
    duration_ms: 67082,
    templateType: "audio",
    category_name: "Short Stories",
    category_slug: "short-stories",
    language_code: "en",
    section_title: "Section 1",
    thumbnail_key: null,
    section_number: 1,
    sentence_count: 21,
    youtube_video_id: null,
    path: "/lessons/short-stories/section-en-short-stories-1/first-snow-fall",
    media: {
      type: "r2_audio",
      key: "listening/en/lessons/b5111744-6823-4965-aa7b-970869a0f134/audio-0c384571-287d-4c8d-b8ab-c8385ce01d0b.mp3",
    },
    audio_url: FIRST_SNOW_FALL_MOCK_AUDIO_URL,
    dictation_grading_defaults: {
      ignoreCase: true,
      ignorePunctuation: true,
    },
  },
  sentences: [
    {
      id: "ef9d4d14-ffe3-416c-93c7-9dff437a7f87",
      end_ms: 5620,
      metadata: { ipa: "təˈdeɪ ɪz noʊˈvɛmbɚ ˈtwɛntisɪksθ", confidence: 1, properNames: ["November"] },
      position: 1,
      start_ms: 3600,
      transcript: "Today is November 26th.",
    },
    {
      id: "95860c68-15b4-4735-8785-090ab0f4d0a9",
      end_ms: 8180,
      metadata: { ipa: "ɪt snoʊd ɔl deɪ təˈdeɪ", confidence: 1, properNames: [] },
      position: 2,
      start_ms: 6300,
      transcript: "It snowed all day today.",
    },
    {
      id: "0fd30999-7f20-425d-8283-e4e6ffbfde61",
      end_ms: 10760,
      metadata: { ipa: "ðə snoʊ ɪz ˈbjutəfəl", confidence: 1, properNames: [] },
      position: 3,
      start_ms: 8970,
      transcript: "The snow is beautiful.",
    },
    {
      id: "e5e61fe8-c386-4db5-8354-ef6c32c8fe0c",
      end_ms: 13500,
      metadata: { ipa: "ðə snoʊ ˈfaɪnəli stɑpt", confidence: 1, properNames: [] },
      position: 4,
      start_ms: 11750,
      transcript: "The snow finally stopped.",
    },
    {
      id: "e8a7af89-ab89-464a-bfa5-10164c149ff9",
      end_ms: 16880,
      metadata: { ipa: "maɪ ˈsɪstɚ ənd aɪ ɑɹ ɪkˈsaɪtəd", confidence: 1, properNames: [] },
      position: 5,
      start_ms: 15020,
      transcript: "My sister and I are excited.",
    },
    {
      id: "30ff9406-25f8-466a-8814-9c9085697fd6",
      end_ms: 19800,
      metadata: { ipa: "maɪ mɑm ˈdʌzənt laɪk ðə snoʊ", confidence: 1, properNames: [] },
      position: 6,
      start_ms: 17840,
      transcript: "My Mom doesn't like the snow.",
    },
    {
      id: "29919bf5-4a56-4647-94e7-5e7f466e6289",
      end_ms: 22970,
      metadata: { ipa: "maɪ mɑm hæz tu ˈʃʌvəl ðə dɹaɪv weɪ", confidence: 1, properNames: [] },
      position: 7,
      start_ms: 20750,
      transcript: "My Mom has to shovel the drive way.",
    },
    {
      id: "0f215c86-81fd-4c22-9aca-921fb6a9891d",
      end_ms: 25880,
      metadata: { ipa: "maɪ ˈsɪstɚ ənd aɪ ɡɛt tu pleɪ", confidence: 1, properNames: [] },
      position: 8,
      start_ms: 23950,
      transcript: "My sister and I get to play.",
    },
    {
      id: "44dd71c2-e91d-44b8-9d22-9c32ca8bec8c",
      end_ms: 29120,
      metadata: { ipa: "aɪ pʊt ɑn maɪ hæt ənd ˈmɪtənz", confidence: 1, properNames: [] },
      position: 9,
      start_ms: 27010,
      transcript: "I put on my hat and mittens.",
    },
    {
      id: "68b92ba4-cc5c-48b5-bd5c-20ed486ed92c",
      end_ms: 31510,
      metadata: { ipa: "maɪ mɑm pʊts ɑn maɪ skɑɹf", confidence: 1, properNames: [] },
      position: 10,
      start_ms: 29840,
      transcript: "My Mom puts on my scarf.",
    },
    {
      id: "f4a19cef-8982-48d5-a53b-20c4ac9058b4",
      end_ms: 34440,
      metadata: { ipa: "maɪ mɑm ˈzɪpɚz maɪ ˈdʒækət", confidence: 1, properNames: [] },
      position: 11,
      start_ms: 32520,
      transcript: "My Mom zippers my jacket.",
    },
    {
      id: "18a5833f-1c89-425a-bb83-35fb7e661652",
      end_ms: 37960,
      metadata: { ipa: "maɪ ˈsɪstɚ pʊts ɑn hɝ hæt ənd ˈmɪtənz", confidence: 1, properNames: [] },
      position: 12,
      start_ms: 35250,
      transcript: "My sister puts on her hat and mittens.",
    },
    {
      id: "367e59ae-9f14-4537-960b-522e2e9dbdbe",
      end_ms: 40790,
      metadata: { ipa: "maɪ mɑm pʊts ɑn hɝ skɑɹf", confidence: 1, properNames: [] },
      position: 13,
      start_ms: 38830,
      transcript: "My Mom puts on her scarf.",
    },
    {
      id: "171e8ddb-7322-4d3f-b998-9e6d9639b3d3",
      end_ms: 43820,
      metadata: { ipa: "maɪ mɑm ˈzɪpɚz hɝ ˈdʒækət", confidence: 1, properNames: [] },
      position: 14,
      start_ms: 41900,
      transcript: "My Mom zippers her jacket.",
    },
    {
      id: "6b707769-3570-432f-a184-1ef083872962",
      end_ms: 46930,
      metadata: { ipa: "maɪ ˈsɪstɚ ənd aɪ ɡoʊ ˈaʊtsaɪd", confidence: 1, properNames: [] },
      position: 15,
      start_ms: 44750,
      transcript: "My sister and I go outside.",
    },
    {
      id: "f598b5f7-4476-4a2b-889f-9006d825c806",
      end_ms: 49730,
      metadata: { ipa: "wi bɪˈɡɪn tu meɪk ə snoʊ mæn", confidence: 1, properNames: [] },
      position: 16,
      start_ms: 47840,
      transcript: "We begin to make a snow man.",
    },
    {
      id: "654f0541-1c61-4618-b58c-91b5c7ec380f",
      end_ms: 52900,
      metadata: { ipa: "maɪ mɑm stɑɹts tu ˈʃʌvəl ðə snoʊ", confidence: 1, properNames: [] },
      position: 17,
      start_ms: 50660,
      transcript: "My Mom starts to shovel the snow.",
    },
    {
      id: "bded5625-5bae-4cc6-aefb-7e0042ebe9d4",
      end_ms: 56170,
      metadata: { ipa: "maɪ ˈsɪstɚ ənd aɪ meɪk snoʊ ˈeɪndʒəlz", confidence: 1, properNames: [] },
      position: 18,
      start_ms: 53760,
      transcript: "My sister and I make snow angels.",
    },
    {
      id: "e657d279-8872-4b76-9076-d0d59167cfb5",
      end_ms: 59290,
      metadata: { ipa: "maɪ ˈsɪstɚ ənd aɪ θɹoʊ ˈsnoʊbɔlz", confidence: 1, properNames: [] },
      position: 19,
      start_ms: 56860,
      transcript: "My sister and I throw snowballs.",
    },
    {
      id: "fe8e08e8-4081-4e84-b4fc-eb3e5a3d0536",
      end_ms: 61610,
      metadata: { ipa: "ɪt stɑɹts tu snoʊ əˈɡɛn", confidence: 1, properNames: [] },
      position: 20,
      start_ms: 59960,
      transcript: "It starts to snow again.",
    },
    {
      id: "8f006328-00eb-45d1-aed7-d847a8abc7a0",
      end_ms: 64770,
      metadata: { ipa: "wi ɡoʊ ɪnˈsaɪd fɔɹ hɑt ˈtʃɔklət", confidence: 1, properNames: [] },
      position: 21,
      start_ms: 62350,
      transcript: "We go inside for hot chocolate.",
    },
  ],
  nextLesson: {
    id: "70acbf0c-1ce7-4863-a334-c96c94447a3b",
    name: "Jessica's First Day of School",
    path: "/lessons/short-stories/section-en-short-stories-1/jessicas-first-day-of-school",
    categoryName: "Short Stories",
    sectionTitle: "Section 1",
    level: "A1",
    sentenceCount: 23,
  },
}
