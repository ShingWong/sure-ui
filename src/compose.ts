// compose() — compile-time theme assembly: tokens + selected component
// runs + the shared mobile layer. Pure strings in, string out; consumers
// run it in their build and ship one static CSS file. With
// `components: 'all'` the output is byte-identical to the 0.1.9 theme
// strings (proven against src/__fixtures__/themes-0.1.9.json), so the
// existing `themes` export is compose output, not a separate source.
import { mobileLayer } from './styles/mobile.js'
import { tokens, runs } from './generated/themes.js'
import { shared } from './components/shared.js'

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
  let out = tokensOf
  const seen: Record<string, number> = {}
  for (const [fam, css] of runs[theme] ?? []) {
    if (fam === 'base') { out += css; continue }
    if (want !== null && !want.has(fam)) continue
    if (shared[fam] !== undefined) {
      // position-matched: a family can occur in several non-contiguous runs
      const j = (seen[fam] = (seen[fam] ?? 0) + 1)
      out += shared[fam][j - 1] ?? css
    } else {
      out += css
    }
  }
  // a wanted shared family this theme never carried (e.g. page on nord)
  // appends at the end — tail families by construction (page sits last in
  // positronic), so the position is honest
  if (want !== null) {
    for (const [fam, slices] of Object.entries(shared)) {
      if (want.has(fam) && (seen[fam] ?? 0) === 0) out += slices.join('')
    }
  }
  return mobile ? out + mobileLayer : out
}
