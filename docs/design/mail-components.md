# Mail components — Track B inventory, tokens, contracts

Status: implemented on `feat/mail-components` (sure-ui) + `feat/mail-components`
(sure-factor). Companion to the 0.2.0 design (`components-at-compile-time.md`);
sure-mail's spec: `plan/modules/trackB-ui-components.md`.

## 1. Inventory — how the repo actually works

Findings that constrain how a new family may be added (each one is guarded
by a test in `src/index.test.ts`):

**Family structure.**

- `src/generated/themes.ts` is **frozen generator output**: per-theme `:root`
  token blocks plus an ordered list of `runs: [family, css][]`. `compose()`
  concatenates runs in order; `base` runs (box-sizing, typography
  consumption) always ship, every other family is selectable.
- 17 of 18 families are **shared**: `src/components/shared.ts` maps family →
  `string[]` of slices, one per non-contiguous run, position-matched by
  `compose()` (family `table` occurs twice, `auth` twice, `toast` twice…).
  Only `base` stays per-theme — it *is* the typography contract.
- `src/__fixtures__/themes-0.1.9.json` is the byte-identity fixture:
  `stripLayers(compose({ theme }))` must equal it for all seven themes.
  Consequence: **neither the generated runs nor anything appended by the
  default `components: 'all'` path may change one byte.**

**Runs compose through three declared layers.**

```
@layer sure.tokens, sure.components, sure.mobile;
```

- `wrap()` contributes exactly `{` + `\n` … `\n` + `}`; `stripLayers()` strips
  positionally and throws on anything else — layer scaffolding may never
  smuggle a content byte.
- Consumer CSS is unlayered and always wins; `extra` is deliberately injected
  *inside* the components layer (the sure-factor e2e caught an unlayered 4px
  override beating a 6px theme rule).
- `src/styles/mobile.ts` (`mobileLayer`) is appended verbatim to every theme;
  `index.test.ts` slices each shipped theme from the `/* ── Mobile & touch`
  marker to EOF and asserts the seven slices are byte-identical.
  **Consequence: `mobile.ts` may not be edited** — a change there breaks both
  the fixture test and the byte-identical slice test.

**Where tokens live.**

- All theme knobs are `:root` variables in `generated/themes.ts` (the site
  extracts `:root` blocks). The shared vocabulary is the generic aliases —
  `--bg/--surface/--text/--muted/--border/--accent/--error/--success/--warn/
  --highlight`, the `*-ink`/`--on-*` pair, `--field`, `--focus`, `--primary*`,
  `--table-*`, `--toast-*`, `--status-*`, `--sidepanel-*`, plus the
  typography contract (`--font-body/--font-mono/--font-size/--line-height`).
  Component blocks reference *only* these — the regions test even fails a hex
  literal inside promoted component CSS.

**How to add a family without breaking those invariants** (the recipe the mail
families follow):

1. Do not touch `src/generated/themes.ts`, `src/__fixtures__/*` or
   `src/styles/mobile.ts`.
2. Put the family's CSS in a new module (`src/components/mail.ts`), styled
   only with the generic aliases + its own `--mail-*` tokens, no hex, no
   `font-family` (typography is the contract's job).
3. Register the name in `COMPONENTS` — but keep it **opt-in**: the default
   `components: 'all'` path must not emit it, or byte-identity dies. The
   drift test that compares `COMPONENTS` against the families carried in the
   generated runs was updated to expect exactly this split (generated
   families == `COMPONENTS` minus `MAIL_COMPONENTS`).
4. Mail tokens are appended **inside the `sure.tokens` wrap**, mail CSS at the
   end of the `sure.components` wrap, mail touch rules at the end of the
   `sure.mobile` wrap — all only when a mail family was explicitly selected.
   Layer purity holds; the three-layer statement and ordering tests pass
   unchanged because they run on default composes.
5. Mobile behaviour for mail (hover reveals, 44px targets) lives in
   `src/styles/mail-mobile.ts`, appended after `mobileLayer` inside the same
   `sure.mobile` block — the shared layer bytes stay untouched, so the
   byte-identical assertion still sees exactly what it saw before.

## 2. Token strategy — what a skin overrides

`src/styles/mail-tokens.ts`, emitted in `@layer sure.tokens` whenever any
`mail-*` family is selected. Rules:

- **Defaults resolve through the generic aliases only** (no palette of its
  own), so every mail layout works in all seven themes — light and dark —
  before a skin exists. No hex, no `rgb()`, no `font-family` in the block.
- A skin (Gmail/Outlook/MacMail/Thunderbird, or sure-mail's M5) re-lands its
  look by writing **unlayered `:root` overrides of these vars only** —
  component CSS is never touched (proven by `experiments/mail-gmail/`).
- `--font-size` scales the rem-based knobs (vision themes at 112.5%+ get
  bigger rows for free); nothing re-declares `--font-body`.

| Token | Default | Meaning / skin override |
|---|---|---|
| `--mail-density` | `1` | One knob scales every row/target (rem multiplier). `--compact` list sets `0.72` |
| `--mail-list-row-h` | `calc(2.5rem * var(--mail-density))` | Row height — 40px at default scale (Gmail's target) |
| `--mail-list-lines` / `--mail-list-line-h` | `1` / `calc(1.25rem * var(--mail-density))` | Stacked-row maths (Outlook): `.sure-mail-list--stacked` sets lines `2`; each extra line adds `--mail-list-line-h` to the row's min-height |
| `--mail-list-pad-x` / `--mail-list-sender-w` | `0.75rem` / `10rem` | Row padding; fixed sender column |
| `--mail-unread-weight` | `700` | Unread rows' font weight |
| `--mail-unread-bg` | `color-mix(4% accent, surface)` | Unread tint (Gmail: `#f6fafe`) |
| `--mail-accent-alias` | `var(--accent)` | Mail accent, decoupled from the host page |
| `--mail-accent-ink` | `var(--on-accent)` | Ink on solid accent (override **with** the alias) |
| `--mail-flag-ink` | `var(--warn-ink)` | Flagged/starred colour (Gmail: amber) |
| `--mail-list-bg`, `--mail-list-border`, `--mail-radius` | surface/border/`0.5rem` | The white rounded list card |
| `--mail-list-row-bg`, `--mail-hover-bg`, `--mail-list-row-border` | surface / `color-mix(5% text)` / highlight | Row states — shared by rows, rail, tools, chips |
| `--mail-selected-bg` | `color-mix(12% accent, surface)` | Selected/open message row |
| `--mail-pane-bg`, `--mail-pane-border`, `--mail-pane-header-bg`, `--mail-thread-body-fg` | surface/border/surface/text | Reading-pane regions |
| `--mail-quote-bg` | highlight | Collapsed quoted-history region |
| `--mail-attachment-bg` | field | Attachment chips |
| `--mail-tree-indent`, `--mail-tree-depth`, `--mail-tree-item-radius` | `1.25rem`, `0`, `var(--mail-radius)` | Indentation maths (depth set per row by markup), rail pill radius (Gmail: `999px`) |
| `--mail-tree-selected-bg`, `--mail-tree-count-bg`, `--mail-tree-count-ink` | accent tint/highlight/text | Rail selection + unread count badges |
| `--mail-chip-bg`, `--mail-chip-ink` | highlight/text | Address chips |
| `--mail-action-size`, `--mail-icon-size`, `--mail-action-radius`, `--mail-action-pressed-bg` | `1.75rem`/`1.125rem`/`var(--mail-radius)`/accent tint | Icon-button strip geometry (Gmail: radius `50%`) |
| `--mail-search-bg`, `--mail-search-border`, `--mail-search-radius` | field/border/`var(--mail-radius)` | Search field (Gmail: grey pill) |

All of it sits in `sure.tokens` (lowest layer), so any unlayered consumer
block — a skin, a page, a per-app override — wins without specificity
arithmetic.

## 3. Component class contracts (sure-ui)

Six new families in `src/components/mail.ts`, each selectable through
`compose({ theme, components: ['mail-list', …] })` (additive: base typography
+ theme tokens always included; `mobile: true` appends `mailMobile` inside
`sure.mobile`). Naming follows the repo's BEM-ish `sure-*` contract; states
use modifier (`--unread`) or state-hook (`.is-selected`) classes exactly like
the existing families.

| Family | Classes |
|---|---|
| `mail-list` | `.sure-mail-list`, `--comfortable`, `--compact`, `--stacked` (two-line rows, drives `--mail-list-lines: 2`) · `.sure-mail-row`, `--unread`, `--flagged`, `--has-attachment`, `--selected`, `[aria-selected="true"]` · `__check`, `__flag`, `__sender`, `__main`, `__subject`, `__preview`, `__attachments`, `__time`, `__actions` (hover-action slot) |
| `mail-thread` | `.sure-mail-thread` · `__header`, `__title`, `__meta`, `__from`, `__date`, `__body`, `__quote-toggle`, `__quote` (+ `.is-collapsed`), `__attachments`, `__attachment` |
| `mail-folder-tree` | `.sure-mail-tree` · `__item` (+ `.is-selected`, `.is-dragging`, `.is-drop-target`, `[aria-current]`), `__twisty`, `__icon`, `__label`, `__count`, `__drag` (affordance slot) · depth via `--mail-tree-depth` set per row |
| `mail-compose` | `.sure-mail-compose` · `__address`, `__label`, `__chips` (focus-within ring), `__chip`, `__chip-remove`, `__input`, `__subject`, `__toolbar`, `__tool`, `__tool-divider`, `__body`, `__footer`, `__status`, `__actions` |
| `mail-action-bar` | `.sure-mail-action-bar` · `.sure-mail-action`, `--archive --junk --delete --move --flag --snooze`, `--flagged`, `[aria-pressed="true"]` — icons are consumer-supplied inline SVG inheriting `currentColor` (the repo has no icon sprite; `.sure-menu__item` precedent) |
| `mail-search` | `.sure-mail-search` · `__input` (+ `[aria-invalid]`), `__filters`, `__chip` (+ `.is-active`, `[aria-pressed="true"]`) |

**Mobile behaviour** (`src/styles/mail-mobile.ts`, colour-free like the shared
layer): ≤640px tightens row padding and wraps the compose toolbar;
`(hover: none)` reveals the hover-only row actions (same reveal pattern as
`.message .msg-actions`); `(pointer: coarse)` bumps rows/rail items to 44px
targets and icon buttons to 44×44.

**A11y**: `:focus-visible` rings on every actionable element (derived from
`--focus` + `color-mix`, the repo's ring idiom); aria state hooks styled where
the repo already styles aria (`aria-invalid`, plus `aria-selected`,
`aria-pressed`, `aria-current`).

## 4. sure-factor catalog entries

The registry drift test validates `sure_ui` blocks against **the installed
`@shing.wong/sure-ui` COMPONENTS export (0.2.0 from npm)** — the mail
namespace is not published (this branch publishes nothing). The three new
yamls therefore declare only families the published package exports:

- `account-settings.yaml` — email account profile form (address, incoming
  host/port/TLS/user, outgoing host/port/TLS, auth method) → `form`, `buttons`.
- `mail-search-filter.yaml` — search + facet filters → `search`, `buttons`.
- `contact-form.yaml` — name/email/message → `form`, `buttons`.

Each keeps every registry invariant: `sure_ui` non-empty, `buttons` declared
(template always emits `btn-primary`), `cssClasses` families ⊆ `sure_ui`.
A catalog entry that generated *mail* markup (`sure-mail-*` classes) would
have to declare `mail-list`-style blocks, which the published sure-ui cannot
style — that lands when sure-ui publishes the mail namespace; noted here so
the skip is deliberate, not an oversight.

## 5. Gmail-fidelity reference composition

`experiments/mail-gmail/` — `index.html` (shell CSS is page chrome, all
component markup uses only the contracts above), `build.mjs` (composes the six
families + `buttons`/`page` over theme nord via `dist/compose.js` →
`mail-gmail.css`, generated and git-ignored), `gmail-skin.css` (**unlayered
token/`--var` overrides only** — Roboto-first stack, `#1a73e8` accent,
`40px` rows, `999px` rail pills, `#f1f3f4` page / white card, `#f6fafe`
unread rows, amber flag, `#c2e7ff` compose pill), `serve.mjs`,
`check-fidelity.mjs`, `screenshot.md`.

**Status: done, measured (2026-10-16) — 15/15 fidelity checks pass**
(`node experiments/mail-gmail/check-fidelity.mjs`, playwright already in
devDeps): Roboto-first stack, accent `rgb(26, 115, 232)`, rows `40px`,
rail radius `999px`, white card on `rgb(241, 243, 244)`, unread `700` on
`rgb(246, 250, 254)`, hover actions `none → flex` with the time swapping
out, layer statement first, zero console errors. Screenshot:
`docs/fidelity/gmail-list.png`. One catch worth remembering: the generated
CSS comes from `dist/`, so `npm run build` must precede `build.mjs` after any
`src/` edit (the first run shipped stale icon-sizing rules — recorded here so
the runbook's first step stays load-bearing).

## 5b. Outlook Online-fidelity reference composition — what the second skin proved

`experiments/mail-outlook/` — same five-file shape as mail-gmail:
`index.html` (page chrome only; all mail markup on the §3 contracts),
`build.mjs` (same compose list → `mail-outlook.css`, git-ignored),
`outlook-skin.css` (**unlayered `:root` token overrides only**),
`serve.mjs`, `check-fidelity.mjs`, `screenshot.md`.

**Status: done, measured (2026-10-16) — 31/31 fidelity checks pass**
(`node experiments/mail-outlook/check-fidelity.mjs`; Gmail's 15/15 still
pass on the same `src/`): Segoe UI-first at 14px, `#0078d4` accent with the
`#106ebe` hover, Fluent 4px buttons / 8px cards / 4px toolbar icons, white
app bar with a centered `999px` `#f0f0f0` search pill, two-line 56px rows
with the time on line 1's right edge, bold unread + round `#0078d4` dot,
`#eff6fc` selected rows, `#f3f2f1` selected folder with plain-text counts,
icon toolbar above the header card. Screenshots:
`docs/fidelity/outlook-list.png` + `docs/fidelity/outlook-thread.png`.

**The token strategy held — with two additions.** Every Gmail-proven knob
(accent, selected/unread tints, hover, radii, search, tree counts, pane
regions) absorbed the Fluent palette without a component rule changing.
Two things did need work:

- **What broke the one-line assumption: row height.** Gmail's
  `--mail-list-row-h` models a *one-line* row; Outlook's rows are two lines
  (sender · time / subject · preview). A scalar row-height token cannot
  express "wrap the middle child to a second full-width line". The fix is
  the opt-in list modifier **`.sure-mail-list--stacked`** + two tokens:
  `--mail-list-lines` (the modifier sets `2`; geometry is
  `row-h + (lines−1) × --mail-list-line-h`) and `--mail-list-line-h`.
  Purely additive: no rule outside a `.sure-mail-list--stacked` selector
  wraps or reorders anything, the default single-line rules ship byte-stable
  (`mail.test.ts` proves both, plus layer placement and neutrality), and the
  mobile block needed no edit — `mail-mobile`'s 44px coarse-pointer floor
  already covers stacked rows. This is the family recipe from §1 working as
  intended: the second skin found a missing *capability*, it added an
  opt-in modifier + tokens, not a fork.
- **What needed a consumer page, not a token (by design).** Three Outlook
  affordances map to markup/state, not colour: the **Focused/Other pivot**
  (composed from `mail-search` chips; chrome flips pill → underline —
  a state→presentation mapping only the page can make), the **unread dot +
  hover-checkbox** swap (consumer markup in the `__check` slot, coloured by
  `--mail-accent-alias`), and the `btn-primary` 4px radius (the buttons
  family's 6px is not tokenized — a `--btn-*` radius token is a candidate
  if a future skin needs it). All three live in the demo's chrome block,
  which is exactly what the layer model predicts: tokens for colour and
  geometry, unlayered consumer CSS for structure.

**No fourth "tabs" family was added** — the pivot is two chips restyled by
the page; it is not yet reusable enough across skins (Mac Mail uses sidebar
selection, Thunderbird real tabs) to justify a family. Revisit at M5 if the
remaining skins converge on it.

Remaining skins: Mac Mail, then Thunderbird (D6), on the same recipe.

## 5c. macOS Mail-fidelity reference composition — what the third skin proved

`experiments/mail-macmail/` — same five-file shape as mail-gmail and
mail-outlook: `index.html` (page chrome only; all mail markup on the §3
contracts), `build.mjs` (same compose list → `mail-macmail.css`,
git-ignored), `macmail-skin.css` (**unlayered `:root` token overrides
only**), `serve.mjs`, `check-fidelity.mjs`, `screenshot.md`.

**Status: done, measured (2026-10-16) — 43/43 fidelity checks pass**
(`node experiments/mail-macmail/check-fidelity.mjs`; Gmail's 15/15 and
Outlook's 31/31 still pass on the same `src/`): SF Pro/system-first stack at
13px, `#0a84ff` system blue with `#ff9500` flags, 44px single-line rows,
`#d6e7fb` selected rows *and* selected sidebar item, bold unread + round
blue dot on un-tinted white, a Favorites/Mailboxes vibrancy sidebar with
plain grey counts, hairline-divided flush panes, pill search at the right
of the list header, a window toolbar with traffic-light dots, and a
floating compose window. Screenshots: `docs/fidelity/macmail-list.png` +
`docs/fidelity/macmail-thread.png`. Mobile needed nothing: the shared
`mobileLayer` + `mailMobile` ship verbatim (`mobile: true` is compose's
default), asserted by the checker reading both markers out of the built CSS.

**The token strategy held — again without a component change.** What the
third skin added to the argument:

- **Hairlines beat cards, and it is a token job.** The whole "one
  continuous surface" look is `--mail-radius: 0px`, a hairline
  `--border: #e5e5ea` (rows a half-step lighter via
  `--mail-list-row-border`), `--mail-pane-border: transparent`, and exactly
  **one** structural reset (`.app-main .sure-mail-list { border: none }` —
  the §5b recipe) so the list's own border doesn't double the pane hairline.
  No shadow token was ever needed — the list never had a shadow — but the
  checker now measures `box-shadow: none` + radius `0px` + border `0px` so
  the flatness can't silently regress into a card.
- **Density came from the row-height token alone.** 44px is
  `calc(44px * var(--mail-density))` plus `--font-size: 81.25%` (a 13px
  root tightens every rem knob at once — that *is* the macOS density). No
  stacked modifier, no new token: the single-line default row carried
  "sender → subject — preview … time right" at the middle density. The
  three skins now bracket the knob's range from the outside: 40 (Gmail) /
  44 (Mac) / 56 two-line (Outlook).
- **Translucency is a page material; the skin supplies its colours.** No
  component paints a sidebar, so vibrancy lives in the shell as a
  two-token pair: `--mail-sidebar-fallback` (solid `#f2f2f7`) painted
  outside `@supports`, `--mail-sidebar-bg` (translucent) + 
  `backdrop-filter: saturate(180%) blur(20px)` inside it. The checker
  doesn't trust headless rendering — it walks `cssRules` to prove the
  fallback is genuinely wired where blur can't composite, and that the
  upgrade sits behind `@supports`. Any future vibrancy consumer should copy
  that pair.
- **State → markup mappings, round three.** The window's traffic-light dots
  reuse the status aliases (`--error/--warn/--success`) instead of inventing
  a token namespace — same move as §5b's Focused/Other chips. The unread
  dot sits absolutely positioned over the reserved `__check` slot so sender
  columns never shift between read and unread rows. Flags hide at rest and
  reveal on hover (the reserved slot again) — except `--flagged` rows keep
  theirs visible, macOS behaviour that only page-level state CSS can
  express. Sidebar section labels ("Favorites" / "Mailboxes") are plain
  markup between two `mail-folder-tree` instances — the family needed no
  section support.
- **One token gap found: attachment chips go square at radius 0.**
  `.sure-mail-thread__attachment` hardcodes `border-radius:
  var(--mail-radius)`, so a flat skin rounds nothing — right for panes,
  slightly off for chips (macOS rounds them ~5px). Same class of gap as
  §5b's `--btn-*` radius: a `--mail-attachment-radius` token (defaulting to
  `var(--mail-radius)`) is the candidate if a future skin needs round
  chips; deliberately not added, because nothing here requires it. Two
  smaller notes for the next skin: the shell still scopes `font-size` on
  tree items (back to the 13px contract size — the family ships `0.9rem`)
  and `padding` on the search input (room for its icon) — both are
  consumer-scoped geometry where a future token could take over — and the
  compose window's 10px corner + shadow are page-*window* chrome, not
  component skinning.

Remaining skin: Thunderbird (D6), on the same recipe.

## 5d. Thunderbird 115 "Supernova"-fidelity reference composition — what the fourth skin proved (or breaks)

`experiments/mail-thunderbird/` — the same shape as mail-macmail before it:
`index.html` (page chrome
only; all mail markup on the §3 contracts), `build.mjs` (same compose list →
`mail-thunderbird.css`, git-ignored), `thunderbird-skin.css` (**unlayered
`:root` token overrides only**), `serve.mjs`, `check-fidelity.mjs`,
`screenshot.md` (+ the one-line `.gitignore` for the generated CSS).

**Status: done, measured (2026-10-16) — 55/55 fidelity checks pass**
(`node experiments/mail-thunderbird/check-fidelity.mjs`; Gmail's 15/15,
Outlook's 31/31 and Mac Mail's 43/43 still pass on the same `src/`): system
UI stack at 14px, Bolt blue `#1373d9` chrome (New Message, open folder, tab
line, selection), a **rounded-top tab bar above the panes** (`4px 4px 0 0`
tabs at Thunderbird's own `--tab-min-height: 33px`, 16px labels, a 2px
accent `.tab-line` 3px below the tab's top, close ✕ on every tab but the
first, active tab painted with the toolbar grey so it flows into the
toolbar), the unified toolbar under it (32px icon buttons / 16px glyphs /
3px control radius, `#d4d4d8` chrome separator, search field pinned right),
a `#f4f4f5` folder pane with the open folder solid `#1373d9` + white ink,
grey `#71717a` count pills and **coloured special-folder icons** (Drafts
`#ae55f7`, Sent `#1d783b`, Junk `#b91c1c`, Archive `#713f12`, Trash
`#52525b`), white **3px cards on `#fafafa`** with `#d9d9de` hairlines and
46px single-line rows, bold unread on un-tinted white with a **green**
`#16a34a` dot, warm `#ea580c` flags, `#dceaf9` selected rows, `#e7f1fb`
row hover, a toolbar over the header card, quote + attachment affordances,
and the 22px status footer. Screenshots: `docs/fidelity/thunderbird-list.png`
+ `docs/fidelity/thunderbird-thread.png`.

**Colour provenance (no value guessed).** Every hex was pinned from
Thunderbird's own theme source — comm-central `mail/themes/shared/mail/`
fetched live via searchfox.org source pages and `hg.mozilla.org`
`raw-file` (rev a430595f, 2026-10-15): `colors.css` (the **Bolt** design
system palette), `layout.css` (the `--layout-background/color/border` scales
that produce the chrome greys), `variables.css` (`--tab-min-height`,
`--button-border-radius`, `--chrome-content-separator-color`), `tabmail.css`
(tab geometry), `threadPane.css` + `threadCard.css` (flag, unread, cards),
`tree-listbox.css` (card borders + the 10%/15% selection tints),
`about3Pane.css` (folder pane) and `folderColors.css` (folder icon
accents). The Bolt colour page cited inside `colors.css`
(`bolt.thunderbird.net/…/61e4c7-color`) is a JS app that returns no
text, so the palette was taken from its canonical copy in `colors.css`
itself. Every committed hex is a measured expectation in
`check-fidelity.mjs`.

**What the fourth skin corrects in the fidelity table (M5).** Three
landmarks in `plan/modules/M5-skins.md`'s "accent purple/fluency, 16px
tabs" row do not survive contact with the source:

- **The chrome accent is blue, not purple.** Supernova's primary is Bolt
  `--color-primary-default-light: #1373d9` (identical to `--color-blue-60`),
  and selection/`--tabline-color`/folder-active all key off it. Purple is
  real but *secondary*: `--color-secondary-default-light: #6b21a8`,
  `--color-accent-purple-light: #ae55f7`, reply marks
  (`--color-purple-50`) — and, the one purple a mail client shows on every
  load, **`--folder-color-draft: #ae55f7`, Thunderbird's purple Drafts
  icon**. That is where this skin's purple lives, asserted like everything
  else. The 2023 brand refresh (blog.thunderbird.net, Jon Hicks) is a
  *blue* elemental bird — the palette follows.
- **Unread is a green dot, not an accent dot.** `threadPane.css` sets
  `--thread-pane-unread-fill: color-green-60 (#16a34a)` and
  `threadCard.css` paints unread cards' read-status dot green (yellow
  sparkle for *new*), identically in cards and table views. The demo
  follows the source; the dot still sits in the
  row's reserved `__check` slot (§5c's trick), so the accent would be a
  one-token change if M5 wants it.
- **The search field is a 3px rounded rect, not a pill.** Thunderbird's
  toolbar fields use `--input-search-border-radius:
  var(--button-border-radius)` = 3px, like every other control. One
  `--mail-radius: 3px` covers it.

Two anatomy notes for the record: Thunderbird's own window puts the unified
*toolbar above* the tab bar and the spaces switcher in a **left icon rail**
(official Thunderbird 115 "Getting Started" guide, blog.thunderbird.net) —
this composition follows the B4 spec's
tab-bar-over-toolbar ordering and renders the four spaces as tabs (that
guide confirms real Thunderbird shows the tab bar only with ≥2 open tabs,
e.g. a Mail tab and a Calendar tab), with tabmail.css's exact tab geometry.

**The token strategy held — no component change, fourth time.** What this
skin added to the argument:

- **The 3px cascade.** One `--mail-radius: 3px` (= Thunderbird's
  `--listbox-border-radius` *and* its `--button-border-radius`) restyled the
  list, every row card, the tree items, the search field, the quote block
  and the attachment chips at once — §5c's `--mail-attachment-radius` gap
  closed itself because the chips *want* the shared radius here. Skins turn
  knobs; they don't reach into selectors.
- **Per-row cards are structure, so the shell owns the box.** Thunderbird's
  card view gives every row its own bordered, gapped card where Gmail has
  one frame. The frame removal is §5b's reset again
  (`.app-main .sure-mail-list { border: none }`), plus padding/gap matching
  `tree-listbox.css`'s card spacing (2px/3px inline, 4px between neighbours)
  and a `border: 1px solid var(--mail-list-row-border)` + `border-radius:
  var(--mail-radius)` per row — geometry through tokens, structure in the
  consumer block, zero literal colours (hover/selection border tints are
  `color-mix`es of `--mail-accent-alias`, mirroring
  `--tree-card-border-hover/-selected`). A future `.sure-mail-list--cards`
  modifier is the reusable version of this; three skins did not need it, so
  it is documented here rather than shipped.
- **Skin-defined vars, now under Thunderbird's own names.** The §5c
  pattern (`--mail-sidebar-*`: colours in the skin, structure in the
  shell) generalised: `--thread-pane-unread-fill`,
  `--treeitem-background-hover`, `--chrome-content-separator-color` and the
  `--folder-color-*` set are Thunderbird's variable names verbatim, so every
  shell rule traces to a line in comm-central. Folder icon colours are
  pure state→token mapping (`[data-folder="draft"] → var(--folder-color-draft)`).
- **One hover token is now provably too small.** Rows hover `#e7f1fb`
  (accent 10%), folder rows `#e4e4e7` (grey-20), toolbar buttons
  `currentColor 10%` — three different colours in one skin. The first comes
  from `--mail-hover-bg`; the other two are shell rules (one token-backed,
  one `color-mix`). If a fifth skin needs them, `--mail-tree-hover-bg` +
  `--mail-tool-hover-bg` are the candidate tokens — noted, not added, since
  the shell already expresses both with no colour literals.
- **The tab bar stayed out of the component set.** Second skin in a row
  composing tabs from `mail-search` chips (the §5b Focused/Other
  precedent): the family gives state (`is-active`, `[aria-pressed]`) and
  accent colour, the shell gives Thunderbird's tab shape. §5b's "revisit at
  M5" happened — two skins now do it, so at sure-mail M5 a shared
  "tabs-from-chips" snippet (or a real family) is justified; until then the
  demo's chrome block is the composition.
- **Typography stayed the contract.** `--font-body: system-ui, …` +
  `--font-size: 87.5%` (14px) — the rem knobs scale with it (the folder
  tree's `2rem` row floor becomes 28px and rows render ~31px with their
  padding, against Thunderbird's 26px `--list-item-min-height` floor). The
  only shell-scoped type is page chrome — the 16px tab label (the spec's
  `~16px+`), the tree item's `1rem` restore and the section/status
  micro-labels — the same consumer-scoped note §5c raised.

**The four-skin endgame (what M5 inherits).** Gmail (15/15), Outlook Online
(31/31), Mac Mail (43/43), Thunderbird (55/55) — **144 measured fidelity
checks over one component set**: six families, one token block, and exactly
**one** component change across all four skins (§5b's opt-in
`.sure-mail-list--stacked` modifier + its two tokens; default rules
byte-stable, proven by `mail.test.ts` and by the three other checkers). Four
token surfaces — Roboto/dense/999px pills, Segoe/Fluent/stacked,
system/hairline/vibrancy, system/card-view/rounded tabs — are 100% unlayered `:root`
overrides plus page structure; zero per-skin component forks, zero hexes in
component CSS, the shared `mobileLayer` + `mailMobile` shipping verbatim in
all four (asserted by each checker). sure-mail's M5 therefore lands as:
compose the same six families, drop in `packages/skins/<name>/` token files
shaped like these four, and add the page-structure block for whichever
landmarks the skin needs (tabs, vibrancy, card gaps) — the recipe, not a
fork.

D6 complete: Gmail → Outlook → Mac Mail → Thunderbird, all measured and
accepted.
