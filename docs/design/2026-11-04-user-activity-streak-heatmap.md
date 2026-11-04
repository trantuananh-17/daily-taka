# User activity, streak & heatmap

**Daily Taka** — thời gian học có xác thực → streak và hai biểu đồ (30 ngày + lịch năm kiểu GitHub).

## Quy tắc nghiệp vụ

| Khái niệm | Định nghĩa |
|-----------|------------|
| **Thời gian học trong ngày** | Tổng giây/phút hoạt động có ý nghĩa (listen / vocab / write / grammar…) trong **ngày lịch** theo `user_profiles.timezone` (mặc định `Asia/Ho_Chi_Minh`). |
| **Ngày đủ streak** | `active_minutes >= 15` trong ngày đó. |
| **Streak hiện tại** | Số ngày **liên tiếp** kết thúc tại **hôm nay** (nếu hôm nay đã đủ 15p) hoặc **hôm qua** (nếu hôm nay chưa đủ 15p), mỗi ngày trong chuỗi phải đủ 15p. Ngày 0p hoặc 1–14p **phá chuỗi**. |
| **Kỷ lục streak** | Max độ dài chuỗi ngày đủ 15p trong lịch sử user. |
| **Hôm nay (pill ⏱)** | `active_minutes` của ngày hiện tại — hiển thị `0m`, `1m`, `15m`, … |

### Màu UI

**Lịch 30 ngày**

| Trạng thái | Điều kiện | Màu |
|------------|-----------|-----|
| Chưa học | `0` phút | xám nhạt |
| Có học, chưa đủ streak | `1–14` phút | vàng (viền cam) |
| Đủ streak | `>= 15` phút | xanh (tính streak) |

**Heatmap năm (GitHub)**

| Level | Phút | Label legend |
|-------|------|----------------|
| 0 | 0 | 0M |
| 1 | 1–14 | 1–14M |
| 2 | 15–29 | 15–29M |
| 3 | 30–59 | 30–59M |
| 4 | 60+ | 60M+ |

---

## Ghi nhận thời gian (backend)

1. Client gửi **heartbeat** mỗi ~30s khi tab/player active (listen/vocab/write): `POST /api/me/activity/heartbeat` `{ skill, lessonId?, deltaSec }`.
2. Server cộng dồn vào `user_daily_activity.active_seconds` cho `(user_id, activity_date)`.
3. Idempotent theo ngày; cap tuỳ chính sách (vd. max 8h/ngày) — phase sau.
4. Khi `active_seconds` vượt ngưỡng 15p lần đầu trong ngày: có thể emit notification / XP (phase sau).

Streak **tính khi đọc** từ `user_daily_activity` (không bắt buộc materialize), hoặc cache trong `user_streaks` cập nhật sau heartbeat.

---

## Schema (PostgreSQL)

### `user_daily_activity`

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| `user_id` | text FK → user | |
| `activity_date` | date | Ngày theo TZ user |
| `active_seconds` | int | default 0 |
| `updated_at` | timestamptz | |

PK: `(user_id, activity_date)`. Index `(user_id, activity_date DESC)`.

### `user_streaks` (cache tuỳ chọn)

| Cột | Kiểu |
|-----|------|
| `user_id` PK | |
| `current_streak` | int |
| `longest_streak` | int |
| `last_qualified_date` | date nullable |
| `updated_at` | timestamptz |

### `user_study_sessions` (chi tiết, đã stub)

Ghi session theo skill; rollup vào `user_daily_activity`.

---

## API (Hono)

### `GET /api/me/activity/summary`

```json
{
  "goalMinutes": 15,
  "todayMinutes": 1,
  "currentStreak": 0,
  "longestStreak": 0
}
```

### `GET /api/me/activity/daily?from=YYYY-MM-DD&to=YYYY-MM-DD`

```json
{
  "days": [{ "date": "2026-11-04", "activeMinutes": 1 }]
}
```

### `GET /api/me/activity/heatmap?year=2026`

Cùng shape `days` — client bucket màu theo bảng level.

Auth: Better Auth session bắt buộc; guest → summary zero + empty heatmap hoặc 401 tuỳ product.

---

## UI mapping

| Widget | Route gợi ý | Component |
|--------|-------------|-----------|
| Pill ⏱ + 🔥 | Header lộ trình / hub | `ActivityStatPills` |
| 30 ngày gần đây | `/{lang}/learning-path` | `ActivityLast30DaysCard` |
| Lịch sử năm | cùng trang | `ActivityYearHeatmapCard` |

Copy: “30 ngày gần đây”, “LỊCH SỬ HOẠT ĐỘNG (2026)”, “Phân bổ thời gian học (phút)”.

---

## Test scenarios

1. Hôm nay 1p → pill `1m`, ô vàng, streak 0.
2. Hôm qua 20p, hôm nay 0p → streak hiện tại 0 (hôm nay chưa đủ và chưa kết thúc ngày: nếu 0p thì chuỗi kết thúc hôm qua → current = 1? **Clarification:** GitHub streak: if today isn't complete, streak counts through yesterday if yesterday qualified. So yesterday 20p, today 0p mid-day → current streak still 1 until today ends at 0? Usually: current streak = consecutive qualified days ending at last qualified day if today not yet qualified. Standard Duolingo: if today not met goal yet, streak shows yesterday's chain length until day ends.

Use this rule:
- Walk backward from today: if today >= 15, include today and continue; if today < 15, start from yesterday; count consecutive days each >= 15.

3. Ba ngày liên tiếp >= 15p → current 3, heatmap level 2+.
4. TZ: user ở UTC+7, heartbeat 23:50 → đúng `activity_date` local.

---

## Frontend (mock phase)

- `web/app/src/lib/user-activity/` — constants, streak math, heatmap level
- Mock JSON + `getMockActivityDashboard()`
- Trang `/{lang}/learning-path` wire components

Implement API + Drizzle khi auth session sẵn sàng.
