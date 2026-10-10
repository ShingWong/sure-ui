// Regenerate src/__fixtures__/themes-0.1.9.json from the built themes export.
// Since 0.2.0 (cascade layers) the fixture pins CONTENT bytes only — layer
// scaffolding is stripped first, so the fixture keeps meaning "the canonical
// theme content, byte-identical lineage to 0.1.9" and proof-section.mjs keeps
// comparing content to content. Run after `npm run build`:
//
//   node scripts/regen-fixture.mjs
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const { themes, stripLayers } = await import('../dist/index.js')
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', '__fixtures__', 'themes-0.1.9.json')
const content = Object.fromEntries(Object.entries(themes).map(([name, css]) => [name, stripLayers(css)]))
writeFileSync(out, JSON.stringify(content) + '\n')
console.log(`fixture regenerated (content bytes, layers stripped): ${Object.entries(content).map(([k, v]) => `${k}=${v.length}B`).join(' ')}`)
