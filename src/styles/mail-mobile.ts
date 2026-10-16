// Mail components — mobile & touch behaviour (sure-mail Track B).
//
// A SEPARATE block from styles/mobile.ts on purpose: the shared layer is
// byte-identical across the seven shipped themes (asserted in index.test.ts
// by slicing each theme string from the mobile marker to EOF) and the frozen
// fixture pins compose()'s default output byte-for-byte. Editing mobile.ts
// would break both, so mail touch rules live here and compose() appends them
// inside the same @layer sure.mobile — only when a mail family was selected.
//
// Same discipline as the shared layer: colour-free. Layout, hit targets and
// touch-only affordances only — the --mail-* tokens decide how it looks.
export const mailMobile = `
/* ── Mail: mobile & touch ─────────────────────────────────────────── */
@media (max-width: 640px) {
  .sure-mail-row { padding-inline: 0.5rem; }
  .sure-mail-row__sender { flex: 0 1 auto; width: 6rem; }
  .sure-mail-thread__header,
  .sure-mail-thread__body,
  .sure-mail-thread__attachments { padding-inline: 0.75rem; }
  .sure-mail-compose__toolbar { flex-wrap: wrap; }
  .sure-mail-search__filters { flex-wrap: wrap; }
}

@media (hover: none) {
  /* Hover-only affordances are unreachable on touch — same reveal as the
     shared layer gives .message .msg-actions. */
  .sure-mail-row .sure-mail-row__actions { display: flex; }
}

@media (pointer: coarse) {
  /* Fingers are not cursors: the desktop row (40px at default density) and
     the icon strip (28px) sit under the 44px guidance for coarse pointers. */
  .sure-mail-row,
  .sure-mail-tree__item { min-height: 44px; }
  .sure-mail-action { width: 44px; height: 44px; }
  .sure-mail-compose__tool,
  .sure-mail-search__chip,
  .sure-mail-compose__chip-remove { min-width: 44px; min-height: 44px; }
  .sure-mail-search__input,
  .sure-mail-compose input { min-height: 44px; }
}
`
