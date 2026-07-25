export const forest = `
:root {
  --frst-bg: #f4f1ea;
  --frst-surface: #fff;
  --frst-text: #2d2a24;
  --frst-muted: #7a7568;
  --frst-border: #c9c3b3;
  --frst-focus: #5b8c5a;
  --frst-primary: #3d6b3c;
  --frst-primary-hover: #2d522c;
  --frst-error: #b34141;
  --frst-success: #5b8c5a;
  --frst-warn: #c4903a;
  --frst-highlight: #e8e3d8;
}

*, *::before, *::after { box-sizing: border-box; }

.sure-form { max-width: 480px; }
.sure-form__field { margin-bottom: 1rem; }
.sure-form__label { display: block; margin-bottom: 0.25rem; font-weight: 600; color: var(--frst-text); font-size: 0.875rem; }
.sure-form input, .sure-form select, .sure-form textarea {
  width: 100%; padding: 0.5rem 0.75rem;
  border: 1px solid var(--frst-border); border-radius: 4px;
  font-size: 1rem; color: var(--frst-text);
  background: var(--frst-surface);
  transition: border-color 0.15s;
}
.sure-form input:focus, .sure-form select:focus, .sure-form textarea:focus {
  outline: none; border-color: var(--frst-focus); box-shadow: 0 0 0 3px rgba(91,140,90,0.15);
}
.sure-form__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--frst-error); }
.sure-form__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--frst-muted); }
.sure-form input[aria-invalid="true"] { border-color: var(--frst-error); }

.sure-modal__form { max-width: 560px; }
.sure-modal__field { margin-bottom: 1rem; }
.sure-modal__label { display: block; margin-bottom: 0.25rem; font-weight: 600; color: var(--frst-text); font-size: 0.875rem; }
.sure-modal__form input, .sure-modal__form select, .sure-modal__form textarea {
  width: 100%; padding: 0.5rem 0.75rem;
  border: 1px solid var(--frst-border); border-radius: 4px;
  font-size: 1rem; color: var(--frst-text); background: var(--frst-surface);
}
.sure-modal__form input:focus, .sure-modal__form select:focus, .sure-modal__form textarea:focus {
  outline: none; border-color: var(--frst-focus); box-shadow: 0 0 0 3px rgba(91,140,90,0.15);
}
.sure-modal__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--frst-error); }
.sure-modal__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--frst-muted); }

.sure-table { width: 100%; border-collapse: collapse; }
.sure-table__header { text-align: left; padding: 0.75rem 1rem; background: var(--frst-highlight); color: var(--frst-text); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; border-bottom: 2px solid var(--frst-border); }
.sure-table__cell { padding: 0.75rem 1rem; border-bottom: 1px solid var(--frst-highlight); }
.sure-table tr:hover .sure-table__cell { background: var(--frst-highlight); }
.sure-table__error { color: var(--frst-error); font-size: 0.8rem; }
.sure-table__help { color: var(--frst-muted); font-size: 0.8rem; }

.sure-crud { max-width: 720px; }
.sure-crud__field { margin-bottom: 1rem; }
.sure-crud__label { display: block; margin-bottom: 0.25rem; font-weight: 600; color: var(--frst-text); font-size: 0.875rem; }
.sure-crud input, .sure-crud select, .sure-crud textarea { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--frst-border); border-radius: 4px; font-size: 1rem; color: var(--frst-text); background: var(--frst-surface); }
.sure-crud input:focus, .sure-crud select:focus, .sure-crud textarea:focus { outline: none; border-color: var(--frst-focus); box-shadow: 0 0 0 3px rgba(91,140,90,0.15); }
.sure-crud__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--frst-error); }
.sure-crud__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--frst-muted); }

.sure-search { max-width: 360px; }
.sure-search__input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--frst-border); border-radius: 20px; font-size: 0.9rem; background: var(--frst-surface); }
.sure-search__input:focus { outline: none; border-color: var(--frst-focus); box-shadow: 0 0 0 3px rgba(91,140,90,0.15); }
.sure-search__error { font-size: 0.8rem; color: var(--frst-error); }
.sure-search__help { font-size: 0.8rem; color: var(--frst-muted); }
.sure-search__label { display: none; }

.btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.25rem; border: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600; cursor: pointer; color: #fff; background: var(--frst-primary); transition: background 0.15s; }
.btn-primary:hover { background: var(--frst-primary-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.25rem; border: 1px solid var(--frst-border); border-radius: 4px; font-size: 0.9rem; font-weight: 500; cursor: pointer; color: var(--frst-text); background: var(--frst-surface); }
.btn-secondary:hover { background: var(--frst-highlight); }

.toast { position: fixed; top: 1rem; right: 1rem; z-index: 1000; display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 4px; background: var(--frst-text); color: var(--frst-bg); box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 0.9rem; max-width: 360px; animation: slideIn 0.2s ease-out; }
.toast--error { background: var(--frst-error); }
.toast--success { background: var(--frst-success); }

.status-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 999; display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; background: var(--frst-text); color: var(--frst-bg); font-size: 0.85rem; }
.status-bar--error { background: var(--frst-error); }
.status-bar--success { background: var(--frst-success); }

.side-panel { position: fixed; top: 0; right: 0; bottom: 0; z-index: 1000; width: 360px; padding: 1.5rem; background: var(--frst-surface); box-shadow: -4px 0 12px rgba(0,0,0,0.1); overflow-y: auto; }
.side-panel__title { font-weight: 600; margin-bottom: 1rem; color: var(--frst-text); }
.side-panel__item { padding: 0.5rem 0; border-bottom: 1px solid var(--frst-highlight); font-size: 0.85rem; color: var(--frst-error); cursor: pointer; }
.side-panel__item:hover { color: var(--frst-text); }

@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
`.trim()
