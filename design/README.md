# UI design specs (per page)

Mỗi page một file trong `design/`:

```
design/
  landing.design.md
  language-hub.design.md
  tokens.design.md          # optional — design tokens chung
```

## Quy ước tên

**`<page-slug>.design.md`**

Ví dụ: page landing → `landing.design.md`.

## Ra lệnh cho agent

> Code page landing theo `landing.design.md`

Agent đọc **`design/landing.design.md`**, rồi implement bằng **shadcn/ui** + animation **Animate UI** theo rule `ui-implementation.mdc`.

## Template

[PAGE-DESIGN-TEMPLATE.md](./PAGE-DESIGN-TEMPLATE.md)

## Stack UI (implementation)

| Layer | Công cụ |
|-------|---------|
| Components | [shadcn/ui](https://ui.shadcn.com/) → `components/ui/` |
| Motion | [Animate UI](https://animate-ui.com/) trên primitives |
| Spec | File `*.design.md` do bạn điền |
