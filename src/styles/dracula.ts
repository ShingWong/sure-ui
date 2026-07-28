export const dracula = `
:root {
  --drac-bg: #282a36;
  --drac-surface: #44475a;
  --drac-text: #f8f8f2;
  --drac-muted: #6272a4;
  --drac-border: #6272a4;
  --drac-focus: #bd93f9;
  --drac-primary: #bd93f9;
  --drac-primary-hover: #cba6f7;
  --drac-error: #ff5555;
  --drac-success: #50fa7b;
  --drac-warn: #f1fa8c;
  --drac-highlight: #44475a;
}

*, *::before, *::after { box-sizing: border-box; }

.sure-form { max-width: 480px; }
.sure-form__field { margin-bottom: 1rem; }
.sure-form__label { display: block; margin-bottom: 0.25rem; font-weight: 600; color: var(--drac-text); font-size: 0.875rem; }
.sure-form input, .sure-form select, .sure-form textarea {
  width: 100%; padding: 0.5rem 0.75rem;
  border: 1px solid var(--drac-border); border-radius: 6px;
  font-size: 1rem; color: var(--drac-text);
  background: var(--drac-surface);
  transition: border-color 0.15s;
}
.sure-form input:focus, .sure-form select:focus, .sure-form textarea:focus {
  outline: none; border-color: var(--drac-focus); box-shadow: 0 0 0 3px rgba(189,147,249,0.25);
}
.sure-form__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--drac-error); }
.sure-form__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--drac-muted); }
.sure-form input[aria-invalid="true"] { border-color: var(--drac-error); }

.sure-modal__form { max-width: 560px; }
.sure-modal__field { margin-bottom: 1rem; }
.sure-modal__label { display: block; margin-bottom: 0.25rem; font-weight: 600; color: var(--drac-text); font-size: 0.875rem; }
.sure-modal__form input, .sure-modal__form select, .sure-modal__form textarea { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--drac-border); border-radius: 6px; font-size: 1rem; color: var(--drac-text); background: var(--drac-surface); }
.sure-modal__form input:focus, .sure-modal__form select:focus, .sure-modal__form textarea:focus { outline: none; border-color: var(--drac-focus); box-shadow: 0 0 0 3px rgba(189,147,249,0.25); }
.sure-modal__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--drac-error); }
.sure-modal__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--drac-muted); }

.sure-table { width: 100%; border-collapse: collapse; }
.sure-table__header { text-align: left; padding: 0.75rem 1rem; background: var(--drac-surface); color: var(--drac-text); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; border-bottom: 2px solid var(--drac-border); }
.sure-table__cell { padding: 0.75rem 1rem; border-bottom: 1px solid var(--drac-surface); color: var(--drac-text); }
.sure-table tr:hover .sure-table__cell { background: var(--drac-surface); }
.sure-table__error { color: var(--drac-error); font-size: 0.8rem; }
.sure-table__help { color: var(--drac-muted); font-size: 0.8rem; }

.sure-crud { max-width: 720px; }
.sure-crud__field { margin-bottom: 1rem; }
.sure-crud__label { display: block; margin-bottom: 0.25rem; font-weight: 600; color: var(--drac-text); font-size: 0.875rem; }
.sure-crud input, .sure-crud select, .sure-crud textarea { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--drac-border); border-radius: 6px; font-size: 1rem; color: var(--drac-text); background: var(--drac-surface); }
.sure-crud input:focus, .sure-crud select:focus, .sure-crud textarea:focus { outline: none; border-color: var(--drac-focus); box-shadow: 0 0 0 3px rgba(189,147,249,0.25); }
.sure-crud__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--drac-error); }
.sure-crud__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--drac-muted); }

.sure-search { max-width: 360px; }
.sure-search__input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--drac-border); border-radius: 20px; font-size: 0.9rem; background: var(--drac-surface); color: var(--drac-text); }
.sure-search__input:focus { outline: none; border-color: var(--drac-focus); box-shadow: 0 0 0 3px rgba(189,147,249,0.25); }
.sure-search__error { font-size: 0.8rem; color: var(--drac-error); }
.sure-search__help { font-size: 0.8rem; color: var(--drac-muted); }
.sure-search__label { display: none; }

.btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.25rem; border: none; border-radius: 6px; font-size: 0.9rem; font-weight: 600; cursor: pointer; color: var(--drac-bg); background: var(--drac-primary); transition: background 0.15s; }
.btn-primary:hover { background: var(--drac-primary-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.25rem; border: 1px solid var(--drac-border); border-radius: 6px; font-size: 0.9rem; font-weight: 500; cursor: pointer; color: var(--drac-text); background: transparent; }
.btn-secondary:hover { background: var(--drac-surface); }

.toast { position: fixed; top: 1rem; right: 1rem; z-index: 1000; display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 6px; background: var(--drac-surface); color: var(--drac-text); box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 0.9rem; max-width: 360px; animation: slideIn 0.2s ease-out; }
.toast--error { border-left: 4px solid var(--drac-error); }
.toast--success { border-left: 4px solid var(--drac-success); }

.status-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 999; display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; background: var(--drac-surface); color: var(--drac-text); font-size: 0.85rem; }
.status-bar--error { border-bottom: 3px solid var(--drac-error); }
.status-bar--success { border-bottom: 3px solid var(--drac-success); }

.side-panel { position: fixed; top: 0; right: 0; bottom: 0; z-index: 1000; width: 360px; padding: 1.5rem; background: var(--drac-bg); border-left: 1px solid var(--drac-border); overflow-y: auto; }
.side-panel__title { font-weight: 600; margin-bottom: 1rem; color: var(--drac-text); }
.side-panel__item { padding: 0.5rem 0; border-bottom: 1px solid var(--drac-surface); font-size: 0.85rem; color: var(--drac-error); cursor: pointer; }
.side-panel__item:hover { color: var(--drac-text); }

@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

/* ── Auth ── */
  --bg: var(--drac-bg);
  --surface: var(--drac-surface);
  --text: var(--drac-text);
  --muted: var(--drac-muted);
  --border: var(--drac-border);
  --accent: var(--drac-focus);
  --highlight: var(--drac-highlight);
  --error: var(--drac-error);
  --success: var(--drac-success);
  --warn: var(--drac-warn);
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
.sure-auth__alert--error { background: color-mix(in srgb, var(--error) 10%, transparent); color: var(--error); border: 1px solid color-mix(in srgb, var(--error) 30%, transparent); }

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

.sure-auth__alert--success { background: color-mix(in srgb, var(--success) 10%, transparent); color: var(--success); border: 1px solid color-mix(in srgb, var(--success) 30%, transparent); }
.sure-auth__alert--info { background: color-mix(in srgb, var(--accent) 10%, transparent); color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); }
`.trim()
