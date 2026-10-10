// One-off: unify the auth family (0.2.0b phase 3). dark/positronic spell
// --dark-* inline (Class-1 alias gap); the majority block already uses
// generics and color-mix glows. Canonical = the majority block + the
// /* ── Auth ── */ section comment (agent-first, like phase 2) + the
// token-driven button colour var(--bg) (dark/positronic already resolve to
// exactly that; light accents gain contrast — measured below).
//
// The script is a proof obligation: every variant must transform to the
// canonical block BYTE-FOR-BYTE, and the auth button's resolved contrast
// must not regress for any theme.
const { tokens, runs } = await import('/usr/local/devel/sure-ui/dist/generated/themes.js')
const fs = await import('node:fs')

const auth = (t) => (runs[t] ?? []).filter(([f]) => f === 'auth').map(([, s]) => s).join('')
const majority = auth('nord')
for (const t of ['forest', 'dracula', 'vision-system', 'vision-atkinson']) {
  if (auth(t) !== majority) throw new Error(`${t}: auth is not the majority variant`)
}

const canonical = majority.replace('\n\n.sure-auth__form', '\n\n/* ── Auth ── */\n.sure-auth__form')
  .replace('color: #fff; cursor: pointer', 'color: var(--on-accent); cursor: pointer')

const swap = (s) => s
  .replaceAll('var(--dark-surface)', 'var(--surface)')
  .replaceAll('var(--dark-text)', 'var(--text)')
  .replaceAll('var(--dark-muted)', 'var(--muted)')
  .replaceAll('var(--dark-border)', 'var(--border)')
  .replaceAll('var(--dark-bg)', 'var(--bg)')
  .replaceAll('var(--dark-error)', 'var(--error)')
  .replaceAll('var(--dark-highlight)', 'var(--highlight)')
  .replaceAll('var(--dark-primary)', 'var(--accent)')
  .replaceAll('var(--dark-focus)', 'var(--accent)')
  .replaceAll('box-shadow: 0 0 0 3px rgba(100,255,218,0.15);', 'box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent);')
  .replaceAll('box-shadow: 0 0 0 3px rgba(255,107,107,0.15);', 'box-shadow: 0 0 0 3px color-mix(in srgb, var(--error) 20%, transparent);')
  .replaceAll('box-shadow: 0 2px 8px rgba(0,0,0,0.3);', 'box-shadow: 0 2px 8px rgba(0,0,0,0.08);')
  .replaceAll('transparent); }\n.sure-auth__alert--success', 'transparent); }\n\n.sure-auth__alert--success')
  .replaceAll('background: var(--accent); color: var(--bg); cursor: pointer', 'background: var(--accent); color: var(--on-accent); cursor: pointer')

for (const t of ['dark', 'positronic']) {
  const got = swap(auth(t))
  if (got !== canonical) {
    let i = 0; while (got[i] === canonical[i]) i++
    throw new Error(`${t}: residual diff at ${i}:\n  got: ${JSON.stringify(got.slice(i - 40, i + 60))}\n  exp: ${JSON.stringify(canonical.slice(i - 40, i + 60))}`)
  }
}

// ---- contrast proof for the one visual delta: the auth button colour -----
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
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const ON_ACCENT = {
  nord: '#fff', forest: '#fff', dracula: '#fff',
  'vision-system': '#fff', 'vision-atkinson': '#fff',
  dark: 'var(--bg)', positronic: 'var(--bg)',
}
console.log('theme             auth-btn old -> new   (fg on accent)')
for (const [name, tok] of Object.entries(tokens)) {
  const oldBlock = auth(name)
  const oldFg = /color: (var\([^)]+\)|#fff); cursor: pointer/.exec(oldBlock)?.[1]
  const accent = resolve(tok, 'var(--accent)')
  const oldR = contrast(resolve(tok, oldFg), accent)
  const newR = contrast(resolve(tok, ON_ACCENT[name]), accent)
  const ok = Math.abs(newR - oldR) < 0.005
  console.log(`${name.padEnd(16)} ${oldR.toFixed(2)}:1 -> ${newR.toFixed(2)}:1 ${ok ? 'identical' : 'CHANGED'}`)
  if (!ok) throw new Error(`${name}: --on-accent does not preserve the theme's current button colour`)
}

// ---- --on-accent joins every theme's tokens (per-theme value = today's) --
let gen = fs.readFileSync('/usr/local/devel/sure-ui/src/generated/themes.ts', 'utf8')
for (const [name, value] of Object.entries(ON_ACCENT)) {
  const re = new RegExp(`('${name}': \`[\\s\\S]*?\\n)\\}\`,`)
  if (!re.test(gen)) throw new Error(`tokens for ${name} not found`)
  gen = gen.replace(re, `$1  --on-accent: ${value};\n}\`,`)
}

// ---- write: auth joins the shared blocks, data + fixture updated ---------
let shared = fs.readFileSync('/usr/local/devel/sure-ui/src/components/shared.ts', 'utf8')
shared = shared.replace('export const shared: Record<string, string[]> = {\n', `export const shared: Record<string, string[]> = {\n  'auth': [\`${canonical.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`],\n`)
fs.writeFileSync('/usr/local/devel/sure-ui/src/components/shared.ts', shared)

const genPath = '/usr/local/devel/sure-ui/src/generated/themes.ts'
gen = gen.replace(/\['auth', `[^`]*`\]/g, "['auth', ``]")
fs.writeFileSync(genPath, gen)

console.log('shared.ts + generated data updated; rebuild, then regenerate the fixture:')
console.log('  npm run build && node -e "<write fixture from dist themes>"')
