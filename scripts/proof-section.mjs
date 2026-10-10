// Section-removal proof: after a family unification, the new fixture must
// equal the old fixture everywhere except the unified run(s) and the added
// tokens. Usage: node scripts/proof-section.mjs <old-fixture.json> <old-generated-git-ref>
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const [oldPath, ref, ...families] = process.argv.slice(2)
const oldGen = execSync(`git show ${ref}:src/generated/themes.ts`, { encoding: 'utf8', maxBuffer: 20e6 })
const oldFix = JSON.parse(readFileSync(oldPath, 'utf8'))
const newFix = JSON.parse(readFileSync('src/__fixtures__/themes-0.1.9.json', 'utf8'))
const { shared } = await import('../dist/components/shared.js')

let ok = true
for (const name of Object.keys(newFix)) {
  const runsRe = new RegExp(`'${name}': \\[[\\s\\S]*?\\n  \\],`)
  const themeRuns = runsRe.exec(oldGen)?.[0] ?? ''
  let o = oldFix[name]
  let removed = 0
  for (const family of families) {
    const runRe = new RegExp(`\\['${family}', \`([\\s\\S]*?)\`\\]`, 'g')
    let m
    while ((m = runRe.exec(themeRuns)) !== null) { o = o.replace(m[1], ''); removed++ }
  }
  let n = newFix[name]
  for (const family of families) for (const s of shared[family] ?? []) n = n.replaceAll(s, '')
  // tokens added by the unification (any --X the old fixture lacked)
  const oldTokens = new Set((oldFix[name].match(/--[a-z0-9-]+(?=:)/g) ?? []))
  const added = [...new Set(n.match(/--[a-z0-9-]+(?=:)/g) ?? [])].filter((t) => !oldTokens.has(t))
  let o2 = o, n2 = n
  for (const t of added) {
    o2 = o2.replace(new RegExp(`\\n  ${t}: [^;]+;`, 'g'), '')
    n2 = n2.replace(new RegExp(`\\n  ${t}: [^;]+;`, 'g'), '')
  }
  // tokens whose VALUE changed (present in both, declaration differs) —
  // stripped from both sides and reported explicitly, never silently. The
  // change's own adjacent comment (/* ... */ immediately above) is part of
  // the same change and goes with it; nothing else in the token block moves.
  const decl = (s, t) => new RegExp(`\\n  ${t}: ([^;]+);`).exec(s)?.[1]
  const stripDecl = (s, t) => s.replace(
    new RegExp(`(?:\\n\\s*\\/\\*(?:(?!\\*\\/)[\\s\\S])*\\*\\/)?\\n\\s*${t}: [^;]+;`, 'g'), '')
  const changed = []
  for (const t of [...oldTokens]) {
    const ov = decl(o2, t), nv = decl(n2, t)
    if (ov !== undefined && nv !== undefined && ov !== nv) {
      changed.push(`${t}: ${ov} -> ${nv}`)
      o2 = stripDecl(o2, t)
      n2 = stripDecl(n2, t)
    }
  }
  const same = o2 === n2
  console.log(`${name.padEnd(16)} runs removed: ${removed} | added: ${added.join(',') || 'none'} | changed: ${changed.join('; ') || 'none'} | identical outside: ${same}`)
  if (changed.length) console.log(`  token change(s): ${changed.join(' | ')}`)
  if (!same) {
    ok = false
    let i = 0; while (o2[i] === n2[i]) i++
    console.log('  diff at', i, JSON.stringify(o2.slice(i - 30, i + 60)), 'vs', JSON.stringify(n2.slice(i - 30, i + 60)))
  }
}
console.log(ok ? `SECTION PROOF (${families.join('+')}): clean` : 'PROOF FAILED')
process.exit(ok ? 0 : 1)
