# Audio & images — where to store

## Recommendation

| Loại | Lưu ở đâu | DB lưu gì |
|------|-----------|-----------|
| **Dictation audio** (mp3/m4a) | Object storage (S3 / Cloudflare R2 / MinIO dev) | `object_key`, `duration_ms`, optional CDN URL |
| **Vocabulary pronunciation** | Cùng bucket, prefix `audio/lexis/...` | `audio_url` hoặc key + signed URL |
| **Illustrations / flags / lesson art** | Cùng bucket, prefix `images/...` | `image_key`, width/height optional |
| **User avatar** | Bucket `images/avatars/` hoặc Better Auth + Gravatar | URL on profile |

**Không** lưu binary trong PostgreSQL.

## Implementation (backend)

- Module `src/storage/objects.ts` — MinIO client (same pattern as Ragenta).
- Env: `.env.example` → `STORAGE_*`, bucket mặc định `dailytaka-media`.
- Key convention (stable, not user filename):

  - `audio/dictation/{lessonId}/{sentenceIndex}.mp3`
  - `audio/vocabulary/{itemId}.mp3`
  - `images/lessons/{lessonId}/cover.webp`
  - `images/ui/{assetName}.svg` — chỉ nếu host static qua CDN; UI mockup assets có thể nằm `web/app/public/` cho build-time

## Delivery to client

- **Prod:** public bucket + CDN (R2 custom domain) hoặc signed URL ngắn hạn cho premium content.
- **Dev:** MinIO console / `http://localhost:9000/{bucket}/{key}`.

## Local dev (optional)

```yaml
# docker-compose snippet (add when needed)
# minio on 9000, bucket dailytaka-media
```

## Next.js `public/`

Chỉ **static marketing** (logo, favicon, fonts). Lesson audio/image lấy từ API URL trỏ object storage.
