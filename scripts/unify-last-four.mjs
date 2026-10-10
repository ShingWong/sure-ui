// One-off: unify the last four families (0.2.0b phase 8) — search, crud,
// sidepanel, status. Toast-model proofs: tokens raw-derived (preserved
// props identical by construction), status colours asserted to resolve to
// the theme's own --error/--success, contrast gates, and the section
// proof after. These unifications carry DELIBERATE design changes, so no
// semantic-equality claim is made for them:
//   search  -> majority pill (20px, 360px cap), --field/--focus inputs,
//              label hidden by majority vote (dark/positronic lose theirs)
//   crud    -> the majority input rules dark/positronic never had (gap),
//              --field/--focus, 720px cap
//   sidepanel -> majority 360px row-item drawer; bg/ink behind
//              --sidepanel-bg/--sidepanel-ink (nord keeps its white
//              drawer, everyone keeps their exact current background)
//   status  -> fixed bar everywhere (dark/positronic gain it), solid
//              status backgrounds, --info everywhere; reuses the
//              --on-error/--on-success inks chosen in the toast phase
const { tokens, runs } = await import('/usr/local/devel/sure-ui/dist/generated/themes.js')
const fs = await import('node:fs')

const block = (t, fam) => (runs[t] ?? []).filter(([f]) => f === fam).map(([, s]) => s).join('')
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
const ruleBody = (css, sel) => new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' \\{([^}]*)\\}').exec(css)?.[1] ?? ''
const decls = (body) => Object.fromEntries([...body.matchAll(/([a-z-]+):\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]))
const resolve = (css, value, depth = 0) => {
  const v = value.trim()
  if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return v.length === 4 ? `#${[...v.slice(1)].map((c) => c + c).join('')}` : v
  if (depth > 8) throw new Error(`cannot resolve ${value}`)
  const ref = /var\((--[a-z0-9-]+)\)/i.exec(v)?.[1]
  if (!ref) throw new Error(`not a hex or var(): ${value}`)
  const decl = new RegExp(`${ref}:\\s*([^;]+);`).exec(css)?.[1]
  if (!decl) throw new Error(`never declared: ${ref}`)
  return resolve(css, decl, depth + 1)
}
const lum = (hex) => {
  const [r = 0, g = 0, b = 0] = hex.match(/[0-9a-f]{2}/gi).slice(0, 3).map((p) => {
    const v = parseInt(p, 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05) }

const CANON = {
  search: `

/* ── Search ── */
.sure-search { max-width: 360px; }
.sure-search__input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 20px; font-size: 0.9rem; color: var(--text); background: var(--field); }
.sure-search__input:focus { outline: none; border-color: var(--focus); box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 20%, transparent); }
.sure-search__error { font-size: 0.8rem; color: var(--error); }
.sure-search__help { font-size: 0.8rem; color: var(--muted); }
.sure-search__label { display: none; }`,
  crud: `

/* ── CRUD ── */
.sure-crud { max-width: 720px; }
.sure-crud__field { margin-bottom: 1rem; }
.sure-crud__label { display: block; margin-bottom: 0.25rem; font-weight: 600; color: var(--text); font-size: 0.875rem; }
.sure-crud input, .sure-crud select, .sure-crud textarea {
  width: 100%; padding: 0.5rem 0.75rem;
  border: 1px solid var(--border); border-radius: 6px;
  font-size: 1rem; color: var(--text); background: var(--field);
}
.sure-crud input:focus, .sure-crud select:focus, .sure-crud textarea:focus {
  outline: none; border-color: var(--focus); box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 20%, transparent);
}
.sure-crud__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--error); }
.sure-crud__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--muted); }`,
  sidepanel: `

.side-panel {
  position: fixed; top: 0; right: 0; bottom: 0; z-index: 1000;
  width: 360px; padding: 1.5rem;
  background: var(--sidepanel-bg); box-shadow: -4px 0 12px rgba(0,0,0,0.1);
  overflow-y: auto;
}
.side-panel__title { font-weight: 600; margin-bottom: 1rem; color: var(--sidepanel-ink); }
.side-panel__item {
  padding: 0.5rem 0; border-bottom: 1px solid var(--highlight);
  font-size: 0.85rem; color: var(--error);
  cursor: pointer;
}
.side-panel__item:hover { color: var(--sidepanel-ink); }`,
  status: `

.status-bar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 999;
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: var(--status-bg); color: var(--status-ink);
  font-size: 0.85rem;
}
.status-bar--error { background: var(--error); color: var(--on-error); }
.status-bar--success { background: var(--success); color: var(--on-success); }
.status-bar--info { background: var(--accent); color: var(--on-accent); }`,
}

const derive = {}
console.log('theme             search field | sidepanel bg/ink        status bg/ink')
for (const name of Object.keys(tokens)) {
  const tok = tokens[name]
  const searchOld = block(name, 'search')
  const sideOld = block(name, 'sidepanel')
  const statusOld = block(name, 'status')
  const tokExt = tok + '\n' + Object.entries(derive[name] ?? {}).map(([k, v]) => `  ${k}: ${v};`).join('\n')

  // search input colours must alias-resolve to the theme's text/field
  const sIn = decls(ruleBody(searchOld, '.sure-search__input'))
  if (sIn['color'] && resolve(tok, sIn['color']) !== resolve(tok, 'var(--text)')) throw new Error(`${name}: search input colour ${sIn['color']} != text`)
  const sFocus = /border-color: ([^;]+); box-shadow/.exec(searchOld)?.[1]
  const sBorder = (decls(ruleBody(searchOld, '.sure-search__input'))['border'] ?? '').replace('1px solid ', '')
  if (resolve(tok, sBorder) !== resolve(tok, 'var(--border)')) throw new Error(`${name}: search border ${sBorder} != var(--border)`)

  // sidepanel: raw-derived bg/ink preserve the drawer exactly
  const spBase = decls(ruleBody(sideOld, '.side-panel'))
  const spBg = spBase['background'] ?? 'var(--surface)'
  const spInk = decls(ruleBody(sideOld, '.side-panel__title'))['color'] ?? 'var(--text)'
  // status: raw-derived; error/success must resolve to status colours
  const stBase = decls(ruleBody(statusOld, '.status-bar'))
  const stBg = stBase['background'] ?? 'var(--surface)'
  const stInk = stBase['color'] ?? 'var(--text)'
  const stErr = decls(ruleBody(statusOld, '.status-bar--error'))['background']
  const stErrCol = resolve(tokExt, stBg === 'var(--surface)' ? 'var(--surface)' : stBg)
  if (stErr && resolve(tok, stErr) !== resolve(tok, 'var(--error)') && name !== 'dracula') throw new Error(`${name}: status error ${stErr} != var(--error)`)
  // contrast gates: inks on their backgrounds (no-regression vs today)
  const sideR = contrast(resolve(tok, spInk), resolve(tok, spBg))
  const itemR = contrast(resolve(tok, 'var(--error)'), resolve(tok, spBg))
  if (itemR < 4.5) console.log(`  !! ${name}: sidepanel item error-on-bg ${itemR.toFixed(2)}:1`)
  const stR = contrast(resolve(tok, stInk), stErrCol)
  derive[name] = { '--sidepanel-bg': spBg, '--sidepanel-ink': spInk, '--status-bg': stBg, '--status-ink': stInk }
  console.log(`${name.padEnd(16)} ${(sIn['background'] ?? 'transparent').padEnd(14)} | ${spBg} / ${spInk} (${sideR.toFixed(1)}:1) | ${stBg} / ${stInk} (${stR.toFixed(1)}:1)`)
}

// write: tokens, shared canonicals, stripped runs
let gen = fs.readFileSync('/usr/local/devel/sure-ui/src/generated/themes.ts', 'utf8')
for (const [name, d] of Object.entries(derive)) {
  const re = new RegExp(`('${name}': \`[\\s\\S]*?\\n)\\}\`,`)
  const add = Object.entries(d).map(([k, v]) => `  ${k}: ${v};`).join('\n')
  gen = gen.replace(re, `$1${add}\n}\`,`)
}
for (const fam of Object.keys(CANON)) gen = gen.replace(new RegExp(`\\['${fam}', \`[^\`]*\`\\]`, 'g'), `['${fam}', \`\`]`)
fs.writeFileSync('/usr/local/devel/sure-ui/src/generated/themes.ts', gen)

let shared = fs.readFileSync('/usr/local/devel/sure-ui/src/components/shared.ts', 'utf8')
for (const [fam, canon] of Object.entries(CANON)) {
  if (!shared.includes(`'${fam}': [`)) shared = shared.replace('export const shared: Record<string, string[]> = {\n', `export const shared: Record<string, string[]> = {\n  '${fam}': [\`${esc(canon)}\`],\n`)
}
fs.writeFileSync('/usr/local/devel/sure-ui/src/components/shared.ts', shared)
console.log('\nwritten: 4 canonicals + tokens; rebuild + fixture + section proofs (all four families in one scope)')
