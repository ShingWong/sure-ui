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
`.trim()
