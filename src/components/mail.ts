// Mail component families (sure-mail Track B): mail-list, mail-thread,
// mail-folder-tree, mail-compose, mail-action-bar, mail-search.
//
// Shape follows shared.ts — family → slice list — but these are an OPT-IN
// namespace: they never ride along with compose()'s default `components:
// 'all'` path (the frozen 0.1.9 fixture pins that byte-for-byte), and their
// tokens/mobile rules are appended by compose() only when one of these
// families is explicitly selected. Design doc: docs/design/mail-components.md
//
// Styling rules (same as the promoted region blocks):
//   - colour only via the generic aliases and the --mail-* tokens — no hex,
//     no rgb()/hsl(): fidelity is a skin's job, proven in
//     experiments/mail-gmail/ where the whole Gmail look is token overrides;
//   - no font-family: the typography contract (--font-body/--font-size/
//     --line-height) owns text, and `font: inherit` keeps widgets in step;
//   - focus rings derive from --focus via color-mix, the repo's idiom.
export const mail: Record<string, string[]> = {
  'mail-list': [`

/* ── Mail list ── */
.sure-mail-list {
  display: flex; flex-direction: column;
  background: var(--mail-list-bg);
  border: 1px solid var(--mail-list-border);
  border-radius: var(--mail-radius);
  overflow: hidden;
}
.sure-mail-list--comfortable { --mail-density: 1; }
.sure-mail-list--compact { --mail-density: 0.72; }

.sure-mail-row {
  display: flex; align-items: center; gap: 0.5rem;
  min-height: var(--mail-list-row-h);
  padding: 0.25rem var(--mail-list-pad-x);
  background: var(--mail-list-row-bg);
  border-bottom: 1px solid var(--mail-list-row-border);
  color: var(--text);
  cursor: pointer;
}
.sure-mail-row:last-child { border-bottom: none; }
.sure-mail-row:hover { background: var(--mail-hover-bg); }
.sure-mail-row--unread {
  font-weight: var(--mail-unread-weight);
  background: var(--mail-unread-bg);
}
.sure-mail-row--selected,
.sure-mail-row[aria-selected="true"] { background: var(--mail-selected-bg); }
.sure-mail-row:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--focus);
}

.sure-mail-row__check {
  flex-shrink: 0; display: inline-flex; align-items: center;
  color: var(--muted);
}
.sure-mail-row__flag {
  flex-shrink: 0; display: inline-flex; align-items: center;
  padding: 0; border: none; background: transparent;
  color: var(--muted); font: inherit; line-height: 1; cursor: pointer;
}
.sure-mail-row__flag:hover { color: var(--text); }
.sure-mail-row--flagged .sure-mail-row__flag { color: var(--mail-flag-ink); }
.sure-mail-row--has-attachment .sure-mail-row__attachments { color: var(--text); }
.sure-mail-row__sender {
  flex: 0 0 var(--mail-list-sender-w);
  min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sure-mail-row__main {
  flex: 1 1 auto; min-width: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.sure-mail-row__subject { font-weight: inherit; }
.sure-mail-row__preview { color: var(--muted); }
.sure-mail-row__attachments {
  flex-shrink: 0; display: inline-flex; align-items: center;
  color: var(--muted); font-size: 0.8rem;
}
.sure-mail-row__time {
  flex-shrink: 0; margin-left: auto;
  font-size: 0.75rem; color: var(--muted);
}
.sure-mail-row__actions {
  display: none; flex-shrink: 0; gap: 0.15rem; align-items: center;
}
.sure-mail-row:hover .sure-mail-row__actions,
.sure-mail-row:focus-within .sure-mail-row__actions { display: flex; }
/* Swap time for actions on the same right-hand edge, so revealing the slot
   never shifts the row (and touch keeps its clock — see mail-mobile). */
.sure-mail-row:hover .sure-mail-row__time,
.sure-mail-row:focus-within .sure-mail-row__time { display: none; }`],

  'mail-thread': [`

/* ── Mail thread (reading pane) ── */
.sure-mail-thread {
  display: flex; flex-direction: column;
  background: var(--mail-pane-bg);
  border: 1px solid var(--mail-pane-border);
  border-radius: var(--mail-radius);
  overflow: hidden;
}
.sure-mail-thread__header {
  padding: 1rem 1.25rem;
  background: var(--mail-pane-header-bg);
  border-bottom: 1px solid var(--mail-list-row-border);
}
.sure-mail-thread__title {
  margin: 0 0 0.75rem;
  font-size: 1.15rem; font-weight: 700; color: var(--text);
}
.sure-mail-thread__meta {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 1rem; font-size: 0.85rem;
}
.sure-mail-thread__from { font-weight: 600; color: var(--text); }
.sure-mail-thread__date { color: var(--muted); font-size: 0.8rem; white-space: nowrap; }
.sure-mail-thread__body {
  flex: 1 1 auto; padding: 1rem 1.25rem;
  color: var(--mail-thread-body-fg);
  line-height: var(--line-height, 1.6);
  overflow-wrap: break-word;
}
.sure-mail-thread__quote-toggle {
  display: inline-flex; align-items: center; gap: 0.4rem;
  margin: 0.75rem 0 0; padding: 0.35rem 0.75rem;
  border: 1px solid var(--mail-list-border);
  border-radius: 999px;
  background: var(--mail-quote-bg); color: var(--muted);
  font: inherit; font-size: 0.8rem; cursor: pointer;
}
.sure-mail-thread__quote-toggle:hover { color: var(--text); }
.sure-mail-thread__quote-toggle:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 25%, transparent);
}
.sure-mail-thread__quote {
  margin-top: 0.75rem; padding: 0.75rem 1rem;
  background: var(--mail-quote-bg);
  border-radius: var(--mail-radius);
  color: var(--muted); font-size: 0.9rem;
}
.sure-mail-thread__quote.is-collapsed { display: none; }
.sure-mail-thread__attachments {
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--mail-pane-header-bg);
  border-top: 1px solid var(--mail-list-row-border);
}
.sure-mail-thread__attachment {
  display: inline-flex; align-items: center; gap: 0.4rem;
  max-width: 100%; padding: 0.35rem 0.7rem;
  border: 1px solid var(--mail-list-border);
  border-radius: var(--mail-radius);
  background: var(--mail-attachment-bg);
  color: var(--text); font-size: 0.8rem;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sure-mail-thread__attachment:hover { background: var(--mail-hover-bg); text-decoration: none; }`],

  'mail-folder-tree': [`

/* ── Mail folder tree ── */
.sure-mail-tree { display: flex; flex-direction: column; gap: 2px; }
.sure-mail-tree__item {
  display: flex; align-items: center; gap: 0.5rem;
  min-height: calc(2rem * var(--mail-density));
  padding: 0.25rem 0.5rem 0.25rem
    calc(0.75rem + var(--mail-tree-indent) * var(--mail-tree-depth));
  border: 1px solid transparent;
  border-radius: var(--mail-tree-item-radius);
  color: var(--text); font-size: 0.9rem;
  cursor: pointer;
}
.sure-mail-tree__item:hover { background: var(--mail-hover-bg); }
.sure-mail-tree__item.is-selected,
.sure-mail-tree__item[aria-current] {
  background: var(--mail-tree-selected-bg);
  font-weight: 600;
}
.sure-mail-tree__item:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 25%, transparent);
}
.sure-mail-tree__twisty {
  flex-shrink: 0; width: 1rem; padding: 0; border: none;
  background: transparent; color: var(--muted);
  font: inherit; text-align: center; cursor: pointer;
}
.sure-mail-tree__icon {
  flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
  width: 1.25rem; height: 1.25rem; color: var(--muted);
}
.sure-mail-tree__icon svg { width: 100%; height: 100%; display: block; }
.sure-mail-tree__item.is-selected .sure-mail-tree__icon { color: inherit; }
.sure-mail-tree__label {
  flex: 1 1 auto; min-width: 0;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sure-mail-tree__count {
  flex-shrink: 0; min-width: 1.5rem; padding: 0 0.45rem;
  border-radius: 999px;
  background: var(--mail-tree-count-bg); color: var(--mail-tree-count-ink);
  font-size: 0.75rem; font-weight: 600; line-height: 1.4; text-align: center;
}
.sure-mail-tree__drag {
  display: none; flex-shrink: 0; padding: 0; border: none;
  background: transparent; color: var(--muted);
  font: inherit; cursor: grab;
}
.sure-mail-tree__item:hover .sure-mail-tree__drag,
.sure-mail-tree__item:focus-within .sure-mail-tree__drag { display: inline-flex; }
.sure-mail-tree__item.is-dragging { opacity: 0.5; }
.sure-mail-tree__item.is-drop-target { box-shadow: inset 0 0 0 2px var(--mail-accent-alias); }`],

  'mail-compose': [`

/* ── Mail compose ── */
.sure-mail-compose {
  display: flex; flex-direction: column;
  background: var(--mail-pane-bg);
  border: 1px solid var(--mail-pane-border);
  border-radius: var(--mail-radius);
  overflow: hidden;
}
.sure-mail-compose__address {
  display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--mail-list-row-border);
}
.sure-mail-compose__label {
  flex-shrink: 0; min-width: 2.5rem;
  font-size: 0.8rem; color: var(--muted);
}
.sure-mail-compose__chips {
  flex: 1 1 12rem; min-width: 0;
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem;
  padding: 0.15rem;
  border: 1px solid transparent; border-radius: var(--mail-radius);
}
.sure-mail-compose__chips:focus-within {
  border-color: var(--focus);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 20%, transparent);
}
.sure-mail-compose__chip {
  display: inline-flex; align-items: center; gap: 0.35rem;
  max-width: 100%; padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: var(--mail-chip-bg); color: var(--mail-chip-ink);
  font-size: 0.8rem;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sure-mail-compose__chip-remove {
  padding: 0; border: none; background: transparent;
  color: inherit; opacity: 0.6;
  font: inherit; line-height: 1; cursor: pointer;
}
.sure-mail-compose__chip-remove:hover { opacity: 1; }
.sure-mail-compose__chip-remove:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 25%, transparent);
  border-radius: 999px;
}
.sure-mail-compose__input {
  flex: 1 1 6rem; min-width: 6rem;
  padding: 0.25rem; border: none; border-radius: 4px;
  background: transparent; color: var(--text);
  font: inherit; font-size: 0.9rem;
}
.sure-mail-compose__input:focus { outline: none; }
.sure-mail-compose__subject {
  padding: 0.6rem 1rem;
  border-bottom: 1px solid var(--mail-list-row-border);
}
.sure-mail-compose__subject input {
  width: 100%; padding: 0.15rem 0; border: none;
  background: transparent; color: var(--text);
  font: inherit; font-size: 1.05rem; font-weight: 600;
}
.sure-mail-compose__subject input:focus {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 20%, transparent);
  border-radius: 4px;
}
.sure-mail-compose__toolbar {
  display: flex; align-items: center; gap: 0.25rem; flex-wrap: wrap;
  padding: 0.4rem 0.75rem;
  border-bottom: 1px solid var(--mail-list-row-border);
}
.sure-mail-compose__tool {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: var(--mail-action-size); height: var(--mail-action-size);
  padding: 0 0.4rem;
  border: 1px solid transparent; border-radius: 4px;
  background: transparent; color: inherit;
  font: inherit; font-size: 0.85rem; cursor: pointer;
}
.sure-mail-compose__tool:hover { background: var(--mail-hover-bg); }
.sure-mail-compose__tool:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 25%, transparent);
}
.sure-mail-compose__tool-divider {
  width: 1px; height: 1.25rem; margin: 0 0.25rem;
  background: var(--mail-list-border);
}
.sure-mail-compose__body {
  display: block; width: 100%; flex: 1 0 auto; min-height: 12rem;
  padding: 1rem; border: none;
  background: transparent; color: var(--text);
  font: inherit; line-height: var(--line-height, 1.6);
  resize: vertical;
}
.sure-mail-compose__body:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--focus) 25%, transparent);
}
.sure-mail-compose__footer {
  display: flex; align-items: center; justify-content: space-between;
  gap: 0.75rem; flex-wrap: wrap;
  padding: 0.65rem 1rem;
  border-top: 1px solid var(--mail-list-row-border);
}
.sure-mail-compose__status { font-size: 0.8rem; color: var(--muted); }
.sure-mail-compose__actions { display: flex; gap: 0.5rem; }`],

  'mail-action-bar': [`

/* ── Mail action bar (icon buttons) ──
   Icons are consumer-supplied inline SVG (the repo ships no sprite; the menu
   family has the same convention) that inherit currentColor — colour is a
   token, geometry is a token, the path data is markup. */
.sure-mail-action-bar { display: inline-flex; align-items: center; gap: 0.25rem; }
.sure-mail-action {
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  width: var(--mail-action-size); height: var(--mail-action-size);
  padding: 0; border: 1px solid transparent;
  border-radius: var(--mail-action-radius);
  background: transparent; color: var(--text);
  font: inherit; line-height: 1; cursor: pointer;
}
.sure-mail-action:hover { background: var(--mail-hover-bg); }
.sure-mail-action:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 25%, transparent);
}
.sure-mail-action:disabled { opacity: 0.5; cursor: not-allowed; }
.sure-mail-action[aria-pressed="true"] { background: var(--mail-action-pressed-bg); }
/* The six named actions ship as stable markup hooks: geometry and colour
   stay on .sure-mail-action + tokens, so a skin targets these selectors
   (or omits them for a bespoke action) without touching structure. */
.sure-mail-action--archive, .sure-mail-action--junk, .sure-mail-action--delete,
.sure-mail-action--move, .sure-mail-action--flag, .sure-mail-action--snooze {
  flex-shrink: 0;
}
.sure-mail-action--flagged { color: var(--mail-flag-ink); }
.sure-mail-action svg,
.sure-mail-action img {
  width: var(--mail-icon-size); height: var(--mail-icon-size);
  display: block;
}`],

  'mail-search': [`

/* ── Mail search ── */
.sure-mail-search { display: flex; flex-direction: column; gap: 0.5rem; }
.sure-mail-search__input {
  width: 100%; box-sizing: border-box;
  padding: 0.6rem 1rem;
  border: 1px solid var(--mail-search-border);
  border-radius: var(--mail-search-radius);
  background: var(--mail-search-bg); color: var(--text);
  font-size: 0.9rem;
}
.sure-mail-search__input::placeholder { color: var(--muted); }
.sure-mail-search__input:focus {
  outline: none; border-color: var(--focus);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 20%, transparent);
}
.sure-mail-search__input[aria-invalid="true"] { border-color: var(--error); }
.sure-mail-search__filters {
  display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;
}
.sure-mail-search__chip {
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--mail-search-border);
  border-radius: 999px;
  background: transparent; color: var(--text);
  font: inherit; font-size: 0.8rem; cursor: pointer;
}
.sure-mail-search__chip:hover { background: var(--mail-hover-bg); }
.sure-mail-search__chip:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 25%, transparent);
}
.sure-mail-search__chip.is-active,
.sure-mail-search__chip[aria-pressed="true"] {
  background: var(--mail-accent-alias); color: var(--mail-accent-ink);
  border-color: transparent;
}`],
}
