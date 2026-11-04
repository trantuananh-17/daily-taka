# Dailytaka — custom agents

Chọn agent khi chat (hoặc nhắc tên) để giới hạn phạm vi file và tiết kiệm credit.

| Agent | Khi nào dùng | Phạm vi |
|-------|----------------|---------|
| **dailytaka-backend** | API, Hono, Drizzle, auth, media storage | `src/`, `drizzle/`, docs API/schema |
| **dailytaka-frontend** | Next, components, shadcn — **không** tự mở design | `web/app/` only |
| **dailytaka-ui** | Code page từ `*.design.md` | Một file `design/*.design.md` + `web/app/` |

Brand UI: **Daily Taka** (`brand-naming.mdc`). shadcn: không sửa `components/ui/*` (`shadcn-immutable.mdc`).

## Cách gọi

```
@dailytaka-backend thêm route health chi tiết
@dailytaka-frontend thêm layout shell (user mô tả trong chat)
@dailytaka-ui code page landing theo landing.design.md
```

## Skills chung

- `.cursor/skills/lean-context/SKILL.md` — đọc ít, diff nhỏ
- Backend: `better-auth`
- Frontend / UI: `ui-shadcn-animate-ui`

## Rules theo thư mục

- `scope-backend.mdc` — khi sửa `src/**`
- `scope-frontend.mdc` — khi sửa `web/app/**`

File agent: `.cursor/agents/*.md`
