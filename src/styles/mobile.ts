// Mobile & touch layer — one block, appended verbatim to every theme by
// styles/index.ts, so the set stays byte-identical (asserted in
// index.test.ts). It is deliberately colour-free: layout, hit targets and
// touch-only affordances only, every value in px/rem/vw — the theme's own
// tokens decide how it looks, so shipping this layer changes no contrast
// maths and no `:root` knob the site extracts.
//
// Three detections, all pure CSS (no script, no feature flag):
//   (max-width: 640px)  phones hold fixed-width chrome — forms, the 320px
//                       side panel, dialogs and toasts — which overflow a
//                       narrow viewport;
//   (hover: none)       touch has no hover, and two affordances in the
//                       component set are hover-only by design (message
//                       actions, session actions) — they would be
//                       unreachable on a phone;
//   (pointer: coarse)   fingers are not cursors: the desktop hit targets
//                       (28px icon buttons, 38px inputs, 6px dialog resize
//                       edges) sit under the 44px guidance for coarse
//                       pointers.
export const mobileLayer = `

/* ── Mobile & touch ─────────────────────────────────────────────── */
@media (max-width: 640px) {
  .sure-form, .sure-modal__form, .sure-auth__form { max-width: 100%; }
  .sure-auth__form { padding: 1.25rem; }
  .side-panel { width: min(320px, 100vw); }
  .sure-dialog-overlay { padding: 0.5rem; }
  .sure-dialog { max-width: calc(100vw - 1rem); }
  .toast { max-width: calc(100vw - 2rem); }
  .sure-form__actions, .sure-row-actions { flex-wrap: wrap; }
  .sure-table__cell, .sure-table__header { padding: 0.5rem 0.4rem; }
}

@media (hover: none) {
  .message .msg-actions { display: flex; }
  .sure-session-item .sure-session-actions { display: flex; }
}

@media (pointer: coarse) {
  .btn-primary, .btn-secondary, .btn-icon,
  .sure-auth__btn, .sure-auth__btn--social,
  .sure-nav__item, .sure-menu__item,
  .sure-session-item, .side-panel__item { min-height: 44px; }
  .btn-icon { width: 44px; height: 44px; }
  .sure-form input, .sure-form select, .sure-form textarea,
  .sure-modal__form input, .sure-modal__form select, .sure-modal__form textarea,
  .sure-auth__input, .sure-search__input,
  .sure-filters input, .sure-filters select { min-height: 44px; }
  .sure-dialog__resize--e, .sure-dialog__resize--w { width: 16px; }
  .sure-dialog__resize--n, .sure-dialog__resize--s { height: 16px; }
  .sure-dialog__resize--ne, .sure-dialog__resize--nw,
  .sure-dialog__resize--se, .sure-dialog__resize--sw { width: 24px; height: 24px; }
}
`
