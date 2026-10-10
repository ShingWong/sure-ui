// One-off: unify the buttons family (0.2.0b phase 4).
// Canonical = nord's block (majority layout: multiline, 6px radius,
// gap/size/transition, the :disabled rule dark/positronic never had, the
// section comment) with token-driven colours:
//   primary:  var(--primary) / var(--primary-hover) / var(--primary-ink)
//   icon:     var(--border) border, var(--highlight) hover (nord/vision form)
//   secondary: ghost form — var(--border) border, var(--text), transparent,
//              var(--highlight) hover (dracula/dark pattern, generalised)
// Tokens are auto-derived from each theme's own current primary values, so
// the resolver proof for primary + icon + secondary border/color is
// identity by construction. Secondary background/hover are the documented
// deliberate deltas (solid #fff/surface -> transparent; per-theme hover
// tints -> var(--highlight)).
const { tokens, runs } = await import('/usr/local/devel/sure-ui/dist/generated/themes.js')
const fs = await import('node:fs')

const block = (t) => (runs[t] ?? []).filter(([f]) => f === 'buttons').map(([, s]) => s).join('')
const nord = block('nord')
const ruleBody = (css, sel) => new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' \\{([^}]*)\\}').exec(css)?.[1] ?? ''
const decls = (body) => Object.fromEntries([...body.matchAll(/([a-z-]+):\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]))

const canonical = nord
  .replace('color: var(--nord0); background: var(--nord9);', 'color: var(--primary-ink); background: var(--primary);')
  .replace('.btn-primary:hover { background: var(--nord8); }', '.btn-primary:hover { background: var(--primary-hover); }')
  .replace('border: 1px solid var(--nord4);', 'border: 1px solid var(--border);')
  .replace('color: var(--nord0); background: #fff;', 'color: var(--text); background: transparent;')
  .replace('.btn-secondary:hover { background: var(--nord6); }', '.btn-secondary:hover { background: var(--highlight); }')
if (canonical === nord) throw new Error('canonical swaps did not apply')

// ---- auto-derive the per-theme token values from each theme's own block --
const primaryParts = (s) => {
  const rule = /\.btn-primary \{([^}]*)\}/.exec(s)?.[1] ?? ''
  const hover = /\.btn-primary:hover \{ background: ([^;]+);/.exec(s)?.[1]
  let ink, bg
  const m1 = /color: ([^;]+); background: ([^;]+);/.exec(rule)
  const m2 = /background: ([^;]+); color: ([^;]+);/.exec(rule)
  if (m1) { ink = m1[1]; bg = m1[2] } else if (m2) { bg = m2[1]; ink = m2[2] }
  else throw new Error(`cannot parse .btn-primary: ${rule.slice(0, 80)}`)
  if (!hover) throw new Error('no .btn-primary:hover')
  return { ink, bg, hover }
}
const derive = {}
for (const name of Object.keys(tokens)) derive[name] = primaryParts(block(name))

// ---- resolver proof: primary + icon + secondary border/color identical ---
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
console.log('theme             primary ink / bg / hover   icon border / hover')
for (const name of Object.keys(tokens)) {
  const tok = tokens[name]
  const old = block(name)
  const d = derive[name]
  const oldIconBorder = (decls(ruleBody(old, '.btn-icon'))['border'] ?? '').replace('1px solid ', '')
  const oldIconHover = decls(ruleBody(old, '.btn-icon:hover'))['background']
  const oldSecBorder = (decls(ruleBody(old, '.btn-secondary'))['border'] ?? '').replace('1px solid ', '')
  const oldSecColor = decls(ruleBody(old, '.btn-secondary'))['color']
  const strict = {
    'primary-ink': [d.ink, 'var(--primary-ink)'],
    'primary-bg': [d.bg, 'var(--primary)'],
    'primary-hover': [d.hover, 'var(--primary-hover)'],
    'secondary-border': [oldSecBorder, 'var(--border)'],
    'secondary-color': [oldSecColor, 'var(--text)'],
  }
  const deltas = {
    'icon-border': [oldIconBorder, 'var(--border)'],
    'icon-hover': [oldIconHover, 'var(--highlight)'],
    'secondary-bg': [decls(ruleBody(old, '.btn-secondary'))['background'], 'transparent'],
    'secondary-hover': [decls(ruleBody(old, '.btn-secondary:hover'))['background'], 'var(--highlight)'],
  }
  const tokExt = tok + `\n  --primary: ${d.bg};\n  --primary-hover: ${d.hover};\n  --primary-ink: ${d.ink};\n`
  for (const [label, [oldSpell, newSpell]] of Object.entries(strict)) {
    const a = resolve(tokExt, oldSpell), b = resolve(tokExt, newSpell)
    if (a !== b) throw new Error(`${name}: ${label} spelling changes colour: ${oldSpell}(${a}) vs ${newSpell}(${b})`)
  }
  const shown = Object.entries(deltas)
    .filter(([, [o, n]]) => o !== n)
    .map(([label, [o, n]]) => `${label}: ${o} -> ${n}`)
  console.log(`${name.padEnd(16)} ${d.ink} on ${d.bg} | ${shown.join('; ') || 'no icon/secondary deltas'}`)
}

// ---- write: tokens, shared block, data, fixture ---------------------------
let gen = fs.readFileSync('/usr/local/devel/sure-ui/src/generated/themes.ts', 'utf8')
for (const [name, d] of Object.entries(derive)) {
  const re = new RegExp(`('${name}': \`[\\s\\S]*?\\n)\\}\`,`)
  gen = gen.replace(re, `$1  --primary: ${d.bg};\n  --primary-hover: ${d.hover};\n  --primary-ink: ${d.ink};\n}\`,`)
}
gen = gen.replace(/\['buttons', `[^`]*`\]/g, "['buttons', ``]")
fs.writeFileSync('/usr/local/devel/sure-ui/src/generated/themes.ts', gen)

let shared = fs.readFileSync('/usr/local/devel/sure-ui/src/components/shared.ts', 'utf8')
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
shared = shared.replace('export const shared: Record<string, string[]> = {\n', `export const shared: Record<string, string[]> = {\n  'buttons': [\`${esc(canonical)}\`],\n`)
fs.writeFileSync('/usr/local/devel/sure-ui/src/components/shared.ts', shared)
console.log('\nwritten: tokens + shared.buttons; rebuild and regenerate the fixture')
