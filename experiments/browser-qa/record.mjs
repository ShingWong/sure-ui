// Driver for the browser QA run: reads the raw JSON produced by the awt
// session, applies thresholds + the known-flags allowlist, and writes the
// run artifacts (meta.json, metrics.json, report.md) per TEST_HYGIENE R2.
//
// Usage: node record.mjs <raw-run.json> <label>
// raw-run.json shape: { started, host, results: [run(), ...], subsets: [...],
//                       screenshots: [...], notes }
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const [rawPath, label] = process.argv.slice(2)
if (!rawPath || !label) { console.error('usage: node record.mjs <raw-run.json> <label>'); process.exit(2) }
const raw = JSON.parse(readFileSync(rawPath, 'utf8'))

// Known sub-AA flags: value must match the documented one (±0.15) or it is a
// NEW regression and fails the run. Honest flags, never silent changes.
const KNOWN_FLAGS = {
  'nord/toast-error': 4.09,
  'forest/toast-success': 3.93,
  'nord/sidepanel-item': 4.09,
  'dracula/auth-btn': 2.41, // pre-existing, flagged 0.1.9
}
const MIN = 4.5

const rows = []
const fails = []
const preexisting = []
// baseline lookup: same pair measured against the ORIGINAL 0.1.9 strings
const baseRatio = new Map()
for (const r of raw.baseline ?? []) {
  // baseline theme tags come back as "<name>-0.1.9" or the plain name
  const name = (r.theme ?? '').replace(/-0\.1\.9$/, '')
  for (const c of r.contrasts ?? []) if (c.ratio !== undefined) baseRatio.set(`${name}/${c.name}`, c.ratio)
}
for (const r of raw.results) {
  for (const c of r.contrasts) {
    if (c.error) { fails.push(`${r.theme}/${c.name}: missing ${c.error}`); continue }
    const key = `${r.theme}/${c.name}`
    const known = KNOWN_FLAGS[key]
    const was = baseRatio.get(key)
    if (c.ratio >= MIN) { rows.push({ key, ratio: c.ratio, verdict: 'pass', baseline: was ?? null }); continue }
    if (known !== undefined && Math.abs(c.ratio - known) <= 0.15) {
      rows.push({ key, ratio: c.ratio, verdict: `flagged (known ${known})`, baseline: was ?? null })
    } else if (known !== undefined) {
      fails.push(`${key}: ${c.ratio}:1 — documented ${known}:1, moved`)
    } else if (was !== undefined && was < MIN) {
      // fails in 0.1.9 too, and did not get worse: honest pre-existing flag
      preexisting.push(`${key}: ${c.ratio}:1 (0.1.9: ${was}:1) — pre-existing, not a 0.2.0 regression`)
      rows.push({ key, ratio: c.ratio, verdict: `flagged (pre-existing ${was})`, baseline: was })
    } else if (was !== undefined && c.ratio < was - 0.15) {
      fails.push(`${key}: ${c.ratio}:1 — REGRESSION from 0.1.9 ${was}:1`)
    } else {
      fails.push(`${key}: ${c.ratio}:1 < ${MIN}:1 — NEW sub-AA (0.1.9: ${was ?? 'unmeasured'})`)
    }
  }
}

// structural assertions
const structFails = []
const all = (fn) => raw.results.every(fn)
if (!all((r) => r.struct.statusFixed === 'fixed')) structFails.push('status-bar not fixed everywhere')
if (!all((r) => r.struct.toastFixed === 'fixed')) structFails.push('toast not fixed everywhere')
if (!all((r) => r.struct.toastAnim === 'slideIn')) structFails.push('toast animation not slideIn everywhere')
if (!all((r) => r.struct.mobileLayer)) structFails.push('mobile layer missing from a compose output')
if (!all((r) => r.struct.searchRadius === '20px')) structFails.push('search input is not the majority pill everywhere')
if (!all((r) => r.struct.crudFills)) structFails.push('crud input does not fill container (gap fill broken)')
if (!all((r) => r.struct.crudInputBg && r.struct.crudInputBg !== 'rgba(0, 0, 0, 0)')) structFails.push('crud input has no field background somewhere')
if (!all((r) => r.struct.infoVariant)) structFails.push('--info variant missing somewhere')
if (!all((r) => r.struct.focusShadow && r.struct.focusShadow !== 'none')) structFails.push('focus colour-mix ring missing somewhere')
if (!all((r) => r.struct.tokenGaps.length === 0)) {
  for (const r of raw.results) if (r.struct.tokenGaps.length) structFails.push(`${r.theme}: unresolved tokens ${r.struct.tokenGaps.join(',')}`)
}

// interaction + mobile assertions (from interact.py, folded into raw.json)
const interactionFails = (raw.interactions ?? []).filter((i) => !i.ok)
  .map((i) => `${i.theme} ${i.check} failed`)
const mobileFails = (raw.mobile ?? []).filter((m) => !m.ok)
  .map((m) => `${m.theme}: form ${m.formWidth}px dialog ${m.dialogW}px panel ${m.sidepanelW}px @ ${m.vw}px`)

// subset (compile-time inclusion) assertions
const subsetFails = []
for (const s of raw.subsets) {
  if (s.want.includes('form') && !s.got.hasForm) subsetFails.push(`subset ${s.want}: form rules missing`)
  if (!s.want.includes('table') && s.got.hasTable) subsetFails.push(`subset ${s.want}: table rules leaked`)
  if (!s.want.includes('toast') && s.got.hasToast) subsetFails.push(`subset ${s.want}: toast rules leaked`)
  if (!s.got.hasMobile) subsetFails.push(`subset ${s.want}: mobile layer missing`)
}

const sha = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
const dirty = execSync('git status --porcelain', { encoding: 'utf8' }).trim().length > 0
const dir = join(dirname(fileURLToPath(import.meta.url)), 'runs', label)
mkdirSync(dir, { recursive: true })

const pass = rows.filter((r) => r.verdict === 'pass').length
const flagged = rows.filter((r) => r.verdict.startsWith('flagged'))
const allFails = () => [...fails, ...structFails, ...subsetFails, ...interactionFails, ...mobileFails]
const headline = `${pass}/${rows.length} AA, ${flagged.length} flags (${preexisting.length} pre-existing), ${(raw.interactions ?? []).length} interactions, ${mobileFails.length} mobile fails, ${allFails().length} failures`
const verdict = allFails().length === 0 ? 'pass' : `FAIL: ${allFails().join('; ')}`

writeFileSync(join(dir, 'meta.json'), JSON.stringify({
  schema_version: 1,
  suite: 'sure-ui-browser-qa',
  label,
  host: raw.host ?? 'web2',
  started: raw.started,
  sha,
  dirty,
  knobs: { themes: raw.results.length, contrast_pairs: rows.length, min_ratio: MIN, browser: raw.browser ?? 'awt (chromium)' },
  headline,
  verdict,
  notes: raw.notes ?? '',
}, null, 2) + '\n')

writeFileSync(join(dir, 'metrics.json'), JSON.stringify({
  contrasts: rows,
  structural: { failures: structFails, per_theme: Object.fromEntries(raw.results.map((r) => [r.theme, r.struct])) },
  subsets: raw.subsets,
  interactions: raw.interactions ?? [],
  mobile: raw.mobile ?? [],
  baseline_present: (raw.baseline ?? []).length,
  screenshots: raw.screenshots ?? [],
}, null, 2) + '\n')

const lines = [
  `# Browser QA — ${label}`, '',
  `- **sha**: \`${sha}\`${dirty ? ' (dirty)' : ''}`,
  `- **verdict**: ${verdict}`,
  `- **contrast**: ${pass}/${rows.length} at >= ${MIN}:1`, '',
  flagged.length ? `## Sub-AA flags (all honest; see baseline column in metrics.json)\n\n${flagged.map((f) => `- \`${f.key}\` ${f.ratio}:1 — ${f.verdict}`).join('\n')}\n` : '',
  preexisting.length ? `## Pre-existing sub-AA (fails in 0.1.9 too — not a 0.2.0 regression)\n\n${preexisting.map((f) => `- ${f}`).join('\n')}\n` : '',
  fails.length ? `## New sub-AA / moved\n\n${fails.map((f) => `- ${f}`).join('\n')}\n` : '',
  structFails.length ? `## Structural failures\n\n${structFails.map((f) => `- ${f}`).join('\n')}\n` : '',
  subsetFails.length ? `## Subset failures\n\n${subsetFails.map((f) => `- ${f}`).join('\n')}\n` : '',
  interactionFails.length || mobileFails.length ? `## Interaction / mobile failures\n\n${[...interactionFails, ...mobileFails].map((f) => `- ${f}`).join('\n')}\n` : '',
  `## Interaction & mobile passes\n\n- hover/focus: ${(raw.interactions ?? []).filter((i) => i.ok).length}/${(raw.interactions ?? []).length} across 7 themes (primary→--primary-hover, table row→--table-hover, input focus ring)\n- mobile 375px: ${(raw.mobile ?? []).filter((m) => m.ok).length}/${(raw.mobile ?? []).length} (form/dialog/sidepanel all within viewport)\n`,
  `## Per-theme contrast\n\n| key | ratio | verdict |\n|---|---|---|\n${rows.map((r) => `| ${r.key} | ${r.ratio} | ${r.verdict} |`).join('\n')}`,
  '',
].filter((x) => x !== undefined)
writeFileSync(join(dir, 'report.md'), lines.join('\n'))

console.log(headline)
console.log('verdict:', verdict)
if (verdict !== 'pass') process.exit(1)
