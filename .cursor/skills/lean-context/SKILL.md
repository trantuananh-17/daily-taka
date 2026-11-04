---
name: lean-context
description: Minimize reads and search scope in dailytaka to save tokens/credit. Use on every backend, frontend, or UI agent task unless the user explicitly asks for a full-repo audit.
---

# Lean context (Dailytaka)

## Before reading files

1. Know your **agent scope** (backend / frontend / ui).
2. Prefer **one directory** in Grep/Glob (`path` filter).
3. Open **only** files you will edit + immediate imports.

## Never bulk-read

- `node_modules/`, `dist/`, `.next/`
- Entire `docs/` — open one doc named in the task
- All of `design/` — UI agent: **one** `*.design.md` only
- Frontend agent: **zero** design files unless `@`-attached

## Search

- Grep with `head_limit` 20–40 first; widen only if empty.
- Do not spawn explore subagents for tasks fixable in &lt;3 files.

## Implementation

- Smallest diff that passes tests.
- No drive-by refactors outside the task.
- Do not duplicate long schema/docs in chat — point to path.

## Verify

- Backend: `pnpm test` (targeted file if possible).
- Frontend: mention `pnpm dev:web`; run only if user expects verification this turn.
