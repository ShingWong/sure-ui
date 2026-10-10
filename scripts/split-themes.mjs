// One-off migration: slice the seven monolithic theme strings into
// tokens (the :root block, vision themes' @font-face included) plus named
// component fragments, preserving exact bytes and original rule order.
//
// Safety model: the script refuses to write anything unless every theme
// reconstructs byte-for-byte from its slices (assertReconstruction), and
// every top-level rule classifies into a known family (the classifier
// throws on unmatched selectors). Run: node scripts/split-themes.mjs
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const { themes, mobileLayer } = await import(join(here, '../dist/index.js'))

// selector -> component family; first match wins, order matters
const FAMILY = [
  [/^html$|^body$|^code, pre$|^\*/, 'base'],
  [/^\.pp-|^a$|^a:hover$|^pre$/, 'page'],
  [/^\.sure-form/, 'form'],
  [/^\.sure-modal/, 'modal'],
  [/^\.sure-dialog/, 'dialog'],
  [/^\.sure-table/, 'table'],
  [/^\.sure-crud/, 'crud'],
  [/^\.sure-search/, 'search'],
  [/^\.btn-/, 'buttons'],
  [/^\.toast|^@keyframes slideIn/, 'toast'],
  [/^\.status-bar/, 'status'],
  [/^\.side-panel/, 'sidepanel'],
  [/^\.sure-auth/, 'auth'],
  [/^\.sure-markdown/, 'markdown'],
  [/^\.sure-session|^\.msg-|^\.message/, 'sessions'],
  [/^\.sure-menu/, 'menu'],
  [/^\.sure-toolbar|^\.sure-filters|^\.sure-note|^\.sure-panel|^\.sure-help/, 'regions'],
  [/^\.sure-toggle|^\.sure-row-actions|^\.sure-nav__|^\.visually-hidden/, 'composites'],
]

function classify(sel) {
  const s = sel.replace(/\s+/g, ' ').trim()
  for (const [re, fam] of FAMILY) if (re.test(s)) return fam
  throw new Error(`unclassified selector: ${JSON.stringify(s.slice(0, 90))}`)
}

// Split into top-level rules with byte spans; leading comments/whitespace
// before each selector stay attached to that rule.
function rulesWithSpans(css) {
  const out = []
  let i = 0
  while (i < css.length) {
    const start = i
    const open = css.indexOf('{', i)
    if (open < 0) break
    const selRaw = css.slice(i, open)
    let depth = 0, k = open
    for (; k < css.length; k++) {
      if (css[k] === '{') depth++
      else if (css[k] === '}') { depth--; if (depth === 0) break }
    }
    const end = k + 1
    const sel = selRaw.replace(/\/\*[\s\S]*?\*\//g, '').trim()
    out.push({ sel, start, end, fam: sel.startsWith(':root') || sel.startsWith('@font-face') ? 'tokens' : classify(sel) })
    i = end
  }
  return out
}

function sliceTheme(name, full) {
  if (!full.endsWith(mobileLayer)) throw new Error(`${name}: missing mobile layer suffix`)
  const css = full.slice(0, -mobileLayer.length)

  const rules = rulesWithSpans(css)
  if (!rules.length || rules[0].fam !== 'tokens') throw new Error(`${name}: does not start with tokens`)

  // tokens = everything through the end of the :root block (@font-face rides along)
  const rootEnd = rules.filter(r => r.fam === 'tokens').at(-1).end
  const tokens = css.slice(0, rootEnd)

  // runs: contiguous slices of one family, in original order. A family can
  // appear in several runs (e.g. `.sure-table tr.is-selected` lives in the
  // state-hooks section, far from the table block), so runs — not a
  // family-keyed map — are what preserves bytes exactly.
  const runs = []
  let pendingStart = rootEnd
  let runFam = null, runEnd = null
  const flush = () => {
    if (!runFam) return
    if (runFam === 'tokens') { pendingStart = runEnd; runFam = null; return }
    runs.push([runFam, css.slice(pendingStart, runEnd)])
    pendingStart = runEnd
    runFam = null
  }
  for (const r of rules.slice(1)) {
    if (r.fam !== runFam) { flush(); runFam = r.fam }
    runEnd = r.end
  }
  flush()
  // trailing bytes after the last rule (whitespace) join the last run
  if (pendingStart < css.length && runs.length) {
    runs[runs.length - 1][1] += css.slice(pendingStart)
  }

  const rebuilt = tokens + runs.map(([, s]) => s).join('')
  if (rebuilt !== css) throw new Error(`${name}: reconstruction mismatch (${rebuilt.length} vs ${css.length})`)
  return { tokens, runs }
}

const out = {}
for (const [name, full] of Object.entries(themes)) out[name] = sliceTheme(name, full)

// ---- 0.2.0b: shared blocks -------------------------------------------------
// SHARE_EXACT families must be byte-identical wherever they occur; the
// fixture therefore does not move when they are shared. SHARE_NORM
// families may differ in whitespace/comments only — the collapse assert
// proves it, and the canonical pick keeps the variant that carries the
// section comment (documentation agents read).
const SHARE_EXACT = ['composites', 'dialog', 'page', 'regions']
const SHARE_NORM = [] // enabled per family once normalized; auth needs alias-gap rewrites first
const SHARE = [...SHARE_EXACT, ...SHARE_NORM]
const collapse = (s) => s.replace(/\s+/g, ' ').trim()
const runText = (t, fam) => t.runs.filter(([f]) => f === fam).map(([, s]) => s).join('')

const shared = {} // fam -> array of run slices (a family can occur in several
                  // non-contiguous runs; slices keep compose position-accurate)
for (const fam of SHARE_EXACT) {
  const perTheme = Object.values(out)
    .map((t) => t.runs.filter(([f]) => f === fam).map(([, s]) => s))
    .filter((a) => a.length)
  const variants = new Set(perTheme.map((a) => JSON.stringify(a)))
  if (variants.size !== 1) throw new Error(`${fam}: run structure or bytes differ across themes (${variants.size} variants)`)
  shared[fam] = JSON.parse([...variants][0])
}
for (const fam of SHARE_NORM) {
  const perTheme = Object.values(out)
    .map((t) => t.runs.filter(([f]) => f === fam).map(([, s]) => s.join('')))
    .filter((a) => a.length)
  const byKey = {}
  for (const runsOf of perTheme) (byKey[collapse(runsOf)] ??= []).push(runsOf)
  const keys = Object.keys(byKey)
  if (keys.length !== 1) throw new Error(`${fam}: not whitespace-equivalent (${keys.length} variants) — real drift, use the alias-gap path`)
  const variants = [...new Set(byKey[keys[0]])]
  shared[fam] = variants.find((s) => s.includes('/*')) ?? variants[0]
  shared[fam] = [shared[fam]]
}

// Global safety net: sharing (and any normalization) may change whitespace,
// never meaning. Every final theme must collapse back to the 0.1.9 original.
// Substitution is position-matched: the j-th run of family f takes shared[f][j].
const subRuns = (t) => {
  const seen = {}
  return t.runs.flatMap(([f, s]) => {
    if (!SHARE.includes(f)) return [[f, s]]
    const j = (seen[f] = (seen[f] ?? 0) + 1)
    const slice = shared[f][j - 1]
    if (slice === undefined) throw new Error(`no shared slice for ${f} run ${j}`)
    return [[f, slice]]
  })
}
for (const [name, t] of Object.entries(out)) {
  const final = t.tokens + subRuns(t).map(([, s]) => s).join('') + mobileLayer
  if (collapse(final) !== collapse(themes[name])) throw new Error(`${name}: sharing changed meaning, not just whitespace`)
}

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')

let ts = `// GENERATED by scripts/split-themes.mjs from the 0.1.9 theme strings.
// Do not edit by hand: edit the shared component blocks (0.2.0b) instead.
// Reconstruction is proven byte-for-byte by tests (fixtures/themes-0.1.9.json).
// Shared families keep their position here with an empty string; compose()
// fills them from src/components/shared.ts (byte-identical, assert-proven).
export const tokens: Record<string, string> = {\n`
for (const [name, t] of Object.entries(out)) ts += `  '${name}': \`${esc(t.tokens)}\`,\n`
ts += `}\n\nexport const runs: Record<string, Array<[string, string]>> = {\n`
for (const [name, t] of Object.entries(out)) {
  ts += `  '${name}': [\n`
  for (const [fam, s] of t.runs) ts += `    ['${fam}', \`${esc(SHARE.includes(fam) ? '' : s)}\`],\n`
  ts += `  ],\n`
}
ts += `}\n`

writeFileSync(join(here, '../src/generated/themes.ts'), ts)

let sh = `// Shared component blocks (0.2.0b): byte-identical run structure and bytes
// across every theme that carried them (assert-proven by
// scripts/split-themes.mjs; the global collapse assert additionally proves
// the sharing changes no meaning). A family can occur in several
// non-contiguous runs, so slices — one per run, position-matched by
// compose() — are the correct shape, not a single string.
// Edit these directly from 0.2.0b on; regenerate only to re-prove.
export const shared: Record<string, string[]> = {\n`
for (const [fam, slices] of Object.entries(shared)) sh += `  '${fam}': [${slices.map((x) => `\`${esc(x)}\``).join(', ')}],\n`
sh += `}\n`
writeFileSync(join(here, '../src/components/shared.ts'), sh)

// The fixture pins the FINAL consumer-visible bytes (post-sharing; for the
// exact-share milestone these equal the 0.1.9 strings byte-for-byte, which
// the equivalence test asserts).
const finals = {}
for (const [name, t] of Object.entries(out)) {
  finals[name] = t.tokens + subRuns(t).map(([, s]) => s).join('') + mobileLayer
}
writeFileSync(join(here, '../src/__fixtures__/themes-0.1.9.json'), JSON.stringify(finals, null, 0) + '\n')

const fams = [...new Set(Object.values(out).flatMap(t => t.runs.map(([f]) => f)))].sort()
console.log('families:', fams.join(', '))
for (const [name, t] of Object.entries(out)) {
  const sizes = Object.entries(t.runs.reduce((a, [f, s]) => ((a[f] = (a[f] ?? 0) + s.length), a), {})).map(([f, n]) => `${f}:${n}`).join(' ')
  console.log(`${name.padEnd(16)} tokens:${t.tokens.length} ${sizes}`)
}
console.log('reconstruction: byte-identical for all', Object.keys(out).length, 'themes')
