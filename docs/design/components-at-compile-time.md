# Components at compile time — 0.2.0 design

Status: **agreed, spike started** (2026-10-09). Decisions locked by the
operator: unify toast to one fixed-position block; `@layer` in the
agent-first direction; `pp-*` promoted to a first-class component for
everyone; catalog `cssClasses` role-rename **dropped** — generated markup
always uses sure-ui class conventions. Version target: 0.2.0.

## Motivation (measured, 2026-10-09)

| | raw | gzip |
|---|---|---|
| one full theme string | 20.6KB | ~4.6KB |
| all 7 themes in dist | 145KB | — |
| notifications.js | 3.7KB | — |

Two gaps against "keep it light":

1. **No tree-shaking.** No `sideEffects: false`; every theme import routes
   through a module that imports all seven, so a bundler consumer of
   `import { nord }` most likely pulls all 145KB into its graph.
2. **No granularity.** Each theme is one string; wanting forms + buttons
   still pays for auth, markdown, sessions.

One theme's breakdown (nord): dialog 1.7KB, page regions 1.9KB, mobile
1.4KB, markdown 1.3KB, menu 0.9KB, sessions 0.9KB, composites 0.8KB,
plus a 10.6KB root+form/table/crud/search/buttons/toast/status/side-panel
lump that splits further.

## Principles

- **Agent first.** One mental model beats cleverness. `@layer` names library
  origin in devtools; "unlayered CSS always wins" replaces specificity
  arithmetic; generated output carries section comments mapping rules →
  catalog components.
- **Plain strings, zero deps, compile-time.** `compose()` is strings in,
  string out — consumers run it in their build and ship one static CSS
  file. No CLI, no bundler requirement, no runtime injection required
  (kept as the zero-build alternative).
- **One vocabulary.** The generic aliases every theme already declares
  (`--surface/--text/--border/--accent/--muted/--highlight/--error…`) are
  the only names shared component blocks may reference. Consumers, agents
  and generated apps learn one token language.

## Architecture

```
src/
  tokens/        per theme: just the :root block (every knob stays here)
  components/    shared, token-agnostic: form, table, toast, status,
                 auth, dialog, markdown, menu, session, page (the pp-*
                 helpers), page-regions, composites, mobile
  compose.ts     compose({ theme, components, mobile }) -> string
  themes.ts      back-compat full strings (equivalence-tested)
```

- `compose(theme, ALL)` must equal `themes[theme]` byte-for-byte at the
  first milestone; every later unification step changes exactly the
  selectors listed in the decision table below, nothing else.
- Layers, in declared order:
  `@layer sure.tokens, sure.components, sure.mobile;`
  Consumer CSS is unlayered and therefore always wins. Mobile sits above
  components so narrow-screen tuning never depends on source order.
- Toast unifies to the fixed-position block in every theme (operator
  decision 2026-10-09); dark's static toast is the delta.
- `pp-*` becomes `components.page`, composed into positronic by default;
  the positronic landing is the reference demo.
- Focus rings unify on a `--focus` token with the glow derived via
  `color-mix(in srgb, var(--focus) ~18%, transparent)` (color-mix is
  already in use in dark.ts alerts).

## Drift taxonomy (measured by selector-level diff across all 7 themes)

172 selectors: **86 identical across all seven**, 86 differ, 19 absent from
some themes. The differences are three classes:

1. **Alias gaps — mechanical, zero visual change.** positronic predates the
   alias convention and references `--dark-*` inline; focus/primary/
   primary-hover/field-background have no generic alias anywhere. Fix:
   extend each theme's `:root` with the missing aliases (`--focus`,
   `--primary`, `--primary-hover`, `--field`…) and rewrite component
   references to generics. Alias chains resolve to the same colors.
2. **Genuine design drift — needs canonical decisions.** Table header in
   two styles (highlight-bg nord family vs muted-color dark family);
   table cell padding 0.75rem 1rem vs 0.75rem; input field background as
   `#fff` literal in light themes vs surface tokens in dark; btn-icon
   border `var(--border)` vs `currentColor`; hover tints per theme. Each
   becomes ONE token-driven rule; per-theme values move into tokens.
3. **Omissions — additive fills.** `toast--info`/`status-bar--info`, the
   link/pre rules and slideIn keyframes exist only in positronic;
   `.btn-primary:disabled` and the crud input rules are missing from
   dark+positronic. Canonical: everywhere (additive, gap-filling).

## Phases

- **0.1.10** — `sideEffects: false` only. Pure win, zero API change.
- **0.2.0a (byte-identical reorg) — DONE** (branch
  `feat/components-at-compile-time`): `scripts/split-themes.mjs` slices the
  seven 0.1.9 strings into `src/generated/` (tokens + ordered component
  runs, self-asserting byte-identical reconstruction) plus the frozen
  fixture; `compose()` assembles tokens + selected runs + mobile; the
  exported `themes` strings are compose output, equivalence-tested against
  the fixture. Subpaths: `./compose`, `./themes` (`./components/*` lands
  with the shared blocks in 0.2.0b). Measured: a form-only nord compose is
  4,430 bytes vs 20,625 full (-79%).
- **0.2.0b (unification) — in progress on this branch.** Landed: the four
  byte-identical families (composites, dialog, regions, page) shared with
  the fixture unmoved, and the three whitespace-only families (markdown,
  menu, sessions) normalized — collapse-asserted, +4B to dark/positronic,
  zero bytes elsewhere. Then: buttons (phase 4, --primary trio), toast (phase 5, fixed+--info
  everywhere, --on-error/--on-success picked per theme), table (phase 6,
  --table-header trio), form+modal (phase 7, --field/--focus, semantic
  proofs), and the final four search/crud/sidepanel/status (phase 8,
  toast-model proofs; nord's sidepanel item flagged at its palette-limited
  4.09:1). **0.2.0b DONE: 17 of 18 families shared** (base stays
  per-theme — it IS the typography contract). Only `base` remains
  per-theme by design.
- **sure-factor integration** — depends on `@shing.wong/sure-ui@^0.2.0`;
  catalog yamls declare `sure_ui: [blocks]` (registry test guards drift);
  `generateStyles()` becomes `compose()` over the page's union of blocks;
  notifications.js emitted only for non-inline modes; vendored
  `catalog/assets/themes/*.css` and the divergent `--color-*` vocabulary
  are deleted; the `#b00020` hardcoded error dies for `var(--error-ink)`.
  Generated apps keep zero npm deps — static HTML/CSS/JS only.

## Debug affordances (agent-first)

- Compose output carries per-block section comments
  (`/* sure-ui: form 0.2.0 */`) so rules map back to catalog entries.
- Named layers self-identify in the CSSOM/devtools styles panel.
- Generated components should carry a `data-sure-component="<catalog name>"`
  marker so the DOM ↔ CSS ↔ catalog triangle closes for an agent.
