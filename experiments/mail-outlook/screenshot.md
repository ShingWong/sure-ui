# Outlook Online fidelity — screenshot runbook

The screenshots at `docs/fidelity/outlook-list.png` and
`docs/fidelity/outlook-thread.png` are produced by
`experiments/mail-outlook/check-fidelity.mjs`, which also asserts the
fidelity targets (computed styles, two-line row geometry, hover reveal,
layer statement, console) — 31/31 as of 2026-10-16. It is deliberately
**not** part of `npm test`: this repo's CI installs no browser
(`.github/workflows/ci.yml`), so it is a manual gate, like
`experiments/browser-qa/` and `experiments/mail-gmail/`.

## Reproduce (exact steps)

```bash
cd sure-ui
npm run build                      # dist/compose.js must be current —
                                   # build.mjs composes from dist/, and a
                                   # stale dist ships stale component CSS
                                   # (same lesson as mail-gmail; this branch
                                   # added the stacked list modifier in src/)
node experiments/mail-outlook/build.mjs       # → experiments/mail-outlook/mail-outlook.css (git-ignored)
node experiments/mail-outlook/check-fidelity.mjs
# → prints PASS/FAIL per target (31 checks), writes outlook-list.png +
#   outlook-thread.png, exit 1 on any FAIL
```

Requires the Playwright Chromium already covered by the devDependency
`@playwright/test` (`npx playwright install chromium` if the browser cache is
cold).

Two probe gotchas recorded here so the next run doesn't re-discover them:

- Chromium serializes the computed `font-family` **with quotes**
  (`"Segoe UI", …`) — the Segoe check strips quotes before comparing.
- `.btn-primary` transitions `background` over 0.15s — the `#106ebe` hover
  probe waits 250ms after `page.hover()` or it samples the tween.

## Browse it live

```bash
node experiments/mail-outlook/serve.mjs 8126   # → http://127.0.0.1:8126/experiments/mail-outlook/
```

## Alternative: MCP screenshot without assertions

With the `sure-web-testing` MCP available:

1. `node experiments/mail-outlook/serve.mjs 8126`
2. `launch` (headless, viewport 1600×900) → `goto http://127.0.0.1:8126/experiments/mail-outlook/`
3. `screenshot { "path": "<repo>/docs/fidelity/outlook-list.png" }`
4. `get_console_logs` must be `[]`.

## Verified targets (2026-10-16)

| Target | Measured |
|---|---|
| Segoe UI-first stack, 14px body | body font starts `Segoe UI,`, size `14px` |
| Accent `#0078d4` / hover `#106ebe` | New mail button `rgb(0,120,212)` → hover `rgb(16,110,190)` |
| Fluent radii | New mail 4px, cards 8px, toolbar icons 4px |
| White app bar + centered pill search | bar `#fff`, search `#f0f0f0` r999, centered ±0px |
| Two-line stacked rows 56px | `--mail-list-lines: 2`, row height 56, line 2 below line 1 |
| Time top-right on line 1 | time bottom ≤ subject top, right edge ≤24px inset |
| Unread bold + blue dot | weight `700`, dot `rgb(0,120,212)` round |
| Selected row `#eff6fc` | `rgb(239,246,252)` |
| Focused/Other pivot | active tab underlined in accent, background transparent |
| Folder pane | selected folder `#f3f2f1`, counts plain text `#605e5c` |
| Reading-pane toolbar above header | toolbar bottom ≤ header top |
| Layered output, no console errors | first rule `@layer sure.tokens, …`, console `[]` |

The skin itself (`outlook-skin.css`) contains **no component selector** —
see `docs/design/mail-components.md` §5b.
