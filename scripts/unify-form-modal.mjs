// One-off: unify form + modal (0.2.0b phase 7). One transform, applied to
// every theme including nord: focus line -> --focus + color-mix, input
// background -> --field, spellings -> generic via the theme's own alias
// map, forest's 4px radius -> 6px, nord's comment/leading form. The
// canonical IS nord-through-the-transform, and every other theme's variant
// must reach the same bytes; residuals fail loudly.
const { tokens, runs } = await import('/usr/local/devel/sure-ui/dist/generated/themes.js')
const fs = await import('node:fs')

const block = (t, fam) => (runs[t] ?? []).filter(([f]) => f === fam).map(([, s]) => s).join('')
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
const GENERICS = new Set(['bg', 'surface', 'text', 'muted', 'border', 'accent', 'error', 'success', 'warn', 'highlight', 'error-ink', 'success-ink', 'accent-ink', 'warn-ink'])
const resolveVar = (tok, name, depth = 0) => {
  const decl = new RegExp(`${name}:\\s*([^;]+);`).exec(tok)?.[1]?.trim()
  if (!decl || depth > 8) return null
  const ref = /var\((--[a-z0-9-]+)\)/.exec(decl)?.[1]
  return ref ? resolveVar(tok, ref, depth + 1) : decl
}
const aliasMap = (tok) => {
  const m = {}
  const root = /:root \{([\s\S]*?)\n\}/.exec(tok)?.[1] ?? ''
  for (const [, gen, spec] of root.matchAll(/(--[a-z0-9-]+):\s*var\((--[a-z0-9-]+)\)/g)) if (GENERICS.has(gen.slice(2)) && !GENERICS.has(spec.slice(2))) m[spec] = gen
  // resolution-based pass: any var whose final value equals a generic's
  // final value maps to that generic (positronic spells --dark-* in
  // components while aliasing through --positronic-*)
  const genHex = {}
  for (const g of GENERICS) { const h = resolveVar(tok, `--${g}`); if (h) genHex[`--${g}`] = h }
  for (const v of root.matchAll(/(--[a-z0-9-]+):/g)) {
    const name = v[1]
    if (GENERICS.has(name.slice(2)) || m[name]) continue
    const h = resolveVar(tok, name)
    const hit = Object.entries(genHex).find(([, gh]) => gh === h)
    if (hit) m[name] = hit[0]
  }
  return m
}
const FOCUS_RE = /border-color: var\([^)]+\); box-shadow: 0 0 0 3px rgba\([^)]+\);/
const FOCUS_CANON = 'border-color: var(--focus); box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 20%, transparent);'

function canonFor(name, fam, comment) {
  const map = aliasMap(tokens[name])
  let s = block(name, fam)
  const focusOld = FOCUS_RE.exec(s)?.[0] ?? 'n/a'
  s = s.replace(FOCUS_RE, FOCUS_CANON)
  const inputRule = /^\.sure-(?:form|modal__form) input, \.sure-(?:form|modal__form) select, \.sure-(?:form|modal__form) textarea \{[^}]*\}/m.exec(s)?.[0]
  if (!inputRule) throw new Error(`${name} ${fam}: input rule not found`)
  const BG_RE = /background: (#fff|var\([^)]+\));\s*(transition:[^;]+;)?/
  const field = BG_RE.exec(inputRule)?.[1]
  if (!field) throw new Error(`${name} ${fam}: no field background found`)
  s = s.replace(inputRule, inputRule.replace(BG_RE, (m2, _bg, tr) => `background: var(--field);${tr ? ' ' + tr : ''}`))
  s = s.replace(/var\((--[a-z0-9-]+)\)/g, (whole, v) => (map[v] ? `var(${map[v]})` : whole))
  s = s.replaceAll('border-radius: 4px;', 'border-radius: 6px;')
  s = s.replace(/^\n+/, '\n\n')
  if (comment && !s.includes(comment)) s = s.replace('\n\n', `\n\n${comment}\n`)
  return { s, field, focusOld }
}

// Format-tolerant semantic proof: selector -> ordered declarations must be
// identical between each theme's transformed variant and the canonical
// (formats genuinely diverge — forest writes one-liners — and unify to the
// canonical layout, which the fixture records).
function parse(css) {
  const rules = {}
  let i = 0
  while (i < css.length) {
    const open = css.indexOf('{', i)
    if (open < 0) break
    const sel = css.slice(i, open).replace(/\/\*[\s\S]*?\*\//g, '').trim().replace(/\s+/g, ' ')
    let depth = 0, k = open
    for (; k < css.length; k++) { if (css[k] === '{') depth++; else if (css[k] === '}') { depth--; if (depth === 0) break } }
    const declsList = [...css.slice(open + 1, k).matchAll(/([a-z-]+):\s*([^;]+);/g)].map(([, p, v]) => `${p}: ${v.trim()}`)
    if (sel) rules[sel] = (rules[sel] ?? []).concat(declsList)
    i = k + 1
  }
  return rules
}
const eq = (a, b) => JSON.stringify(parse(a)) === JSON.stringify(parse(b))

for (const [fam, comment] of [['form', '/* ── Form ── */'], ['modal', null]]) {
  const canon = canonFor('nord', fam, comment).s
  console.log(`── ${fam} (${canon.length}B canonical)`)
  for (const name of Object.keys(tokens)) {
    const { s, field, focusOld } = canonFor(name, fam, comment)
    if (!eq(s, canon)) {
      const pa = parse(s), pb = parse(canon)
      const keys = new Set([...Object.keys(pa), ...Object.keys(pb)])
      for (const k of keys) {
        if (JSON.stringify(pa[k]) !== JSON.stringify(pb[k])) {
          throw new Error(`${name} ${fam}: rule drift at ${k}\n  got: ${JSON.stringify(pa[k])}\n  exp: ${JSON.stringify(pb[k])}`)
        }
      }
      throw new Error(`${name} ${fam}: rules equal but maps differ (order?)`)
    }
    console.log(`  ${name.padEnd(16)} field ${field} | focus ${focusOld.slice(0, 52)}`)
  }
  let shared = fs.readFileSync('/usr/local/devel/sure-ui/src/components/shared.ts', 'utf8')
  if (!shared.includes(`'${fam}': [`)) {
    shared = shared.replace('export const shared: Record<string, string[]> = {\n', `export const shared: Record<string, string[]> = {\n  '${fam}': [\`${esc(canon)}\`],\n`)
    fs.writeFileSync('/usr/local/devel/sure-ui/src/components/shared.ts', shared)
  }
  let gen = fs.readFileSync('/usr/local/devel/sure-ui/src/generated/themes.ts', 'utf8')
  gen = gen.replace(new RegExp(`\\['${fam}', \`[^\`]*\`\\]`, 'g'), `['${fam}', \`\`]`)
  fs.writeFileSync('/usr/local/devel/sure-ui/src/generated/themes.ts', gen)
}

let gen = fs.readFileSync('/usr/local/devel/sure-ui/src/generated/themes.ts', 'utf8')
for (const name of Object.keys(tokens)) {
  const oldForm = block(name, 'form')
  const field = /background: (#fff|var\([^)]+\));\s*transition:/.exec(oldForm)?.[1]
  const focus = /border-color: ([^;]+); box-shadow/.exec(oldForm)?.[1]
  const re = new RegExp(`('${name}': \`[\\s\\S]*?\\n)\\}\`,`)
  gen = gen.replace(re, `$1  --field: ${field};\n  --focus: ${focus};\n}\`,`)
}
fs.writeFileSync('/usr/local/devel/sure-ui/src/generated/themes.ts', gen)
console.log('\nwritten: shared.form/modal + --field/--focus tokens; rebuild + fixture')
