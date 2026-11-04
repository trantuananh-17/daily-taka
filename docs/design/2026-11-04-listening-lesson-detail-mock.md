# Listening lesson detail — mock contract (First Snow Fall)

## Mục tiêu

Ghi lại payload GET lesson detail (dictation player) từ admin import SRT để FE mock và backend/DB implement sau.

**Fixture:** `web/app/src/lib/learn/listening/mock/first-snow-fall-lesson.fixture.ts`  
**Mapper:** `web/app/src/lib/learn/listening/map-lesson-detail-fixture.ts`  
**Audio mock:** `web/app/public/listening/mock/en/lessons/first-snow-fall/audio.mp3`

## Admin — cấu hình theo câu

| UI learner | Nguồn dữ liệu | Ghi chú |
|------------|---------------|---------|
| **Tên riêng có thể xuất hiện** (pill) | `sentences[].metadata.properNames[]` | Chỉ hiện khi mảng không rỗng (ví dụ câu 1: `November`). |
| **Không phân biệt hoa thường và dấu câu** | `lesson.dictation_grading_defaults` + `sentences[].metadata.grading` | Mặc định lesson: cả hai `true`. Một câu có thể override (`ignoreCase`, `ignorePunctuation`) để bật/tắt hint và logic chấm sau này. |

Không cần cắt lại audio trên FE: alignment SRT đã có `start_ms` / `end_ms` per sentence; player seek trong file lesson đầy đủ.

## Sentence (DB gợi ý)

- `id` (uuid)
- `lesson_id`
- `position` (1-based)
- `transcript` (text)
- `start_ms`, `end_ms` (integer)
- `metadata` (jsonb): `ipa`, `confidence`, `properNames[]`, `grading?`

## Lesson (phần liên quan dictation)

- `audio_key` / `media` (R2)
- `duration_ms`
- `sentence_count`
- `metadata` (import mode, source filename, alignment provider)
- `dictation_grading_defaults` (jsonb hoặc cột riêng): `{ ignoreCase, ignorePunctuation }`

## API response shape (tóm tắt)

```json
{
  "lesson": { "id", "slug", "title", "audio_url", "duration_ms", "dictation_grading_defaults", ... },
  "sentences": [{ "id", "position", "start_ms", "end_ms", "transcript", "metadata" }],
  "nextLesson": { "name", "path", "level", "sentenceCount", ... }
}
```

Production `audio_url` trỏ proxy `/api/listening/audio/{key}`; mock dùng static public path.

## Playback settings (FE)

- Defaults: `DEFAULT_LISTENING_PLAYBACK_SETTINGS` in `listening-playback-settings.ts`
- Guest persist: `dailytaka:listening-playback-settings:v1` (future: account API same shape)
- UI: **Tùy chọn phát** → `ListeningPlaybackSettingsDialog` (no mobile word suggestions)
- Shortcut hints + keyboard handlers read saved settings
- Settings dialog animation: fixed **sheet-bottom** (`listening-dialog-entrance.ts`)

## Guest dictation progress (FE)

- Key: `dailytaka:guest-dictation-lesson-progress:v1`
- Per lesson: `correctCount`, `currentSentenceIndex` (0-based)
- Restore on mount; **Học lại từ đầu** clears entry and resets UI
- Module: `guest-dictation-lesson-progress.ts` + hook `use-guest-dictation-progress.ts`

## Kiểm tra

1. Mở `/en/listen/short-stories/section-en-short-stories-1/first-snow-fall`
2. Câu 1: pill **November**, phát audio đúng đoạn ~3.6s–5.6s
3. Transcript mode: đủ 21 câu đúng thứ tự user cung cấp
