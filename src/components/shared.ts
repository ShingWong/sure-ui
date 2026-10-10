// Shared component blocks (0.2.0b): byte-identical run structure and bytes
// across every theme that carried them (assert-proven by
// scripts/split-themes.mjs; the global collapse assert additionally proves
// the sharing changes no meaning). A family can occur in several
// non-contiguous runs, so slices — one per run, position-matched by
// compose() — are the correct shape, not a single string.
// Edit these directly from 0.2.0b on; regenerate only to re-prove.
export const shared: Record<string, string[]> = {
  'toast': [`

/* ── Notifications ── */
.toast {
  position: fixed; top: 1rem; right: 1rem; z-index: 1000;
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1rem; border-radius: 8px;
  background: var(--toast-bg); color: var(--toast-ink);
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  font-size: 0.9rem; max-width: 360px;
  animation: slideIn 0.2s ease-out;
}
.toast--error { background: var(--error); color: var(--on-error); }
.toast--success { background: var(--success); color: var(--on-success); }
.toast--info { background: var(--accent); color: var(--on-accent); }

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`],
  'buttons': [`
  .btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: transparent;
    color: inherit;
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
  }
  .btn-icon:hover { background: var(--highlight); }
  .btn-icon:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Buttons ── */
.btn-primary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1.25rem; border: none; border-radius: 6px;
  font-size: 0.9rem; font-weight: 600; cursor: pointer;
  color: var(--primary-ink); background: var(--primary);
  transition: background 0.15s;
}
.btn-primary:hover { background: var(--primary-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-secondary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1.25rem; border: 1px solid var(--border); border-radius: 6px;
  font-size: 0.9rem; font-weight: 500; cursor: pointer;
  color: var(--text); background: transparent;
  transition: background 0.15s;
}
.btn-secondary:hover { background: var(--highlight); }`],
  'auth': [`

/* ── Auth ── */
.sure-auth__form { max-width: 400px; margin: 2rem auto; padding: 2rem; background: var(--surface); border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.sure-auth__header { text-align: center; margin-bottom: 1.5rem; }
.sure-auth__header h1 { font-size: 1.5rem; font-weight: 700; color: var(--text); }
.sure-auth__header p { font-size: 0.875rem; color: var(--muted); margin-top: 0.25rem; }
.sure-auth__field { margin-bottom: 1rem; }
.sure-auth__label { display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 0.375rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.03em; }
.sure-auth__input { width: 100%; padding: 0.625rem 0.75rem; border: 1px solid var(--border); border-radius: 6px; font-size: 0.9375rem; background: var(--bg); color: var(--text); outline: none; transition: border-color 0.15s; }
.sure-auth__input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
.sure-auth__input--error { border-color: var(--error); }
.sure-auth__input--error:focus { box-shadow: 0 0 0 3px color-mix(in srgb, var(--error) 20%, transparent); }
.sure-auth__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--error); }
.sure-auth__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--muted); }
.sure-auth__btn { width: 100%; padding: 0.75rem; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; background: var(--accent); color: var(--on-accent); cursor: pointer; transition: opacity 0.15s; }
.sure-auth__btn:hover { opacity: 0.85; }
.sure-auth__btn:disabled { opacity: 0.5; cursor: not-allowed; }
.sure-auth__btn--social { display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 0.625rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--text); font-size: 0.875rem; cursor: pointer; }
.sure-auth__btn--social:hover { background: var(--highlight); }
.sure-auth__divider { display: flex; align-items: center; gap: 1rem; margin: 1.25rem 0; color: var(--muted); font-size: 0.8125rem; }
.sure-auth__divider::before, .sure-auth__divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.sure-auth__footer { text-align: center; margin-top: 1.25rem; font-size: 0.875rem; color: var(--muted); }
.sure-auth__footer a { color: var(--accent); text-decoration: none; font-weight: 600; }
.sure-auth__footer a:hover { text-decoration: underline; }
.sure-auth__alert { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; margin-bottom: 1rem; }
.sure-auth__alert--error { background: color-mix(in srgb, var(--error) 10%, transparent); color: var(--error-ink); border: 1px solid color-mix(in srgb, var(--error) 30%, transparent); }

.sure-auth__alert--success { background: color-mix(in srgb, var(--success) 10%, transparent); color: var(--success-ink); border: 1px solid color-mix(in srgb, var(--success) 30%, transparent); }
.sure-auth__alert--info { background: color-mix(in srgb, var(--accent) 10%, transparent); color: var(--accent-ink); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); }`],
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
  'markdown': [`


/* ── Markdown ── */
.sure-markdown code { background:var(--highlight); padding:0.125rem 0.375rem; border-radius:3px; font-size:0.8125rem; }
.sure-markdown pre { background:var(--bg); padding:0.75rem; border-radius:6px; overflow-x:auto; margin:0.5rem 0; }
.sure-markdown pre code { background:transparent; padding:0; }
.sure-markdown table { border-collapse:collapse; width:100%; margin:0.5rem 0; font-size:0.8125rem; }
.sure-markdown table td, .sure-markdown table th { border:1px solid var(--border); padding:0.375rem 0.5rem; text-align:left; }
.sure-markdown table th { background:var(--highlight); font-weight:600; }
.sure-markdown blockquote { border-left:3px solid var(--accent); margin:0.5rem 0; padding:0.25rem 0.75rem; color:var(--muted); font-style:italic; }
.sure-markdown ul { margin:0.25rem 0; padding-left:1.25rem; }
.sure-markdown ul li { list-style:disc; margin-bottom:0.125rem; }
.sure-markdown h2, .sure-markdown h3, .sure-markdown h4 { margin:0.75rem 0 0.25rem; }
.sure-markdown hr { border:none; border-top:1px solid var(--border); margin:0.75rem 0; }
.sure-markdown p { margin:0 0 0.5rem; }
.sure-markdown a { color:var(--accent); }
.sure-markdown a:hover { text-decoration:underline; }
.sure-markdown img { max-width:100%; border-radius:6px; }`],
  'menu': [`


/* ── Horizontal Menu ── */
.sure-menu { display:flex; align-items:center; gap:0.25rem; }
.sure-menu__item { padding:0.375rem; background:transparent; border:none; cursor:pointer; color:var(--muted); font-size:1.125rem; line-height:1; border-radius:4px; transition:background 0.15s, color 0.15s; }
.sure-menu__item:hover { background:var(--highlight); color:var(--text); }
.sure-menu__item.active { color:var(--accent); }
.sure-menu__divider { width:1px; height:1.25rem; background:var(--border); margin:0 0.25rem; flex-shrink:0; }`],
  'sessions': [`


/* ── Sessions ── */
.sure-session-list { flex:1; overflow-y:auto; padding:0.375rem; }
.sure-session-item { display:flex; align-items:center; gap:0.25rem; padding:0.375rem 0.5rem; border-radius:6px; cursor:pointer; margin-bottom:1px; font-size:0.8125rem; overflow:hidden; transition:background 0.15s; }
.sure-session-item:hover { background:var(--highlight); }
.sure-session-item.active { background:var(--accent); color:#fff; }
.sure-session-item.active .sure-session-actions button { color:#fff; }
.sure-session-title { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sure-session-actions { display:none; flex-shrink:0; gap:0.125rem; }
.sure-session-item:hover .sure-session-actions { display:flex; }
.sure-session-actions button { background:none; border:none; cursor:pointer; font-size:0.625rem; padding:0.125rem; opacity:0.6; }
.sure-session-actions button:hover { opacity:1; }


/* ── Message Actions ── */
.msg-actions { display:none; gap:0.25rem; margin-top:0.375rem; }
.message:hover .msg-actions { display:flex; }
.msg-actions button { background:none; border:none; cursor:pointer; font-size:0.75rem; padding:0.125rem 0.25rem; border-radius:3px; color:var(--muted); line-height:1; }
.msg-actions button:hover { background:var(--highlight); color:var(--text); }
.msg-body { line-height:1.5; }`],
}
