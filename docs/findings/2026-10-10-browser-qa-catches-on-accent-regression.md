# Browser QA caught a token regression the unit suite could not see

Date: 2026-10-10 · Repo: sure-ui · Branch: `feat/components-at-compile-time`
Run: `experiments/browser-qa/runs/0.2.0b-unification/` (verdict: pass after fix)

## What happened

The 0.2.0b unification added solid `--info` surfaces (`.toast--info`,
`.status-bar--info`) that take their ink from `--on-accent`. Dracula's
`--on-accent` was `#fff` — white on `--accent` (`--drac-primary` `#bd93f9`,
a light purple) = **2.41:1**.

In 0.1.9 this bad pair existed only on the auth button (already flagged,
with the note *"--on-accent value decision when/if revisited"*). Dracula's
0.1.9 toast/status had **no `--info` variant at all** — it fell back to
surface/text = 8.59:1. So the unification moved two surfaces from 8.59 to
2.41: a genuine regression, invisible to `npm test`.

## How it was caught

`experiments/browser-qa/` drives real Chromium (playwright) over every theme
and measures computed colours pair-by-pair. Two things did the work:

1. **The 0.1.9 A/B** — master's original `src/styles/*.ts` strings are
   extracted (`scripts/make-baseline.mjs`) and measured with identical
   probes. That classified 11 of 14 initial failures as pre-existing
   (session items, links, nord/forest palette limits) and left exactly two
   true regressions: `dracula/toast-info` and `dracula/status-info`,
   8.59 → 2.41.
2. **Contrast gates in the browser**, which resolve the same `var()` chains
   the eye does — including `color-mix()` and `color(srgb …)` serialisations
   that a hex-only unit resolver cannot parse.

## The fix (operator decision, 2026-10-10)

```css
--on-accent: var(--drac-bg);   /* was: #fff */
```

Same derivation phase 4 already applied to `--primary-ink` for this
identical background (dark ink on purple = **5.90:1**). One token, three
consumers fixed (auth button, toast--info, status-bar--info).

## Why it must not recur

The unit suite had **no gate for `--on-accent`** — nothing in
`npm test` resolves ink against accent. Added:

- `src/index.test.ts`: `--on-accent reads on --accent (>= 4.5:1)` × 7 themes
  (suite 186 → 193).
- `scripts/proof-section.mjs` now reports changed token **values** explicitly
  (`changed: --on-accent: #fff -> var(--drac-bg)`) instead of failing the
  byte-identity check opaquely.

## Reproduce

```bash
node scripts/make-baseline.mjs
node experiments/browser-qa/serve.mjs 8123 &     # harness server
python3 experiments/browser-qa/drive.py <label>  # measures + baseline A/B
python3 experiments/browser-qa/interact.py <label>  # hover/focus/mobile
node experiments/browser-qa/record.mjs experiments/browser-qa/runs/<label>/raw.json <label>
node scripts/gen-index.mjs
```
