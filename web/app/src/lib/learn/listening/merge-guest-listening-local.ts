import {
  readGuestDictationStoreEntries,
  type GuestDictationLessonProgress,
} from "@/lib/learn/listening/guest-dictation-lesson-progress"
import {
  readGuestListeningStoreEntries,
  type GuestListeningProgressEntry,
} from "@/lib/learn/listening/guest-listening-progress"
import { readListeningPlaybackSettings } from "@/lib/learn/listening/listening-playback-settings"
import { apiMergeGuestListeningProgress } from "@/lib/learn/listening/listening-user-api"

const MERGE_FLAG = "dailytaka:guest-listening-merge-done:v1"

function hasGuestData(
  lessonEntries: GuestListeningProgressEntry[],
  dictationEntries: GuestDictationLessonProgress[],
) {
  return lessonEntries.length > 0 || dictationEntries.length > 0
}

export async function mergeGuestListeningIfNeeded(): Promise<boolean> {
  if (typeof window === "undefined") return false
  if (window.localStorage.getItem(MERGE_FLAG) === "1") return false

  const lessonEntries = readGuestListeningStoreEntries()
  const dictationEntries = readGuestDictationStoreEntries()
  if (!hasGuestData(lessonEntries, dictationEntries)) {
    window.localStorage.setItem(MERGE_FLAG, "1")
    return false
  }

  await apiMergeGuestListeningProgress({
    lessonEntries,
    dictationEntries,
    playbackSettings: readListeningPlaybackSettings(),
  })

  window.localStorage.removeItem("dailytaka:guest-listening-progress:v1")
  window.localStorage.removeItem("dailytaka:guest-dictation-lesson-progress:v1")
  window.localStorage.removeItem("dailytaka:listening-playback-settings:v1")
  window.localStorage.setItem(MERGE_FLAG, "1")
  return true
}
