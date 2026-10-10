// Shared component blocks (0.2.0b): byte-identical run structure and bytes
// across every theme that carried them (assert-proven by
// scripts/split-themes.mjs; the global collapse assert additionally proves
// the sharing changes no meaning). A family can occur in several
// non-contiguous runs, so slices — one per run, position-matched by
// compose() — are the correct shape, not a single string.
// Edit these directly from 0.2.0b on; regenerate only to re-prove.
export const shared: Record<string, string[]> = {
  'composites': [`

  /* ── Small composites ── */

  .sure-toggle-group { display: flex; gap: 1rem; flex-wrap: wrap; }
  .sure-toggle {
    display: flex; align-items: center; gap: 0.35rem;
    text-transform: capitalize;
  }
  .sure-row-actions { display: flex; gap: 0.4rem; flex-wrap: wrap; }

  .sure-nav__item {
    background: transparent;
    border: 1px solid transparent;
    color: inherit;
    padding: 0.35rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font: inherit;
  }
  /* Derived from the theme's own text colour so it reads on a light or a dark
     background. A hardcoded white tint is invisible on a light theme. */
  .sure-nav__item:hover { background: color-mix(in srgb, var(--text) 8%, transparent); }
  .sure-nav__item--active { background: var(--accent); border-color: var(--bg); }`, `

  .visually-hidden {
    position: absolute; width: 1px; height: 1px;
    overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
  }`],
  'dialog': [`

/* ── Dialog ── */
.sure-dialog-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:200; display:flex; align-items:center; justify-content:center; }
.sure-dialog { background:var(--surface); border-radius:12px; display:flex; flex-direction:column; box-shadow:0 8px 32px rgba(0,0,0,0.2); position:relative; }
.sure-dialog__header { padding:1rem 1.25rem; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; cursor:grab; user-select:none; }
.sure-dialog__header:active { cursor:grabbing; }
.sure-dialog__title { font-size:1rem; font-weight:700; }
.sure-dialog__close { background:none; border:none; cursor:pointer; color:var(--muted); font-size:1.25rem; }
.sure-dialog__body { padding:1.25rem; overflow-y:auto; flex:1; }
.sure-dialog__resize { position:absolute; background:transparent; z-index:5; }
.sure-dialog__resize--e { top:0; right:0; bottom:16px; width:6px; cursor:ew-resize; }
.sure-dialog__resize--s { bottom:0; left:0; right:16px; height:6px; cursor:ns-resize; }
.sure-dialog__resize--se { bottom:0; right:0; width:16px; height:16px; cursor:nwse-resize; background:linear-gradient(135deg,transparent 50%,var(--muted) 50%); border-radius:0 0 12px 0; }
.sure-dialog__resize--w { top:0; left:0; bottom:16px; width:6px; cursor:ew-resize; }
.sure-dialog__resize--n { top:0; left:0; right:16px; height:6px; cursor:ns-resize; }
.sure-dialog__resize--nw { top:0; left:0; width:16px; height:16px; cursor:nwse-resize; }
.sure-dialog__resize--ne { top:0; right:0; width:16px; height:16px; cursor:nesw-resize; }
.sure-dialog__resize--sw { bottom:0; left:0; width:16px; height:16px; cursor:nesw-resize; }`],
  'page': [`

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }`, `
pre { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1rem 1.25rem; overflow-x: auto; color: var(--text); }

.pp-wrap { max-width: 72rem; margin: 0 auto; padding: 0 1.25rem; }
.pp-btn { display: inline-block; padding: 0.625rem 1.25rem; border-radius: 8px; background: var(--accent); color: var(--positronic-bg); font-weight: 600; }
.pp-btn:hover { text-decoration: none; filter: brightness(1.1); }
.pp-btn--ghost { background: transparent; color: var(--accent); border: 1px solid var(--border); }
.pp-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem 1.5rem; }
.pp-badge { display: inline-block; padding: 0.125rem 0.625rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; border: 1px solid var(--border); color: var(--muted); }
.pp-badge--ok { color: var(--success); border-color: var(--success); }
.pp-badge--warn { color: var(--warn); border-color: var(--warn); }
.pp-badge--beta { color: var(--accent); border-color: var(--accent); }
  `],
  'regions': [`

  /* ── Page regions ──
     Layout for the parts of a page that are not the page itself: a region
     wrapper, a toolbar above it, a filter row, a quiet note, a help panel.
     Promoted from the management console, which carried all of this privately
     — these patterns are not console-specific and a second consumer would
     otherwise copy them again. */

  .sure-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem; flex-wrap: wrap; margin-bottom: 0.75rem;
  }
  .sure-toolbar h2 { margin: 0; }

  .sure-filters { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
  .sure-filters input,
  .sure-filters select {
    width: 100%; box-sizing: border-box;
    padding: 0.45rem 0.55rem;
    border: 1px solid var(--border); border-radius: 4px;
    font: inherit; background: var(--surface); color: var(--text);
  }

  .sure-note { font-size: 0.82rem; opacity: 0.75; margin: 0.5rem 0; }

  .sure-panel {
    margin-top: 1rem; padding: 0.75rem 1rem;
    border: 1px solid var(--border); border-radius: 6px;
    background: var(--surface);
  }

  .sure-help {
    margin: 0.5rem 0 1rem;
    border: 1px solid var(--border); border-radius: 6px;
    background: var(--highlight);
  }
  .sure-help__title {
    margin: 0; padding: 0.5rem 0.75rem; font-size: 0.95rem;
    border-bottom: 1px solid var(--border);
    background: var(--surface); border-radius: 6px 6px 0 0;
  }
  .sure-help__item { padding: 0.4rem 0.75rem; border-bottom: 1px solid var(--highlight); }
  .sure-help__item:last-child { border-bottom: none; }
  .sure-help__summary { cursor: pointer; font-size: 0.85rem; }
  .sure-help__summary code,
  .sure-help__example code {
    background: var(--highlight); padding: 0.05rem 0.3rem; border-radius: 3px;
  }
  .sure-help__details { margin: 0.35rem 0 0; font-size: 0.82rem; opacity: 0.85; }
  .sure-help__example { margin: 0.3rem 0 0; font-size: 0.8rem; }`],
}
