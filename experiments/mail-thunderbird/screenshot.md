# Thunderbird 115 Supernova fidelity — screenshot runbook

The screenshots at `docs/fidelity/thunderbird-list.png` and
`docs/fidelity/thunderbird-thread.png` are produced by
`experiments/mail-thunderbird/check-fidelity.mjs`, which also asserts the
fidelity targets (computed styles, tab-bar geometry, card rows, coloured
folder icons, hover states, layer statement, console) — **55/55 as of
2026-10-16**. It is deliberately **not** part of `npm test`: this repo's CI
installs no browser (`.github/workflows/ci.yml`), so it is a manual gate,
like `experiments/browser-qa/`, `experiments/mail-gmail/`,
`experiments/mail-outlook/` and `experiments/mail-macmail/`.

## Reproduce (exact steps)

```bash
cd sure-ui
npm run build                      # dist/compose.js must be current —
                                   # build.mjs composes from dist/, and a
                                   # stale dist ships stale component CSS
                                   # (the mail-gmail runbook's first-lesson)
node experiments/mail-thunderbird/build.mjs       # → experiments/mail-thunderbird/mail-thunderbird.css (git-ignored)
node experiments/mail-thunderbird/check-fidelity.mjs
# → prints PASS/FAIL per target (55 checks), writes thunderbird-list.png +
#   thunderbird-thread.png, exit 1 on any FAIL
```

Requires the Playwright Chromium already covered by the devDependency
`@playwright/test` (`npx playwright install chromium` if the browser cache is
cold).

Probe gotchas recorded here so the next run doesn't re-discover them:

- Chromium serializes the computed `font-family` **with quotes**
  (`"Segoe UI", …`) — the system-stack check strips quotes before comparing.
- The tab line is measured as `line.top − tab.top === 3` (tabmail.css paints
  `.tab-line` 3px below the tab's top edge) — sample it while the *active*
  tab is still active: the demo's tab JS moves `is-active` on click, and the
  checker never clicks.
- Colour samples taken **at rest** (flag ink, unread dot, selection tints)
  run before any `page.hover()` — the shell reveals unflagged rows' flags on
  hover only, and hover swaps the row tint to `--mail-hover-bg`.
- `.btn-primary` transitions `background 0.15s`, so the hover probe waits
  250ms; the row/folder hovers are immediate (no transitions there).
- The quote region is collapsed by default (`.is-collapsed`), so its colour
  is asserted through the always-visible `__quote-toggle` pill, which shares
  `--mail-quote-bg`.

## Browse it live

```bash
node experiments/mail-thunderbird/serve.mjs 8128   # → http://127.0.0.1:8128/experiments/mail-thunderbird/
```

## Alternative: MCP screenshot without assertions

With the `sure-web-testing` MCP available:

1. `node experiments/mail-thunderbird/serve.mjs 8128`
2. `launch` (headless, viewport 1600×900) → `goto http://127.0.0.1:8128/experiments/mail-thunderbird/`
3. `screenshot { "path": "<repo>/docs/fidelity/thunderbird-list.png" }`
4. `get_console_logs` must be `[]`.

## Verified targets (2026-10-16)

| Target | Measured |
|---|---|
| System UI stack, 14px body | font starts `system-ui, -apple-system,`, size `14px` |
| Tab bar above the panes | strip `#f4f4f5`, tabs `4px 4px 0 0` @ 33px, 16px labels, close ✕ on the 3 inactive tabs only |
| Accent tab line | 2px, `rgb(19, 115, 217)`, 3px below the tab top; active tab painted `#fafafa`, flowing into the toolbar |
| Unified toolbar under the tabs | separator `#d4d4d8`; New Message `#1373d9` (hover `#175fb6`) at 3px radius; icon strip 32px buttons / 16px glyphs / 3px radius; search `#f7f7f8` at the right end |
| Folder pane | `#f4f4f5`; open folder solid `#1373d9` with white ink; grey `#71717a` count pills on white; Drafts `#ae55f7`, Sent `#1d783b`, Junk `#b91c1c`, Archive `#713f12`, Trash `#52525b`; account · Local Folders groups; hover `#e4e4e7` |
| Card view | frameless `#fafafa` pane; white rows, `#d9d9de` hairlines, 3px radius, 46px single-line rows; sender `#18181b`, preview `#71717a` |
| Unread / selection / flag | bold 700 on un-tinted white, **green** dot `#16a34a` round; selected `#dceaf9`; flagged `#ea580c` at rest; hover tint `#e7f1fb` |
| Reading pane | toolbar above the header card (32px buttons); quote pill `#efeff1`; attachment chips `#f7f7f8` on `#d9d9de` |
| Status bar | 22px footer in `#fafafa`, top hairline `#d9d9de`, “1 of 8 selected” |
| Compose window | chips `#efeff1`, Send at the 3px control radius |
| Layered output, mobile layers, no console errors | first rule `@layer sure.tokens, …`, both mobile markers, console `[]` |

The skin itself (`thunderbird-skin.css`) contains **no component selector** —
see `docs/design/mail-components.md` §5d. Colour provenance: Thunderbird's
comm-central theme (Bolt palette + `layout.css`/`tabmail.css`/`threadPane.css`/
`threadCard.css`/`tree-listbox.css`/`about3Pane.css`/`folderColors.css`),
fetched from searchfox.org and hg.mozilla.org raw-file, rev a430595f.
