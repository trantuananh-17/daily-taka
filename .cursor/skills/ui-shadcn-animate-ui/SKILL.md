---
name: ui-shadcn-animate-ui
description: Setup và implement UI Daily Lexis với shadcn/ui plus Animate UI primitives. Dùng khi thêm component UI, animate accordion/dialog, hoặc code page từ design/*.design.md.
---

# shadcn/ui + Animate UI

## Docs

- shadcn: https://ui.shadcn.com/docs
- Animate UI: https://animate-ui.com/docs

## Workflow page

1. Đọc `design/<page>.design.md` user chỉ định.
2. Liệt kê shadcn components cần → `pnpm dlx shadcn@latest add button card ...` trong `web/app` hoặc `web/admin` (admin: thêm `admin-ui-implementation.mdc`, block `sidebar-07`, `chart`, `table`).
3. Build feature wrappers; page chỉ compose.
4. Nếu spec cần motion → chạy / cập nhật Animate UI trên primitives đã cài.

## Animate UI (với shadcn)

Animate UI thay **import primitive** (Radix/Base UI), không fork toàn bộ shadcn:

```tsx
// primitive animated (sau CLI animate)
import { Accordion as AccordionPrimitive } from "@animate-ui/react/primitives/radix-ui";
```

One-shot cho mọi component shadcn đã cài:

```bash
pnpm dlx @animate-ui/cli@latest animate all
```

Optional agent skill upstream: `pnpm dlx skills add imskyleen/animate-ui`

## Quy ước repo

- `components/ui/` — shadcn generated
- `components/layout/`, `components/features/` — app-specific
- Rule: `.cursor/rules/ui-implementation.mdc`

## Không làm

- Custom `<button className="...">` thay `Button` shadcn
- Copy-paste full shadcn component sang tên khác khi có thể `add` + compose
