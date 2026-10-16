# macOS Mail fidelity — screenshot runbook

The screenshots at `docs/fidelity/macmail-list.png` and
`docs/fidelity/macmail-thread.png` are produced by
`experiments/mail-macmail/check-fidelity.mjs`, which also asserts the
fidelity targets (computed styles, vibrancy + fallback wiring, single-line
row geometry, hover reveal, layer statement, console) — 43/43 as of
2026-10-16. It is deliberately **not** part of `npm test`: this repo's CI
installs no browser (`.github/workflows/ci.yml`), so it is a manual gate,
like `experiments/browser-qa/`, `experiments/mail-gmail/` and
`experiments/mail-outlook/`.

## Reproduce (exact steps)

```bash
cd sure-ui
npm run build                      # dist/compose.js must be current —
                                   # build.mjs composes from dist/, and a
                                   # stale dist ships stale component CSS
                                   # (the mail-gmail runbook's first-lesson;
                                   # this branch's src/ gained the stacked
                                   # modifier since 0.1.9)
node experiments/mail-macmail/build.mjs       # → experiments/mail-macmail/mail-macmail.css (git-ignored)
node experiments/mail-macmail/check-fidelity.mjs
# → prints PASS/FAIL per target (43 checks), writes macmail-list.png +
#   macmail-thread.png, exit 1 on any FAIL
```

Requires the Playwright Chromium already covered by the devDependency
`@playwright/test` (`npx playwright install chromium` if the browser cache is
cold).

Probe gotchas recorded here so the next run doesn't re-discover them:

- Chromium serializes the computed `font-family` **with quotes**
  (`"SF Pro Text", …`) — the system-stack check strips quotes before
  comparing.
- Headless Chromium *computes* `backdrop-filter` but may not composite the
  blur, so the sidebar check never trusts rendering alone: it asserts the
  blur+tint path **and** walks `cssRules` to prove the solid fallback is
  painted outside `@supports` with the blur upgrade inside it (both colours
  are `--mail-sidebar-*` skin tokens).
- The flagged-flag check samples at rest, before any `page.hover()` — the
  shell reveals unflagged rows' flags on hover only.

## Browse it live

```bash
node experiments/mail-macmail/serve.mjs 8127   # → http://127.0.0.1:8127/experiments/mail-macmail/
```

## Alternative: MCP screenshot without assertions

With the `sure-web-testing` MCP available:

1. `node experiments/mail-macmail/serve.mjs 8127`
2. `launch` (headless, viewport 1600×900) → `goto http://127.0.0.1:8127/experiments/mail-macmail/`
3. `screenshot { "path": "<repo>/docs/fidelity/macmail-list.png" }`
4. `get_console_logs` must be `[]`.

## Verified targets (2026-10-16)

| Target | Measured |
|---|---|
| SF Pro/system-first stack, 13px body | body font starts `-apple-system, BlinkMacSystemFont,`, size `13px` |
| System blue `#0a84ff`, orange flags | Send `rgb(10, 132, 255)`, flag `rgb(255, 149, 0)` |
| Window toolbar | title 13px/600, traffic lights via the status aliases |
| Vibrancy sidebar + solid fallback | blur(20px)+saturate over `rgba(246,246,246,0.72)`; fallback `#f2f2f7` wired outside `@supports` |
| Favorites / Mailboxes | 5 favorites, selected `#d6e7fb`, counts plain `#8e8e93` |
| Hairlines, not cards | pane dividers `#e5e5ea`, rows `#ececef`, list radius `0px`, no border, `box-shadow: none` |
| Slim single-line rows 44px | `--mail-list-lines: 1`, height `44`, sender/subject/time share one line |
| Unread + selection | bold `700` on white, dot `rgb(10, 132, 255)` round, selected `rgb(214, 231, 251)` |
| Pill search at the list header's right | `#e9e9ec`, r999, right gap ≤16px, right of the header's 40% line |
| Toolbar strip above the reading pane | toolbar bottom ≤ header top, icon radius 5px |
| Layered output, mobile layers, no console errors | first rule `@layer sure.tokens, …`, both mobile markers, console `[]` |

The skin itself (`macmail-skin.css`) contains **no component selector** —
see `docs/design/mail-components.md` §5c.
