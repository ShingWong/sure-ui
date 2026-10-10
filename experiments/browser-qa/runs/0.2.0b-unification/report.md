# Browser QA — 0.2.0b-unification

- **sha**: `ae02230` (dirty)
- **verdict**: pass
- **contrast**: 175/189 at >= 4.5:1

## Sub-AA flags (all honest; see baseline column in metrics.json)

- `nord/form-error` 3.55:1 — flagged (pre-existing 3.55)
- `nord/toast-error` 4.09:1 — flagged (known 4.09)
- `nord/status-error` 4.09:1 — flagged (pre-existing 3.55)
- `nord/sidepanel-item` 4.09:1 — flagged (known 4.09)
- `forest/toast-success` 3.93:1 — flagged (known 3.93)
- `forest/status-success` 3.93:1 — flagged (pre-existing 3.48)
- `dracula/session-active` 2.41:1 — flagged (pre-existing 2.41)
- `dracula/session-title` 2.41:1 — flagged (pre-existing 2.41)
- `dracula/link` 1.52:1 — flagged (pre-existing 1.52)
- `dark/session-active` 1.25:1 — flagged (pre-existing 1.25)
- `dark/session-title` 1.25:1 — flagged (pre-existing 1.25)
- `dark/link` 1.82:1 — flagged (pre-existing 1.82)
- `positronic/session-active` 2.61:1 — flagged (pre-existing 2.61)
- `positronic/session-title` 2.61:1 — flagged (pre-existing 2.61)

## Pre-existing sub-AA (fails in 0.1.9 too — not a 0.2.0 regression)

- nord/form-error: 3.55:1 (0.1.9: 3.55:1) — pre-existing, not a 0.2.0 regression
- nord/status-error: 4.09:1 (0.1.9: 3.55:1) — pre-existing, not a 0.2.0 regression
- forest/status-success: 3.93:1 (0.1.9: 3.48:1) — pre-existing, not a 0.2.0 regression
- dracula/session-active: 2.41:1 (0.1.9: 2.41:1) — pre-existing, not a 0.2.0 regression
- dracula/session-title: 2.41:1 (0.1.9: 2.41:1) — pre-existing, not a 0.2.0 regression
- dracula/link: 1.52:1 (0.1.9: 1.52:1) — pre-existing, not a 0.2.0 regression
- dark/session-active: 1.25:1 (0.1.9: 1.25:1) — pre-existing, not a 0.2.0 regression
- dark/session-title: 1.25:1 (0.1.9: 1.25:1) — pre-existing, not a 0.2.0 regression
- dark/link: 1.82:1 (0.1.9: 1.82:1) — pre-existing, not a 0.2.0 regression
- positronic/session-active: 2.61:1 (0.1.9: 2.61:1) — pre-existing, not a 0.2.0 regression
- positronic/session-title: 2.61:1 (0.1.9: 2.61:1) — pre-existing, not a 0.2.0 regression





## Interaction & mobile passes

- hover/focus: 21/21 across 7 themes (primary→--primary-hover, table row→--table-hover, input focus ring)
- mobile 375px: 7/7 (form/dialog/sidepanel all within viewport)

## Per-theme contrast

| key | ratio | verdict |
|---|---|---|
| nord/body-text | 10.84 | pass |
| nord/label | 10.84 | pass |
| nord/form-error | 3.55 | flagged (pre-existing 3.55) |
| nord/form-help | 6.4 | pass |
| nord/input-text | 12.49 | pass |
| nord/search-input-text | 12.49 | pass |
| nord/crud-label | 10.84 | pass |
| nord/table-header | 10.26 | pass |
| nord/table-cell | 10.84 | pass |
| nord/primary-btn | 4.64 | pass |
| nord/secondary-btn | 10.84 | pass |
| nord/toast-error | 4.09 | flagged (known 4.09) |
| nord/toast-success | 6.13 | pass |
| nord/toast-info | 6.35 | pass |
| nord/status-base | 10.84 | pass |
| nord/status-error | 4.09 | flagged (pre-existing 3.55) |
| nord/status-success | 6.13 | pass |
| nord/status-info | 6.35 | pass |
| nord/sidepanel-title | 12.49 | pass |
| nord/sidepanel-item | 4.09 | flagged (known 4.09) |
| nord/auth-btn | 6.35 | pass |
| nord/auth-alert-error | 5.55 | pass |
| nord/menu-active | 5.51 | pass |
| nord/session-active | 6.35 | pass |
| nord/session-title | 6.35 | pass |
| nord/markdown-code | 10.26 | pass |
| nord/link | 8.15 | pass |
| forest/body-text | 12.68 | pass |
| forest/label | 12.68 | pass |
| forest/form-error | 4.97 | pass |
| forest/form-help | 5.83 | pass |
| forest/input-text | 14.3 | pass |
| forest/search-input-text | 14.3 | pass |
| forest/crud-label | 12.68 | pass |
| forest/table-header | 11.18 | pass |
| forest/table-cell | 12.68 | pass |
| forest/primary-btn | 6.24 | pass |
| forest/secondary-btn | 12.68 | pass |
| forest/toast-error | 5.6 | pass |
| forest/toast-success | 3.93 | flagged (known 3.93) |
| forest/toast-info | 6.24 | pass |
| forest/status-base | 12.68 | pass |
| forest/status-error | 5.6 | pass |
| forest/status-success | 3.93 | flagged (pre-existing 3.48) |
| forest/status-info | 6.24 | pass |
| forest/sidepanel-title | 14.3 | pass |
| forest/sidepanel-item | 5.6 | pass |
| forest/auth-btn | 6.24 | pass |
| forest/auth-alert-error | 7.04 | pass |
| forest/menu-active | 5.53 | pass |
| forest/session-active | 6.24 | pass |
| forest/session-title | 6.24 | pass |
| forest/markdown-code | 11.18 | pass |
| forest/link | 8.33 | pass |
| dracula/body-text | 13.36 | pass |
| dracula/label | 13.36 | pass |
| dracula/form-error | 4.53 | pass |
| dracula/form-help | 5.5 | pass |
| dracula/input-text | 8.59 | pass |
| dracula/search-input-text | 8.59 | pass |
| dracula/crud-label | 13.36 | pass |
| dracula/table-header | 8.59 | pass |
| dracula/table-cell | 13.36 | pass |
| dracula/primary-btn | 5.9 | pass |
| dracula/secondary-btn | 13.36 | pass |
| dracula/toast-error | 4.53 | pass |
| dracula/toast-success | 10.38 | pass |
| dracula/toast-info | 5.9 | pass |
| dracula/status-base | 8.59 | pass |
| dracula/status-error | 4.53 | pass |
| dracula/status-success | 10.38 | pass |
| dracula/status-info | 5.9 | pass |
| dracula/sidepanel-title | 13.36 | pass |
| dracula/sidepanel-item | 4.53 | pass |
| dracula/auth-btn | 5.9 | pass |
| dracula/auth-alert-error | 5.51 | pass |
| dracula/menu-active | 5.9 | pass |
| dracula/session-active | 2.41 | flagged (pre-existing 2.41) |
| dracula/session-title | 2.41 | flagged (pre-existing 2.41) |
| dracula/markdown-code | 8.59 | pass |
| dracula/link | 1.52 | flagged (pre-existing 1.52) |
| dark/body-text | 13.92 | pass |
| dark/label | 13.92 | pass |
| dark/form-error | 6.15 | pass |
| dark/form-help | 5.51 | pass |
| dark/input-text | 13.92 | pass |
| dark/search-input-text | 13.92 | pass |
| dark/crud-label | 13.92 | pass |
| dark/table-header | 17.06 | pass |
| dark/table-cell | 13.92 | pass |
| dark/primary-btn | 13.69 | pass |
| dark/secondary-btn | 13.92 | pass |
| dark/toast-error | 6.15 | pass |
| dark/toast-success | 8.5 | pass |
| dark/toast-info | 13.69 | pass |
| dark/status-base | 12.97 | pass |
| dark/status-error | 6.15 | pass |
| dark/status-success | 8.5 | pass |
| dark/status-info | 13.69 | pass |
| dark/sidepanel-title | 12.97 | pass |
| dark/sidepanel-item | 5.73 | pass |
| dark/auth-btn | 13.69 | pass |
| dark/auth-alert-error | 5.37 | pass |
| dark/menu-active | 13.69 | pass |
| dark/session-active | 1.25 | flagged (pre-existing 1.25) |
| dark/session-title | 1.25 | flagged (pre-existing 1.25) |
| dark/markdown-code | 11.08 | pass |
| dark/link | 1.82 | flagged (pre-existing 1.82) |
| positronic/body-text | 15.94 | pass |
| positronic/label | 15.94 | pass |
| positronic/form-error | 6.91 | pass |
| positronic/form-help | 7.56 | pass |
| positronic/input-text | 15.94 | pass |
| positronic/search-input-text | 15.94 | pass |
| positronic/crud-label | 15.94 | pass |
| positronic/table-header | 19.17 | pass |
| positronic/table-cell | 15.94 | pass |
| positronic/primary-btn | 7.35 | pass |
| positronic/secondary-btn | 15.94 | pass |
| positronic/toast-error | 6.91 | pass |
| positronic/toast-success | 9.55 | pass |
| positronic/toast-info | 7.35 | pass |
| positronic/status-base | 14.9 | pass |
| positronic/status-error | 6.91 | pass |
| positronic/status-success | 9.55 | pass |
| positronic/status-info | 7.35 | pass |
| positronic/sidepanel-title | 14.9 | pass |
| positronic/sidepanel-item | 6.46 | pass |
| positronic/auth-btn | 7.35 | pass |
| positronic/auth-alert-error | 6.16 | pass |
| positronic/menu-active | 7.35 | pass |
| positronic/session-active | 2.61 | flagged (pre-existing 2.61) |
| positronic/session-title | 2.61 | flagged (pre-existing 2.61) |
| positronic/markdown-code | 13.31 | pass |
| positronic/link | 7.35 | pass |
| vision-system/body-text | 18.5 | pass |
| vision-system/label | 18.5 | pass |
| vision-system/form-error | 6.54 | pass |
| vision-system/form-help | 9.54 | pass |
| vision-system/input-text | 18.5 | pass |
| vision-system/search-input-text | 18.5 | pass |
| vision-system/crud-label | 18.5 | pass |
| vision-system/table-header | 15.45 | pass |
| vision-system/table-cell | 18.5 | pass |
| vision-system/primary-btn | 7.63 | pass |
| vision-system/secondary-btn | 18.5 | pass |
| vision-system/toast-error | 6.54 | pass |
| vision-system/toast-success | 7.02 | pass |
| vision-system/toast-info | 7.63 | pass |
| vision-system/status-base | 18.5 | pass |
| vision-system/status-error | 6.54 | pass |
| vision-system/status-success | 7.02 | pass |
| vision-system/status-info | 7.63 | pass |
| vision-system/sidepanel-title | 18.5 | pass |
| vision-system/sidepanel-item | 6.54 | pass |
| vision-system/auth-btn | 7.63 | pass |
| vision-system/auth-alert-error | 9.14 | pass |
| vision-system/menu-active | 7.63 | pass |
| vision-system/session-active | 7.63 | pass |
| vision-system/session-title | 7.63 | pass |
| vision-system/markdown-code | 15.45 | pass |
| vision-system/link | 9.4 | pass |
| vision-atkinson/body-text | 18.5 | pass |
| vision-atkinson/label | 18.5 | pass |
| vision-atkinson/form-error | 6.54 | pass |
| vision-atkinson/form-help | 9.54 | pass |
| vision-atkinson/input-text | 18.5 | pass |
| vision-atkinson/search-input-text | 18.5 | pass |
| vision-atkinson/crud-label | 18.5 | pass |
| vision-atkinson/table-header | 15.45 | pass |
| vision-atkinson/table-cell | 18.5 | pass |
| vision-atkinson/primary-btn | 7.63 | pass |
| vision-atkinson/secondary-btn | 18.5 | pass |
| vision-atkinson/toast-error | 6.54 | pass |
| vision-atkinson/toast-success | 7.02 | pass |
| vision-atkinson/toast-info | 7.63 | pass |
| vision-atkinson/status-base | 18.5 | pass |
| vision-atkinson/status-error | 6.54 | pass |
| vision-atkinson/status-success | 7.02 | pass |
| vision-atkinson/status-info | 7.63 | pass |
| vision-atkinson/sidepanel-title | 18.5 | pass |
| vision-atkinson/sidepanel-item | 6.54 | pass |
| vision-atkinson/auth-btn | 7.63 | pass |
| vision-atkinson/auth-alert-error | 9.14 | pass |
| vision-atkinson/menu-active | 7.63 | pass |
| vision-atkinson/session-active | 7.63 | pass |
| vision-atkinson/session-title | 7.63 | pass |
| vision-atkinson/markdown-code | 15.45 | pass |
| vision-atkinson/link | 9.4 | pass |
