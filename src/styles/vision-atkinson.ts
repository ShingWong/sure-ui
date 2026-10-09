// Light, WCAG-AAA palette at 125% with Atkinson Hyperlegible (OFL, vendored under /fonts/) — the large-print variant
// AAA on white: text >= 7:1, muted >= 7:1, links >= 7:1,
// borders >= 3:1 — asserted in index.test.ts alongside the
// shared font contract (--font-body/--font-mono/--font-size/
// --line-height). The two vision themes share this palette and
// differ only in --font-body, so a reader compares fonts.
export const visionAtkinson = `

@font-face {
  font-family: 'Atkinson Hyperlegible';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/AtkinsonHyperlegible-Regular.woff2') format('woff2');
}
@font-face {
  font-family: 'Atkinson Hyperlegible';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/AtkinsonHyperlegible-Bold.woff2') format('woff2');
}

:root {
  /* Typography contract (all sure-ui themes declare these). */
  --font-body: 'Atkinson Hyperlegible', Verdana, Tahoma, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  --font-size: 125%;
  --line-height: 1.7;
  --vatk0: #101418;
  --vatk1: #1d232a;
  --vatk2: #2b323a;
  --vatk3: #3f464f;
  --vatk4: #6b7280;
  --vatk5: #e7ebf0;
  --vatk6: #ffffff;
  --vatk7: #0f766e;
  --vatk8: #1a55d8;
  --vatk9: #0d47c8;
  --vatk10: #16389c;
  --vatk11: #b3261e;
  --vatk12: #b45309;
  --vatk13: #f0b429;
  --vatk14: #14663a;
  --vatk15: #6d28d9;

  /* Generic aliases: the same names in every theme, so an app can style
     itself with var(--bg) and still follow whichever theme is active. */
  --bg: #ffffff;
  --surface: #ffffff;
  --text: var(--vatk0);
  --muted: var(--vatk3);
  --border: var(--vatk4);
  --accent: var(--vatk9);
  --error: var(--vatk11);
  --success: var(--vatk14);
  --highlight: var(--vatk5);
  --warn: var(--vatk13);

  /* Status inks: text that reads on a 10% tint of its status colour (alerts,
     badges). The status hues are mid-tone, so as text they land at 1.7–3.2:1
     on a near-white page. Each ink is its hue darkened until it clears 4.5:1,
     verified in index.test.ts. */
  --error-ink: #7a1610;
  --success-ink: #0c4426;
  --accent-ink: #0a3599;
  --warn-ink: #5c4200;
}

*, *::before, *::after { box-sizing: border-box; }

/* ── Form ── */
.sure-form { max-width: 480px; }
  .sure-form__title { margin: 0 0 1rem; font-size: 1.125rem; font-weight: 700; color: var(--vatk0); }
  .sure-form__actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
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

.sure-form__field { margin-bottom: 1rem; }
.sure-form__label {
  display: block; margin-bottom: 0.25rem;
  font-weight: 600; color: var(--vatk0);
  font-size: 0.875rem;
}
.sure-form input, .sure-form select, .sure-form textarea {
  width: 100%; padding: 0.5rem 0.75rem;
  border: 1px solid var(--vatk4); border-radius: 6px;
  font-size: 1rem; color: var(--vatk0);
  background: #fff; transition: border-color 0.15s;
}
.sure-form input:focus, .sure-form select:focus, .sure-form textarea:focus {
  outline: none; border-color: var(--vatk9); box-shadow: 0 0 0 3px rgba(129,161,193,0.2);
}
.sure-form__error {
  display: block; margin-top: 0.25rem;
  font-size: 0.8rem; color: var(--vatk11);
}
.sure-form__help {
  display: block; margin-top: 0.25rem;
  font-size: 0.8rem; color: var(--vatk3);
}
.sure-form input[aria-invalid="true"] { border-color: var(--vatk11); }

/* ── Modal ── */
.sure-modal__form { max-width: 560px; }
.sure-modal__field { margin-bottom: 1rem; }
.sure-modal__label {
  display: block; margin-bottom: 0.25rem;
  font-weight: 600; color: var(--vatk0); font-size: 0.875rem;
}
.sure-modal__form input, .sure-modal__form select, .sure-modal__form textarea {
  width: 100%; padding: 0.5rem 0.75rem;
  border: 1px solid var(--vatk4); border-radius: 6px;
  font-size: 1rem; color: var(--vatk0); background: #fff;
}
.sure-modal__form input:focus, .sure-modal__form select:focus, .sure-modal__form textarea:focus {
  outline: none; border-color: var(--vatk9); box-shadow: 0 0 0 3px rgba(129,161,193,0.2);
}
.sure-modal__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--vatk11); }
.sure-modal__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--vatk3); }

/* ── Table ── */
.sure-table { width: 100%; border-collapse: collapse; }
.sure-table__header {
  text-align: left; padding: 0.75rem 1rem;
  background: var(--vatk5); color: var(--vatk0);
  font-weight: 600; font-size: 0.8rem; text-transform: uppercase;
  border-bottom: 2px solid var(--vatk4);
}
.sure-table__cell { padding: 0.75rem 1rem; border-bottom: 1px solid var(--vatk5); }
.sure-table tr:hover .sure-table__cell { background: var(--vatk6); }
.sure-table__error { color: var(--vatk11); font-size: 0.8rem; }
.sure-table__help { color: var(--vatk3); font-size: 0.8rem; }

/* ── CRUD ── */
.sure-crud { max-width: 720px; }
.sure-crud__field { margin-bottom: 1rem; }
.sure-crud__label { display: block; margin-bottom: 0.25rem; font-weight: 600; color: var(--vatk0); font-size: 0.875rem; }
.sure-crud input, .sure-crud select, .sure-crud textarea {
  width: 100%; padding: 0.5rem 0.75rem;
  border: 1px solid var(--vatk4); border-radius: 6px;
  font-size: 1rem; color: var(--vatk0); background: #fff;
}
.sure-crud input:focus, .sure-crud select:focus, .sure-crud textarea:focus {
  outline: none; border-color: var(--vatk9); box-shadow: 0 0 0 3px rgba(129,161,193,0.2);
}
.sure-crud__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--vatk11); }
.sure-crud__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--vatk3); }

/* ── Search ── */
.sure-search { max-width: 360px; }
.sure-search__input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--vatk4); border-radius: 20px; font-size: 0.9rem; }
.sure-search__input:focus { outline: none; border-color: var(--vatk9); box-shadow: 0 0 0 3px rgba(129,161,193,0.2); }
.sure-search__error { font-size: 0.8rem; color: var(--vatk11); }
.sure-search__help { font-size: 0.8rem; color: var(--vatk3); }
.sure-search__label { display: none; }

/* ── Buttons ── */
.btn-primary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1.25rem; border: none; border-radius: 6px;
  font-size: 0.9rem; font-weight: 600; cursor: pointer;
  color: #ffffff; background: var(--vatk9);
  transition: background 0.15s;
}
.btn-primary:hover { background: var(--vatk8); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-secondary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1.25rem; border: 1px solid var(--vatk4); border-radius: 6px;
  font-size: 0.9rem; font-weight: 500; cursor: pointer;
  color: var(--vatk0); background: #fff;
  transition: background 0.15s;
}
.btn-secondary:hover { background: var(--vatk6); }

/* ── Notifications ── */
.toast {
  position: fixed; top: 1rem; right: 1rem; z-index: 1000;
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1rem; border-radius: 8px;
  background: var(--vatk0); color: var(--vatk6);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-size: 0.9rem; max-width: 360px;
  animation: slideIn 0.2s ease-out;
}
.toast--error { background: var(--vatk11); }
.toast--success { background: var(--vatk14); }

.status-bar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 999;
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: var(--vatk0); color: var(--vatk6);
  font-size: 0.85rem;
}
.status-bar--error { background: var(--vatk11); }
.status-bar--success { background: var(--vatk14); }

.side-panel {
  position: fixed; top: 0; right: 0; bottom: 0; z-index: 1000;
  width: 360px; padding: 1.5rem;
  background: #fff; box-shadow: -4px 0 12px rgba(0,0,0,0.1);
  overflow-y: auto;
}
.side-panel__title { font-weight: 600; margin-bottom: 1rem; color: var(--vatk0); }
.side-panel__item {
  padding: 0.5rem 0; border-bottom: 1px solid var(--vatk5);
  font-size: 0.85rem; color: var(--vatk11);
  cursor: pointer;
}
.side-panel__item:hover { color: var(--vatk0); }

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

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
.sure-auth__btn { width: 100%; padding: 0.75rem; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; background: var(--accent); color: #fff; cursor: pointer; transition: opacity 0.15s; }
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
.sure-dialog__resize--sw { bottom:0; left:0; width:16px; height:16px; cursor:nesw-resize; }


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
.sure-markdown img { max-width:100%; border-radius:6px; }


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
.msg-body { line-height:1.5; }


/* ── Horizontal Menu ── */
.sure-menu { display:flex; align-items:center; gap:0.25rem; }
.sure-menu__item { padding:0.375rem; background:transparent; border:none; cursor:pointer; color:var(--muted); font-size:1.125rem; line-height:1; border-radius:4px; transition:background 0.15s, color 0.15s; }
.sure-menu__item:hover { background:var(--highlight); color:var(--text); }
.sure-menu__item.active { color:var(--accent); }
.sure-menu__divider { width:1px; height:1.25rem; background:var(--border); margin:0 0.25rem; flex-shrink:0; }

.sure-auth__alert--success { background: color-mix(in srgb, var(--success) 10%, transparent); color: var(--success-ink); border: 1px solid color-mix(in srgb, var(--success) 30%, transparent); }
.sure-auth__alert--info { background: color-mix(in srgb, var(--accent) 10%, transparent); color: var(--accent-ink); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); }

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
  .sure-help__example { margin: 0.3rem 0 0; font-size: 0.8rem; }

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
  .sure-nav__item--active { background: var(--accent); border-color: var(--bg); }

  /* ── State hooks & utilities ── */

  .sure-table tr.is-selected { background: var(--border); }

  .visually-hidden {
    position: absolute; width: 1px; height: 1px;
    overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
  }

/* Typography consumption — the theme decides the stack and scale; these
   rules are what actually apply them. Kept identical in every theme so a
   runtime swap never drops the base typography. */
html { font-size: var(--font-size, 100%); }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  line-height: var(--line-height, 1.6);
}
code, pre { font-family: var(--font-mono); }
`.trim()
