# Listen — backlog sau MVP (nhắc phase sau)

**MVP đã coi xong khi:** 1 bài EN playable (First Snow) + player UI + API content + progress/settings server + guest merge + admin GET/CUD + search `ilike`/FTS sẵn.

**Tham chiếu đã implement:** `docs/design/2026-11-05-listening-progress-settings-admin-search.md`

**Cập nhật:** 2026-11-05

---

## 1. Nội dung (content)

- [ ] Seed/import **14 category** EN (catalog mock) — hiện DB chỉ **Short Stories**.
- [ ] Section 1: **14 bài còn lại** — `audio_storage_key` + bulk `listening_sentences` (chỉ metadata + First Snow có 21 câu).
- [ ] Các **section/category** còn lại của Short Stories và chủ đề khác.
- [ ] **ZH / JP:** seed cùng contract API (`language_code` + 1 bài mock/bài đầu section) — static params FE vẫn mock, DB trống → dễ 404.
- [ ] (Tuỳ chọn) Template **`youtube`** — `template_type`, `youtube_video_id`, player embed; MVP chỉ `audio`.

---

## 2. Guest & paywall

- [ ] Policy **preview / locked** section + cap bài/section (design: `2026-11-04-listening-sections-lazy-load.md`).
- [ ] API filter lesson `access` cho guest; FE khóa card / modal đăng nhập.
- [ ] `GuestAccessPolicy` config (env hoặc server).

---

## 3. Admin CMS (sau CRUD + GET)

- [ ] **Admin UI** (`web/admin/` — chưa có).
- [ ] **Presigned upload** audio → PATCH lesson `audioStorageKey`.
- [ ] **Import package / SRT** một shot (metadata + sentences), không chỉ `PUT .../sentences` tay.
- [ ] Reindex / verify `search_vector` sau bulk import.

---

## 4. Progress & analytics (mở rộng)

- [ ] `user_listen_sentence_attempts` — lịch sử submit từng câu (analytics).
- [ ] UI **user star** trên player (API `PATCH .../star` đã có).
- [ ] Denormalize `user_listen_section_stats` nếu aggregate section chậm (scale).

---

## 5. Auth & production UX

- [ ] Bỏ / ẩn **`SessionAuthBar`** dev; trang đăng nhập/đăng ký product.
- [ ] Email verify, OAuth (nếu product yêu cầu).
- [ ] Admin: Better Auth **role** thay `ADMIN_API_KEY` (hoặc song song).
- [ ] Invalidate React Query sau guest merge (category `completedCount` refresh tức thì).

---

## 6. Search & infra

- [ ] Bật **`LISTENING_SEARCH_MODE=fts`** khi catalog lớn; verify ranking.
- [ ] (Phase 3) Search **transcript** câu — bảng/index riêng nếu cần.

---

## 7. Out of scope Listen (doc riêng)

- XP, khung avatar, leaderboard → backlog gamification (xem §9 design progress doc).
- Vocab / Write — skill khác; pattern progress tương tự khi MVP từng skill.

---

## Thứ tự gợi ý khi quay lại Listen

1. Import **15 bài section 1 EN** (audio + SRT).
2. Guest paywall (nếu product cần trước launch).
3. Admin upload + import package.
4. ZH/JP seed 1 bài/skill.
5. Full catalog EN + FTS production.
