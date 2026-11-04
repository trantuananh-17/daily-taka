# Grammar tab — content JSON (mock → DB)

Payload for a future **Ngữ pháp** tab (EN first). Canonical sample:

- `docs/design/fixtures/grammar-units-en.sample.json`
- Mirror for FE imports: `web/app/src/lib/learn/grammar/mock/grammar-units-en.sample.json`
- TypeScript: `web/app/src/lib/learn/grammar/types/content.ts`

## Document root

| Field | Type | Notes |
|-------|------|--------|
| `units` | `GrammarUnit[]` | Ordered list of teaching units within modules |

## Unit

| Field | Type | Notes |
|-------|------|--------|
| `moduleId` | string | Curriculum module slug, e.g. `a1-m2`, `b1-m3`, `c1-m1` |
| `unitId` | string | Unit within module, e.g. `u2.1`, `b1-u07`, `c1-u05b` |
| `points` | `GrammarPoint[]` | Lessons + short “content” cards in display order |

## Point — `type: "lesson"`

Full grammar lesson with structured sections.

| Field | Type | Notes |
|-------|------|--------|
| `title` | string | H1 / card title |
| `intro` | string | HTML (`<b>`) — overview paragraph |
| `sections` | `GrammarSection[]` | Body blocks (see below) |
| `example` | string | Optional single-line highlight (often empty) |
| `content` | string | Legacy / spare plain field (often empty when `sections` populated) |

## Point — `type: "content"`

Compact note (Lưu ý, side card) — usually `sections: []`, copy in `content` + optional `example`.

| Field | Type | Notes |
|-------|------|--------|
| `title` | string | |
| `intro` | string | Often empty |
| `example` | string | EN example sentence |
| `content` | string | Multi-line VI explanation (`\n`, bullet lines with `•`) |

## Section kinds

| `kind` | Purpose | Key fields |
|--------|---------|------------|
| `table` | Comparison / reference tables | `heading`, `head[]`, `rows[][]` (cells may contain `<b>`) |
| `usage` | Use cases + examples | `heading`, `items[].use`, `items[].examples[].en/vi` |
| `explain` | Tips / pitfalls | `heading`, `bullets[]` (HTML in strings) |
| `formula` | Patterns | `heading`, `rows[].label`, `rows[].formula`, optional `rows[].example` |

## UI rendering notes (future tab)

- Treat `intro`, table cells, bullets as **trusted HTML subset** (`<b>` only) or sanitize on render.
- Bilingual examples: always show `en` + `vi` (stacked or two columns).
- Order: `intro` → `sections[]` in array order → optional `example` footer.
- `content`-type points: render `title`, optional `example` callout, then `content` as pre-wrap / simple markdown.

## DB mapping (proposed)

**Phase 1 (MVP seed):** store each point as one row with `body jsonb` matching `GrammarPoint` (+ unit keys). Fast to ship; matches mock file 1:1.

**Phase 2 (normalized, optional):**

| Table | Columns |
|-------|---------|
| `grammar_modules` | `id`, `language_id`, `slug` (`moduleId`), `title`, `level`, `sort_order` |
| `grammar_units` | `id`, `module_id`, `slug` (`unitId`), `title`, `sort_order` |
| `grammar_points` | `id`, `unit_id`, `type` (`lesson` \| `content`), `title`, `intro`, `example`, `content_plain`, `sort_order` |
| `grammar_sections` | `id`, `point_id`, `kind`, `heading`, `sort_order`, `payload jsonb` |

`payload` holds kind-specific data (`head`/`rows`, `items`, `bullets`, `rows` for formula) to avoid wide nullable columns.

**Progress (later):** `user_grammar_point_progress` — `user_id`, `point_id`, `completed_at`, optional bookmark.

## Relation to hub

- Lives under language hub **EN** (extend `skills` or fourth tile **grammar** / ngữ pháp).
- `moduleId` / `unitId` align with future course map, not necessarily 1:1 with writing/vocab CEFR lists today.

## Regenerating fixture

If the sample JSON is updated in chat again, re-export to `docs/design/fixtures/grammar-units-en.sample.json` and copy to `web/app/.../mock/`. Validate with:

```bash
node -e "JSON.parse(require('fs').readFileSync('docs/design/fixtures/grammar-units-en.sample.json','utf8')); console.log('ok')"
```
