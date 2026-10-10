// One-off: unify the toast family (0.2.0b phase 5), operator decision:
// toast is uniform — fixed position everywhere (dark/positronic gain it),
// slideIn everywhere, solid status backgrounds everywhere (dracula's
// border-left accent becomes the majority solid form), and the --info
// variant everyone lacked except dark/positronic. Base colours move to
// --toast-bg/--toast-ink tokens derived per theme from today's values;
// dark/positronic gain a base background (documented delta: their toast
// was unstyled-transparent, now a surface card like their auth form).
const { tokens, runs } = await import('/usr/local/devel/sure-ui/dist/generated/themes.js')
const fs = await import('node:fs')

const block = (t) => (runs[t] ?? []).filter(([f]) => f === 'toast').map(([, s]) => s).join('')
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

const canonical = `

/* ── Notifications ── */
.toast {
  position: fixed; top: 1rem; right: 1rem; z-index: 1000;
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1rem; border-radius: 8px;
  background: var(--toast-bg); color: var(--toast-ink);
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  font-size: 0.9rem; max-width: 360px;
  animation: slideIn 0.2s ease-out;
}
.toast--error { background: var(--error); color: var(--on-error); }
.toast--success { background: var(--success); color: var(--on-success); }
.toast--info { background: var(--accent); color: var(--on-accent); }

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`

// ---- per-theme token derivation + proofs ---------------------------------
const derive = {}
console.log('theme             toast-bg / ink          error(old->new)            info')
for (const name of Object.keys(tokens)) {
  const tok = tokens[name]
  const old = block(name)
  const base = decls(ruleBody(old, '.toast'))
  const bg = base['background'] ?? `var(--${name === 'dark' || name === 'positronic' ? 'dark' : name}-surface)`
  const ink = base['color'] ?? `var(--${name === 'dark' || name === 'positronic' ? 'dark' : name}-text)`
  const tokExt = tok + `\n  --toast-bg: ${bg};\n  --toast-ink: ${ink};\n`

  // error/success background must resolve to the theme's own status colours
  let oldBg = null
  for (const st of ['error', 'success']) {
    const oldStBg = decls(ruleBody(old, `.toast--${st}`))['background']
    if (st === 'error') oldBg = oldStBg
    if (oldStBg) {
      const a = resolve(tokExt, oldStBg), b = resolve(tokExt, `var(--${st})`)
      if (a !== b && name !== 'dracula') throw new Error(`${name}: toast--${st} bg ${oldStBg}(${a}) != var(--${st})(${b})`)
    }
  }
  // contrast: white on status colours (canonical) vs the old arrangement
  // per-theme status ink: pick the candidate that reads best on the solid
  // status background; assert >= 4.5:1 (or best-available, flagged)
  const pick = (statusVar) => {
    const bgc = resolve(tokExt, statusVar)
    const cands = ['#fff', 'var(--bg)', 'var(--text)']
      .map((c) => [c, contrast(resolve(tokExt, c), bgc)])
      .sort((a, b) => b[1] - a[1])
    return { spell: cands[0][0], ratio: cands[0][1], all: cands.map(([c, r]) => `${c}=${r.toFixed(1)}`).join(' ') }
  }
  const errBg = resolve(tokExt, 'var(--error)')
  const oldErrFg = base['color'] ?? resolve(tokExt, ink)
  const oldR = contrast(resolve(tokExt, oldErrFg), oldBg ? resolve(tokExt, oldBg) : resolve(tokExt, bg))
  const e = pick('var(--error)'), s = pick('var(--success)')
  if (name !== 'dracula' && e.ratio + 0.05 < oldR) throw new Error(`${name}: error toast contrast regresses ${oldR.toFixed(2)} -> ${e.ratio.toFixed(2)}`)
  if (e.ratio < 4.5 || s.ratio < 4.5) console.log(`  !! ${name}: best error=${e.ratio.toFixed(2)} success=${s.ratio.toFixed(2)} (${e.all})`)
  derive[name] = { bg, ink, onError: e.spell, onSuccess: s.spell }
  const infoOld = decls(ruleBody(old, '.toast--info'))['background']
  console.log(`${name.padEnd(16)} ${bg} / ${ink} | err ${oldR.toFixed(1)} -> ${e.ratio.toFixed(1)} (${e.spell}) | succ ${s.spell} | ${infoOld ?? '(gained)'}`)
}

// ---- write -----------------------------------------------------------------
let gen = fs.readFileSync('/usr/local/devel/sure-ui/src/generated/themes.ts', 'utf8')
for (const [name, d] of Object.entries(derive)) {
  const re = new RegExp(`('${name}': \`[\\s\\S]*?\\n)\\}\`,`)
  gen = gen.replace(re, `$1  --toast-bg: ${d.bg};\n  --toast-ink: ${d.ink};\n  --on-error: ${d.onError};\n  --on-success: ${d.onSuccess};\n}\`,`)
}
gen = gen.replace(/\['toast', `[^`]*`\]/g, "['toast', ``]")
fs.writeFileSync('/usr/local/devel/sure-ui/src/generated/themes.ts', gen)

let shared = fs.readFileSync('/usr/local/devel/sure-ui/src/components/shared.ts', 'utf8')
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
shared = shared.replace('export const shared: Record<string, string[]> = {\n', `export const shared: Record<string, string[]> = {\n  'toast': [\`${esc(canonical)}\`],\n`)
fs.writeFileSync('/usr/local/devel/sure-ui/src/components/shared.ts', shared)
console.log('\nwritten: tokens + shared.toast; rebuild and regenerate the fixture')
