# Language hub toolbar — responsive

Component: `web/app/src/features/learn/language-hub-toolbar.tsx`

## Breakpoints

| Viewport | Layout |
|----------|--------|
| **&lt; 640px (mobile)** | 2 hàng: (1) breadcrumb cuộn ngang một dòng; (2) 3 nút công cụ cuộn ngang, **chỉ icon**. |
| **≥ 640px (sm+)** | 1 hàng: breadcrumb wrap + nút công cụ bên phải, **icon + chữ**. |

## Breadcrumb

- Mobile: `flex-nowrap` + `overflow-x-auto`, ẩn scrollbar; tag **11px bold**; label dài **truncate** + `title` đầy đủ.
- Desktop: `flex-wrap`, **13px**, truncate nới trên tag cuối.
- **> 4 tag** (sau khi ghép Daily Taka + hub): tag **1–2** + menu **「…」** (các mục giữa) + **tag cuối**.
- Trail **lesson** chỉ tới **chủ đề / category** — không gắn tên bài (vocab, listen, placeholder).

## Công cụ (Lộ trình / Kiến thức / Cẩm nang)

- Cùng style pill với breadcrumb.
- Mobile: icon-only (`aria-label` / `title` bắt buộc).
- sm+: icon + label.

## Test nhanh

- Listen lesson trail dài (catalog → category → title): mobile một dòng cuộn, không xuống dòng lẫn nút công cụ.
- Vocab lesson: ≤ 5 tag, không tràn viewport dọc.
