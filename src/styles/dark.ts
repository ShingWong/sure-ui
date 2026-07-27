export const dark = `
:root {
  --dark-bg: #1a1a2e;
  --dark-surface: #16213e;
  --dark-text: #e8e8e8;
  --dark-muted: #8892b0;
  --dark-border: #2d3a5c;
  --dark-focus: #64ffda;
  --dark-primary: #64ffda;
  --dark-primary-hover: #45e0be;
  --dark-error: #ff6b6b;
  --dark-success: #51cf66;
  --dark-warn: #ffd43b;
  --dark-highlight: #1e2d50;
}

*, *::before, *::after { box-sizing: border-box; }

.sure-form { max-width: 480px; }
.sure-form__field { margin-bottom: 1rem; }
.sure-form__label {
  display: block; margin-bottom: 0.25rem;
  font-weight: 600; color: var(--dark-text);
  font-size: 0.875rem;
}
.sure-form input, .sure-form select, .sure-form textarea {
  width: 100%; padding: 0.5rem 0.75rem;
  border: 1px solid var(--dark-border); border-radius: 6px;
  font-size: 1rem; color: var(--dark-text);
  background: var(--dark-bg); transition: border-color 0.15s;
}
.sure-form input:focus, .sure-form select:focus, .sure-form textarea:focus {
  outline: none; border-color: var(--dark-focus); box-shadow: 0 0 0 3px rgba(100,255,218,0.15);
}
.sure-form__error {
  display: block; margin-top: 0.25rem;
  font-size: 0.8rem; color: var(--dark-error);
}
.sure-form__help {
  display: block; margin-top: 0.25rem;
  font-size: 0.8rem; color: var(--dark-muted);
}
.sure-form input[aria-invalid="true"] { border-color: var(--dark-error); }

.sure-modal__form { max-width: 560px; }
.sure-modal__field { margin-bottom: 1rem; }
.sure-modal__label {
  display: block; margin-bottom: 0.25rem;
  font-weight: 600; color: var(--dark-text); font-size: 0.875rem;
}
.sure-modal__form input, .sure-modal__form select, .sure-modal__form textarea {
  width: 100%; padding: 0.5rem 0.75rem;
  border: 1px solid var(--dark-border); border-radius: 6px;
  font-size: 1rem; color: var(--dark-text); background: var(--dark-bg);
}
.sure-modal__form input:focus, .sure-modal__form select:focus, .sure-modal__form textarea:focus {
  outline: none; border-color: var(--dark-focus); box-shadow: 0 0 0 3px rgba(100,255,218,0.15);
}
.sure-modal__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--dark-error); }
.sure-modal__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--dark-muted); }

.sure-table { width: 100%; border-collapse: collapse; }
.sure-table__header { padding: 0.75rem; text-align: left; font-weight: 600; font-size: 0.8125rem; color: var(--dark-muted); border-bottom: 2px solid var(--dark-border); text-transform: uppercase; letter-spacing: 0.03em; }
.sure-table__cell { padding: 0.75rem; border-bottom: 1px solid var(--dark-border); font-size: 0.875rem; }
.sure-table__error { display: block; font-size: 0.8rem; color: var(--dark-error); }
.sure-table__help { display: block; font-size: 0.8rem; color: var(--dark-muted); }

.sure-crud { }
.sure-crud__field { margin-bottom: 1rem; }
.sure-crud__label { display: block; margin-bottom: 0.25rem; font-weight: 600; font-size: 0.875rem; color: var(--dark-text); }
.sure-crud__error { display: block; font-size: 0.8rem; color: var(--dark-error); }
.sure-crud__help { display: block; font-size: 0.8rem; color: var(--dark-muted); }

.sure-search { }
.sure-search__input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--dark-border); border-radius: 6px; font-size: 0.875rem; background: var(--dark-bg); color: var(--dark-text); }
.sure-search__input:focus { outline: none; border-color: var(--dark-focus); box-shadow: 0 0 0 3px rgba(100,255,218,0.15); }
.sure-search__error { display: block; font-size: 0.8rem; color: var(--dark-error); }
.sure-search__help { display: block; font-size: 0.8rem; color: var(--dark-muted); }
.sure-search__label { display: block; margin-bottom: 0.25rem; font-weight: 600; font-size: 0.8125rem; color: var(--dark-text); }

.btn-primary { background: var(--dark-primary); color: var(--dark-bg); padding: 0.5rem 1rem; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
.btn-primary:hover { background: var(--dark-primary-hover); }
.btn-secondary { background: transparent; color: var(--dark-text); padding: 0.5rem 1rem; border: 1px solid var(--dark-border); border-radius: 6px; cursor: pointer; }
.btn-secondary:hover { background: var(--dark-highlight); }

.toast { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
.toast--error { background: var(--dark-error); color: #fff; }
.toast--success { background: var(--dark-success); color: #fff; }
.toast--info { background: var(--dark-primary); color: var(--dark-bg); }

.status-bar { padding: 0.5rem 1rem; font-size: 0.8125rem; text-align: center; }
.status-bar--error { background: var(--dark-error); color: #fff; }
.status-bar--success { background: var(--dark-success); color: #fff; }
.status-bar--info { background: var(--dark-primary); color: var(--dark-bg); }

.side-panel { position: fixed; top: 0; right: 0; bottom: 0; width: 320px; background: var(--dark-surface); border-left: 1px solid var(--dark-border); padding: 1rem; overflow-y: auto; }
.side-panel__title { font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: var(--dark-text); }
.side-panel__item { padding: 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.8125rem; color: var(--dark-text); }
.side-panel__item:hover { background: var(--dark-highlight); }

/* ── Auth ── */
.sure-auth__form { max-width: 400px; margin: 2rem auto; padding: 2rem; background: var(--dark-surface); border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
.sure-auth__header { text-align: center; margin-bottom: 1.5rem; }
.sure-auth__header h1 { font-size: 1.5rem; font-weight: 700; color: var(--dark-text); }
.sure-auth__header p { font-size: 0.875rem; color: var(--dark-muted); margin-top: 0.25rem; }
.sure-auth__field { margin-bottom: 1rem; }
.sure-auth__label { display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 0.375rem; color: var(--dark-muted); text-transform: uppercase; letter-spacing: 0.03em; }
.sure-auth__input { width: 100%; padding: 0.625rem 0.75rem; border: 1px solid var(--dark-border); border-radius: 6px; font-size: 0.9375rem; background: var(--dark-bg); color: var(--dark-text); outline: none; transition: border-color 0.15s; }
.sure-auth__input:focus { border-color: var(--dark-focus); box-shadow: 0 0 0 3px rgba(100,255,218,0.15); }
.sure-auth__input--error { border-color: var(--dark-error); }
.sure-auth__input--error:focus { box-shadow: 0 0 0 3px rgba(255,107,107,0.15); }
.sure-auth__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--dark-error); }
.sure-auth__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--dark-muted); }
.sure-auth__btn { width: 100%; padding: 0.75rem; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; background: var(--dark-primary); color: var(--dark-bg); cursor: pointer; transition: opacity 0.15s; }
.sure-auth__btn:hover { opacity: 0.85; }
.sure-auth__btn:disabled { opacity: 0.5; cursor: not-allowed; }
.sure-auth__btn--social { display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 0.625rem; border: 1px solid var(--dark-border); border-radius: 8px; background: var(--dark-bg); color: var(--dark-text); font-size: 0.875rem; cursor: pointer; }
.sure-auth__btn--social:hover { background: var(--dark-highlight); }
.sure-auth__divider { display: flex; align-items: center; gap: 1rem; margin: 1.25rem 0; color: var(--dark-muted); font-size: 0.8125rem; }
.sure-auth__divider::before, .sure-auth__divider::after { content: ''; flex: 1; height: 1px; background: var(--dark-border); }
.sure-auth__footer { text-align: center; margin-top: 1.25rem; font-size: 0.875rem; color: var(--dark-muted); }
.sure-auth__footer a { color: var(--dark-primary); text-decoration: none; font-weight: 600; }
.sure-auth__footer a:hover { text-decoration: underline; }
.sure-auth__alert { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; margin-bottom: 1rem; }
.sure-auth__alert--error { background: rgba(255,107,107,0.1); color: var(--dark-error); border: 1px solid rgba(255,107,107,0.3); }
.sure-auth__alert--success { background: rgba(81,207,102,0.1); color: var(--dark-success); border: 1px solid rgba(81,207,102,0.3); }
.sure-auth__alert--info { background: rgba(100,255,218,0.1); color: var(--dark-primary); border: 1px solid rgba(100,255,218,0.3); }
`
