# Admin dashboard — bố cục trang

## Luồng (mặc định)

```
Header (+ thời điểm cập nhật)
→ Hàng 4 KPI (stat cards, 1 row desktop)
→ Biểu đồ lượt học (stacked + pie)
→ Top học viên tuần (leaderboard) | Cần chú ý
→ Truy cập nhanh (full width, 1 hàng)
→ Bảng nội dung theo ngôn ngữ
```

DAU theo thứ, chart theo năm/tháng: **chưa gắn UI** — `analytics` giữ cho phase sau.

## Stat card — nên có gì?

Xem bảng KPI trong `docs/design/2026-11-05-admin-dashboard-data.md`.

Mỗi card **chỉ** 4 lớp thông tin:

1. **Label** — một dòng (vd. `Tổng học viên`, `Bài hoàn thành · tuần`)
2. **Value** — số chính, lớn
3. **Trend badge** — ▲/▼/− + % (ticket mở: ↓ = tốt)
4. **compareLabel** — một dòng ngắn (vd. `so với tuần trước`)
5. **Sparkline** — 7 điểm, cạnh phải card (mini trend, không phải chart phân tích)

**Không** đặt trên stat card: biểu đồ năm/tháng, leaderboard, subtitle marketing, icon trang trí, nhiều metric phụ.

**Không** (chưa product): conversion, MRR, churn, online realtime — thêm KPI khi có billing/analytics.
