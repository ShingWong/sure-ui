# Gmail fidelity — screenshot runbook

The screenshot at `docs/fidelity/gmail-list.png` is produced by
`experiments/mail-gmail/check-fidelity.mjs`, which also asserts the fidelity
targets (computed styles, hover reveal, layer statement, console) — 15/15 as
of 2026-10-16. It is deliberately **not** part of `npm test`: this repo's CI
installs no browser (`.github/workflows/ci.yml`), so it is a manual gate,
like `experiments/browser-qa/`.

## Reproduce (exact steps)

```bash
cd sure-ui
npm run build                      # dist/compose.js must be current —
                                   # build.mjs composes from dist/, and a
                                   # stale dist ships stale component CSS
node experiments/mail-gmail/build.mjs       # → experiments/mail-gmail/mail-gmail.css (git-ignored)
node experiments/mail-gmail/check-fidelity.mjs
# → prints PASS/FAIL per target, writes docs/fidelity/gmail-list.png, exit 1 on any FAIL
```

Requires the Playwright Chromium already covered by the devDependency
`@playwright/test` (`npx playwright install chromium` if the browser cache is
cold — the same one sure-factor's e2e uses).

## Browse it live

```bash
node experiments/mail-gmail/serve.mjs 8125   # → http://127.0.0.1:8125/experiments/mail-gmail/
```

## Alternative: MCP screenshot without assertions

With the `sure-web-testing` MCP available:

1. `node experiments/mail-gmail/serve.mjs 8125`
2. `launch` (headless, viewport 1600×900) → `goto http://127.0.0.1:8125/experiments/mail-gmail/`
3. `screenshot { "path": "<repo>/docs/fidelity/gmail-list.png" }`
4. `get_console_logs` must be `[]`.

## Verified targets (2026-10-16)

| Target | Measured |
|---|---|
| Roboto-first stack | `body` font-family starts `Roboto,` |
| Accent `#1a73e8` | active filter chip `rgb(26, 115, 232)` |
| ~40px rows | row height `40px` |
| Pill nav rail | tree item radius `999px` |
| White card on grey page | list `#fff` / body `rgb(241, 243, 244)` |
| Unread bolder + `#f6fafe` | weight `700`, bg `rgb(246, 250, 254)` |
| Hover actions right of row | `display: none → flex`, time swaps out |
| Layered output | first rule `@layer sure.tokens, …` |

The skin itself (`gmail-skin.css`) contains **no component selector** — see
`docs/design/mail-components.md` §5.
