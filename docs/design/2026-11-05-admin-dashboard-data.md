# Admin dashboard — dữ liệu & contract

## Contract (source of truth)

- **Zod + types:** `src/modules/admin-dashboard/admin-dashboard.summary.schema.ts`
- **KPI builder (BE + mock):** `src/modules/admin-dashboard/admin-dashboard.kpis.ts`
- **API:** `GET /v1/admin/dashboard/summary` (admin key) — body = `adminDashboardSummarySchema`

Admin UI import types qua alias `@dailytaka/admin-dashboard-contract`, KPI builder `@dailytaka/admin-dashboard-kpis`.

## Mặc định: mock trên FE, **không** gọi API

Trừ khi user **yêu cầu rõ** nối API — xem mục cũ trong file này.

## Stat row — 4 KPI (admin, không phải learner)

| Nhóm | KPI | Ghi chú |
|------|-----|--------|
| Growth | Tổng học viên | Quy mô đăng ký |
| Growth | Học viên mới · tuần | + trend % vs tuần trước |
| Engagement | Bài hoàn thành · tuần | Proxy từ activity |
| Content | Hỗ trợ chưa xử lý | Ticket mở; trend ↓ = tốt |

**DAU / MAU:** không nằm stat row — dùng `insights.dauByWeekday` và `analytics.dauMauByMonth` khi bật section chart.

**Chưa có product:** Conversion Free→Premium, MRR/ARR, Churn, Avg session, Online realtime, Completion rate, Avg rating — thêm field + KPI khi có billing/analytics.

Mỗi KPI: `value`, `trend` (direction, percent, period, compareLabel), `sparkline[]` (7 điểm).

UI: label + số + badge trend góc + sparkline phải — **không** copy marketing dài.

## Phần còn lại trang

- Bảng nội dung theo ngôn ngữ · biểu đồ lượt học · Cần chú ý · quick links.

## Agent / rule

- `.cursor/rules/scope-admin.mdc` — dashboard data mock-first.
