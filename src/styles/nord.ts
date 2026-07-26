export const nord = `
:root {
  --nord0: #2e3440;
  --nord1: #3b4252;
  --nord2: #434c5e;
  --nord3: #4c566a;
  --nord4: #d8dee9;
  --nord5: #e5e9f0;
  --nord6: #eceff4;
  --nord7: #8fbcbb;
  --nord8: #88c0d0;
  --nord9: #81a1c1;
  --nord10: #5e81ac;
  --nord11: #bf616a;
  --nord12: #d08770;
  --nord13: #ebcb8b;
  --nord14: #a3be8c;
  --nord15: #b48ead;
}

*, *::before, *::after { box-sizing: border-box; }

/* ── Form ── */
.sure-form { max-width: 480px; }
.sure-form__field { margin-bottom: 1rem; }
.sure-form__label {
  display: block; margin-bottom: 0.25rem;
  font-weight: 600; color: var(--nord0);
  font-size: 0.875rem;
}
.sure-form input, .sure-form select, .sure-form textarea {
  width: 100%; padding: 0.5rem 0.75rem;
  border: 1px solid var(--nord4); border-radius: 6px;
  font-size: 1rem; color: var(--nord0);
  background: #fff; transition: border-color 0.15s;
}
.sure-form input:focus, .sure-form select:focus, .sure-form textarea:focus {
  outline: none; border-color: var(--nord9); box-shadow: 0 0 0 3px rgba(129,161,193,0.2);
}
.sure-form__error {
  display: block; margin-top: 0.25rem;
  font-size: 0.8rem; color: var(--nord11);
}
.sure-form__help {
  display: block; margin-top: 0.25rem;
  font-size: 0.8rem; color: var(--nord3);
}
.sure-form input[aria-invalid="true"] { border-color: var(--nord11); }

/* ── Modal ── */
.sure-modal__form { max-width: 560px; }
.sure-modal__field { margin-bottom: 1rem; }
.sure-modal__label {
  display: block; margin-bottom: 0.25rem;
  font-weight: 600; color: var(--nord0); font-size: 0.875rem;
}
.sure-modal__form input, .sure-modal__form select, .sure-modal__form textarea {
  width: 100%; padding: 0.5rem 0.75rem;
  border: 1px solid var(--nord4); border-radius: 6px;
  font-size: 1rem; color: var(--nord0); background: #fff;
}
.sure-modal__form input:focus, .sure-modal__form select:focus, .sure-modal__form textarea:focus {
  outline: none; border-color: var(--nord9); box-shadow: 0 0 0 3px rgba(129,161,193,0.2);
}
.sure-modal__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--nord11); }
.sure-modal__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--nord3); }

/* ── Table ── */
.sure-table { width: 100%; border-collapse: collapse; }
.sure-table__header {
  text-align: left; padding: 0.75rem 1rem;
  background: var(--nord5); color: var(--nord0);
  font-weight: 600; font-size: 0.8rem; text-transform: uppercase;
  border-bottom: 2px solid var(--nord4);
}
.sure-table__cell { padding: 0.75rem 1rem; border-bottom: 1px solid var(--nord5); }
.sure-table tr:hover .sure-table__cell { background: var(--nord6); }
.sure-table__error { color: var(--nord11); font-size: 0.8rem; }
.sure-table__help { color: var(--nord3); font-size: 0.8rem; }

/* ── CRUD ── */
.sure-crud { max-width: 720px; }
.sure-crud__field { margin-bottom: 1rem; }
.sure-crud__label { display: block; margin-bottom: 0.25rem; font-weight: 600; color: var(--nord0); font-size: 0.875rem; }
.sure-crud input, .sure-crud select, .sure-crud textarea {
  width: 100%; padding: 0.5rem 0.75rem;
  border: 1px solid var(--nord4); border-radius: 6px;
  font-size: 1rem; color: var(--nord0); background: #fff;
}
.sure-crud input:focus, .sure-crud select:focus, .sure-crud textarea:focus {
  outline: none; border-color: var(--nord9); box-shadow: 0 0 0 3px rgba(129,161,193,0.2);
}
.sure-crud__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--nord11); }
.sure-crud__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--nord3); }

/* ── Search ── */
.sure-search { max-width: 360px; }
.sure-search__input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--nord4); border-radius: 20px; font-size: 0.9rem; }
.sure-search__input:focus { outline: none; border-color: var(--nord9); box-shadow: 0 0 0 3px rgba(129,161,193,0.2); }
.sure-search__error { font-size: 0.8rem; color: var(--nord11); }
.sure-search__help { font-size: 0.8rem; color: var(--nord3); }
.sure-search__label { display: none; }

/* ── Buttons ── */
.btn-primary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1.25rem; border: none; border-radius: 6px;
  font-size: 0.9rem; font-weight: 600; cursor: pointer;
  color: #fff; background: var(--nord10);
  transition: background 0.15s;
}
.btn-primary:hover { background: var(--nord9); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-secondary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1.25rem; border: 1px solid var(--nord4); border-radius: 6px;
  font-size: 0.9rem; font-weight: 500; cursor: pointer;
  color: var(--nord0); background: #fff;
  transition: background 0.15s;
}
.btn-secondary:hover { background: var(--nord6); }

/* ── Notifications ── */
.toast {
  position: fixed; top: 1rem; right: 1rem; z-index: 1000;
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1rem; border-radius: 8px;
  background: var(--nord0); color: var(--nord6);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-size: 0.9rem; max-width: 360px;
  animation: slideIn 0.2s ease-out;
}
.toast--error { background: var(--nord11); }
.toast--success { background: var(--nord14); }

.status-bar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 999;
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: var(--nord0); color: var(--nord6);
  font-size: 0.85rem;
}
.status-bar--error { background: var(--nord11); }
.status-bar--success { background: var(--nord14); }

.side-panel {
  position: fixed; top: 0; right: 0; bottom: 0; z-index: 1000;
  width: 360px; padding: 1.5rem;
  background: #fff; box-shadow: -4px 0 12px rgba(0,0,0,0.1);
  overflow-y: auto;
}
.side-panel__title { font-weight: 600; margin-bottom: 1rem; color: var(--nord0); }
.side-panel__item {
  padding: 0.5rem 0; border-bottom: 1px solid var(--nord5);
  font-size: 0.85rem; color: var(--nord11);
  cursor: pointer;
}
.side-panel__item:hover { color: var(--nord0); }

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* ── Auth ── */
  --bg: var(--nord6);
  --surface: #fff;
  --text: var(--nord0);
  --muted: var(--nord3);
  --border: var(--nord4);
  --accent: var(--nord9);
  --highlight: var(--nord5);
  --error: var(--nord11);
  --success: var(--nord14);
  --warn: var(--nord13);
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
.sure-auth__alert--success { background: color-mix(in srgb, var(--success) 10%, transparent); color: var(--success); border: 1px solid color-mix(in srgb, var(--success) 30%, transparent); }
.sure-auth__alert--info { background: color-mix(in srgb, var(--accent) 10%, transparent); color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); }
`.trim()
