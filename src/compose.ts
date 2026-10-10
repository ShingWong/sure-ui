// compose() — compile-time theme assembly: tokens + selected component
// runs + the shared mobile layer. Pure strings in, string out; consumers
// run it in their build and ship one static CSS file. Output is emitted in
// three cascade layers (design doc, "Layers, in declared order"):
//
//   @layer sure.tokens, sure.components, sure.mobile;
//
// Consumer CSS is unlayered and therefore ALWAYS wins over the theme —
// no specificity arithmetic needed; mobile sits above components so
// narrow-screen tuning never depends on source order. The fixture test
// proves the wrapping is pure: stripLayers(compose(all)) is byte-identical
// to the frozen pre-layer strings.
import { mobileLayer } from './styles/mobile.js'
import { tokens, runs } from './generated/themes.js'
import { shared } from './components/shared.js'

/** Layer order: tokens < components < mobile. Consumer CSS stays unlayered. */
export const LAYER_DECL = '@layer sure.tokens, sure.components, sure.mobile;'
const wrap = (layer: string, css: string): string => `@layer ${layer} {\n${css}\n}`

/** Remove the layer scaffolding — inner bytes must be untouched. Exported
    so tests (and agents) can prove wrapping is pure against any snapshot.
    The wrapper contributes EXACTLY the first and last character of the
    block body (`{` + `\n` … `\n` + `}`), so stripping is positional — content
    that itself starts/ends with newlines (mobileLayer does) survives intact. */
export function stripLayers(css: string): string {
  let s = css
  if (!s.startsWith(LAYER_DECL)) return s
  s = s.slice(LAYER_DECL.length).replace(/^\n+/, '')
  const out: string[] = []
  while (true) {
    const m = /^@layer (sure\.[a-z]+) \{/.exec(s)
    if (!m) break
    s = s.slice(m[0].length) // now at MY leading \n
    let depth = 1
    let i = 0
    // walk to the matching close brace of THIS block (inner content may
    // contain any number of braces — count, don't regex)
    for (; i < s.length; i++) {
      if (s[i] === '{') depth++
      else if (s[i] === '}') { depth--; if (depth === 0) break }
    }
    if (depth !== 0) throw new Error(`stripLayers: unbalanced braces inside ${m[1]}`)
    const body = s.slice(0, i) // \n + content + \n
    if (!body.startsWith('\n') || !body.endsWith('\n')) {
      throw new Error(`stripLayers: ${m[1]} is missing its wrapper newlines`)
    }
    out.push(body.slice(1, -1)) // exactly my two added characters
    s = s.slice(i + 1).replace(/^\n+/, '') // skip } and the separator
  }
  if (s.trim()) throw new Error(`stripLayers: trailing content after layers: ${s.slice(0, 60)}…`)
  return out.join('')
}

export const COMPONENTS = [
  'auth', 'buttons', 'composites', 'crud', 'dialog', 'form', 'markdown',
  'menu', 'modal', 'page', 'regions', 'search', 'sessions', 'sidepanel',
  'status', 'table', 'toast',
] as const
export type ComponentName = (typeof COMPONENTS)[number]

export interface ComposeOptions {
  /** Theme name, e.g. 'nord' or 'vision-atkinson'. */
  theme: string
  /** Component blocks to include; 'all' (default) reproduces the full theme. */
  components?: readonly ComponentName[] | 'all'
  /** Append the shared mobile & touch layer (default true). */
  mobile?: boolean
}

export function compose({ theme, components = 'all', mobile = true }: ComposeOptions): string {
  const tokensOf = tokens[theme]
  if (tokensOf === undefined) {
    throw new Error(`unknown theme "${theme}" — valid themes: ${Object.keys(tokens).join(', ')}`)
  }
  let want: Set<string> | null = null
  if (components !== 'all') {
    want = new Set(components)
    for (const c of want) {
      if (!(COMPONENTS as readonly string[]).includes(c)) {
        throw new Error(`unknown component "${c}" — valid components: ${COMPONENTS.join(', ')}`)
      }
    }
  }
  let comp = ''
  const seen: Record<string, number> = {}
  for (const [fam, css] of runs[theme] ?? []) {
    if (fam === 'base') { comp += css; continue }
    if (want !== null && !want.has(fam)) continue
    if (shared[fam] !== undefined) {
      // position-matched: a family can occur in several non-contiguous runs
      const j = (seen[fam] = (seen[fam] ?? 0) + 1)
      comp += shared[fam][j - 1] ?? css
    } else {
      comp += css
    }
  }
  // a wanted shared family this theme never carried (e.g. page on nord)
  // appends at the end — tail families by construction (page sits last in
  // positronic), so the position is honest
  if (want !== null) {
    for (const [fam, slices] of Object.entries(shared)) {
      if (want.has(fam) && (seen[fam] ?? 0) === 0) comp += slices.join('')
    }
  }
  // layer order mirrors the original source order (tokens, then base +
  // components, then mobile), so every same-specificity tie resolves exactly
  // as it did unlayered; what changes is only vs CONSUMER css, which is
  // unlayered and now always wins
  let out = `${LAYER_DECL}\n\n${wrap('sure.tokens', tokensOf)}\n\n${wrap('sure.components', comp)}`
  if (mobile) out += `\n\n${wrap('sure.mobile', mobileLayer)}`
  return out + '\n'
}
