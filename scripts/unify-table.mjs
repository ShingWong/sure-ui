// One-off: unify the table family (0.2.0b phase 6). Canonical = the
// nord-family majority design (tinted header strip, tint cell rules, row
// hover, colored error/help) with three table tokens derived per theme:
//   --table-header / --table-header-ink / --table-hover
// Header ink is auto-picked for themes whose old header had no background
// (dark/positronic: transparent strip, muted text — moving to the tinted
// strip must keep >= 4.5:1, so the best candidate wins); everyone else
// keeps their exact current values by construction. Documented deltas:
// dark/positronic gain tinted headers + hover (and lose the cell
// font-size and display:block quirks), dracula's surface strip becomes
// the tint and its explicit cell colour becomes inheritance (same value
// via the alias), cell borders become var(--highlight) everywhere.
const { tokens, runs } = await import('/usr/local/devel/sure-ui/dist/generated/themes.js')
const fs = await import('node:fs')

const block = (t) => (runs[t] ?? []).filter(([f]) => f === 'table').map(([, s]) => s).join('')
const ruleBody = (css, sel) => new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' \\{([^}]*)\\}').exec(css)?.[1] ?? ''
const decls = (body) => Object.fromEntries([...body.matchAll(/([a-z-]+):\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]))
const resolve = (css, value, depth = 0) => {
  const v = value.trim()
  if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return v.length === 4 ? `#${[...v.slice(1)].map((c) => c + c).join('')}` : v
  if (depth > 6) throw new Error(`cannot resolve ${value}`)
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

const nord = block('nord')
const hooksNord = '\n\n  /* ── State hooks & utilities ── */\n\n  .sure-table tr.is-selected { background: var(--border); }'
if (!nord.includes(hooksNord)) throw new Error('hooks run structure differs from expectation')
const mainNord = nord.slice(0, nord.indexOf(hooksNord))
const canonicalMain = mainNord
  .replace('background: var(--nord5); color: var(--nord0);', 'background: var(--table-header); color: var(--table-header-ink);')
  .replace('border-bottom: 2px solid var(--nord4);', 'border-bottom: 2px solid var(--border);')
  .replace('.sure-table__cell { padding: 0.75rem 1rem; border-bottom: 1px solid var(--nord5); }', '.sure-table__cell { padding: 0.75rem 1rem; border-bottom: 1px solid var(--highlight); }')
  .replace('.sure-table tr:hover .sure-table__cell { background: var(--nord6); }', '.sure-table tr:hover .sure-table__cell { background: var(--table-hover); }')
  .replace('color: var(--nord11); font-size: 0.8rem;', 'color: var(--error); font-size: 0.8rem;')
  .replace('color: var(--nord3); font-size: 0.8rem;', 'color: var(--muted); font-size: 0.8rem;')
if (canonicalMain === mainNord) throw new Error('canonical swaps did not apply')
const canonical = [canonicalMain, hooksNord]

const derive = {}
console.log('theme             header bg / ink (picked)       cell-border  hover')
for (const name of Object.keys(tokens)) {
  const tok = tokens[name]
  const old = block(name)
  const hdr = decls(ruleBody(old, '.sure-table__header'))
  const cell = decls(ruleBody(old, '.sure-table__cell'))
  const hover = decls(ruleBody(old, '.sure-table tr:hover .sure-table__cell'))['background']
  const bg = hdr['background']
  let ink = hdr['color']
  const tokExt = tok + `\n  --table-header: ${bg ?? 'transparent'};\n  --table-header-ink: ${ink ?? 'var(--text)'};\n  --table-hover: ${hover ?? 'var(--surface)'};\n`
  if (!bg) {
    // tinted strip is new here: pick the ink that reads on the theme's highlight
    const hl = resolve(tok, 'var(--highlight)')
    const cands = ['var(--text)', 'var(--bg)', 'var(--muted)', '#fff']
      .map((c) => [c, contrast(resolve(tok, c), hl)])
      .sort((a, b) => b[1] - a[1])
    ink = cands[0][0]
    if (cands[0][1] < 4.5) console.log(`  !! ${name}: best header ink ${cands[0][1].toFixed(2)}:1 (${cands.map(([c, r]) => c + '=' + r.toFixed(1)).join(' ')})`)
  } else {
    // preserved design: assert the ink still reads on the strip
    const r = contrast(resolve(tokExt, ink), resolve(tokExt, bg))
    if (r < 4.5) console.log(`  !! ${name}: header ${r.toFixed(2)}:1 (pre-existing)`)
  }
  // error/help colours must alias-resolve to the theme's status colours
  const errOld = decls(ruleBody(old, '.sure-table__error'))['color']
  const helpOld = decls(ruleBody(old, '.sure-table__help'))['color']
  if (resolve(tokExt, errOld) !== resolve(tokExt, 'var(--error)')) throw new Error(`${name}: table error colour ${errOld} != var(--error)`)
  if (resolve(tokExt, helpOld) !== resolve(tokExt, 'var(--muted)')) throw new Error(`${name}: table help colour ${helpOld} != var(--muted)`)
  derive[name] = { bg: bg ?? 'transparent', ink, hover: hover ?? 'var(--surface)' }
  console.log(`${name.padEnd(16)} ${derive[name].bg} / ${ink} | cell ${cell['border-bottom'] ?? '(none)'} | hover ${hover ?? '(none)'}`)
}

let gen = fs.readFileSync('/usr/local/devel/sure-ui/src/generated/themes.ts', 'utf8')
for (const [name, d] of Object.entries(derive)) {
  const re = new RegExp(`('${name}': \`[\\s\\S]*?\\n)\\}\`,`)
  gen = gen.replace(re, `$1  --table-header: ${d.bg};\n  --table-header-ink: ${d.ink};\n  --table-hover: ${d.hover};\n}\`,`)
}
gen = gen.replace(/\['table', `[^`]*`\]/g, "['table', ``]")
fs.writeFileSync('/usr/local/devel/sure-ui/src/generated/themes.ts', gen)

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
let shared = fs.readFileSync('/usr/local/devel/sure-ui/src/components/shared.ts', 'utf8')
shared = shared.replace('export const shared: Record<string, string[]> = {\n', `export const shared: Record<string, string[]> = {\n  'table': [${canonical.map((s) => `\`${esc(s)}\``).join(', ')}],\n`)
fs.writeFileSync('/usr/local/devel/sure-ui/src/components/shared.ts', shared)
console.log('\nwritten: tokens + shared.table (2 slices); rebuild and regenerate the fixture')
