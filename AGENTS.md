
## Graphify

A queryable knowledge graph of this project is indexed at `/usr/local/devel/sure-master/graphify-out/merged-graph.json` (merged across all sure-* projects).

Query via OpenCode: `/graphify /path/to/project` or `graphify query "your question" --graph /path/to/graph.json`

Rebuild index: `graphify extract /path/to/project --code-only --out /tmp/graphify-out`

## positronic theme (added 2026-10-08)

- File: `src/styles/positronic.ts`, exported as `positronic` from `@shing.wong/sure-ui` (also in `themes` map and `ThemeName` union).
- Inject like any other theme: `style.textContent = positronic`.
- Dark-first palette (`--positronic-bg: #0d0f14`, accent `#7c9cff`) with an automatic light variant under `prefers-color-scheme: light` — do not hardcode colors; use the `--bg/--surface/--text/--muted/--border/--accent` aliases.
- Ships `pp-*` helper classes: `.pp-wrap`, `.pp-btn`, `.pp-btn--ghost`, `.pp-card`, `.pp-badge` (+`--ok/--warn/--beta`). Reuse these instead of inventing new layout styles in consuming projects.
- Used by the positronic landing site (`/usr/local/devel/positronic/landing`); intended to be the shared brand theme across iStrix console, PAI apps, and sure-examples.
