// Regenerate baseline-0.1.9.json from the ORIGINAL theme strings on master
// (pre-unification src/styles/*.ts). The browser A/B measures this file with
// identical probes, so every flag can be classified pre-existing vs new.
// Usage: node scripts/make-baseline.mjs
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const NAMES = ['dark', 'dracula', 'forest', 'nord', 'positronic', 'vision-atkinson', 'vision-system']
const themes = {}
for (const f of NAMES) {
  const src = execSync(`git show master:src/styles/${f}.ts`, { encoding: 'utf8', maxBuffer: 20e6 })
  const a = src.indexOf('`') + 1
  const b = src.lastIndexOf('`')
  if (!a || b <= a) throw new Error(`${f}: no template literal in master's theme file`)
  themes[f] = src.slice(a, b)
}
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'experiments', 'browser-qa', 'baseline-0.1.9.json')
writeFileSync(out, JSON.stringify(themes))
console.log(`baseline written: ${Object.entries(themes).map(([k, v]) => `${k}=${v.length}B`).join(' ')}`)
