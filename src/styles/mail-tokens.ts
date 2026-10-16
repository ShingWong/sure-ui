// Mail semantic tokens (sure-mail Track B) — the ONLY knobs a skin turns.
// compose() appends this block inside @layer sure.tokens when a mail family
// is explicitly selected; unlayered consumer CSS (a skin, a page) therefore
// always overrides it, while the component blocks themselves never change.
//
// Rules for this block (design doc, "Token strategy"):
//   - defaults resolve through the seven themes' generic aliases only
//     (--surface/--accent/--text/…) — no palette of its own, so mail
//     layouts work light and dark before any skin exists;
//   - no hex, no rgb()/hsl() — colour enters through aliases and color-mix,
//     the same convention as the promoted region blocks;
//   - no font-family — typography belongs to the contract
//     (--font-body/--font-size/--line-height); the rem-based knobs below
//     scale with --font-size automatically.
export const mailTokens = `
/* ── Mail semantic tokens ─────────────────────────────────────────── */
:root {
  /* Density: one knob scales every mail row and target. */
  --mail-density: 1;

  /* Accent: the mail namespace aliases the theme accent, so a skin can point
     mail at its own hue without repainting the host page. Override
     --mail-accent-ink together with --mail-accent-alias. */
  --mail-accent-alias: var(--accent);
  --mail-accent-ink: var(--on-accent);

  /* The list card and its rows. */
  --mail-list-bg: var(--surface);
  --mail-list-border: var(--border);
  --mail-radius: 0.5rem;
  --mail-list-row-h: calc(2.5rem * var(--mail-density));
  --mail-list-pad-x: 0.75rem;
  --mail-list-sender-w: 10rem;
  --mail-list-row-bg: var(--surface);
  --mail-list-row-border: var(--highlight);
  /* Shared hover tint for rows, rail items, tools and chips — derived from
     the theme's own ink, so it reads on a light or a dark surface. */
  --mail-hover-bg: color-mix(in srgb, var(--text) 5%, transparent);
  --mail-unread-weight: 700;
  --mail-unread-bg: color-mix(in srgb, var(--mail-accent-alias) 4%, var(--surface));
  --mail-selected-bg: color-mix(in srgb, var(--mail-accent-alias) 12%, var(--surface));
  --mail-flag-ink: var(--warn-ink);

  /* Reading pane (thread) regions. */
  --mail-pane-bg: var(--surface);
  --mail-pane-border: var(--border);
  --mail-pane-header-bg: var(--surface);
  --mail-thread-body-fg: var(--text);
  --mail-quote-bg: var(--highlight);
  --mail-attachment-bg: var(--field);

  /* Folder tree: depth is set per row by the markup (defaults to root). */
  --mail-tree-indent: 1.25rem;
  --mail-tree-depth: 0;
  --mail-tree-item-radius: var(--mail-radius);
  --mail-tree-selected-bg: color-mix(in srgb, var(--mail-accent-alias) 12%, transparent);
  --mail-tree-count-bg: var(--highlight);
  --mail-tree-count-ink: var(--text);

  /* Compose: address chips. */
  --mail-chip-bg: var(--highlight);
  --mail-chip-ink: var(--text);

  /* Action bar geometry. */
  --mail-action-size: 1.75rem;
  --mail-icon-size: 1.125rem;
  --mail-action-radius: var(--mail-radius);
  --mail-action-pressed-bg: color-mix(in srgb, var(--mail-accent-alias) 12%, transparent);

  /* Search field. */
  --mail-search-bg: var(--field);
  --mail-search-border: var(--border);
  --mail-search-radius: var(--mail-radius);
}
`
