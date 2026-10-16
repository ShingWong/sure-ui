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
import { mailMobile } from './styles/mail-mobile.js'
import { mailTokens } from './styles/mail-tokens.js'
import { tokens, runs } from './generated/themes.js'
import { shared } from './components/shared.js'
import { mail } from './components/mail.js'

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

/**
 * Mail families (sure-mail Track B) are an OPT-IN namespace on top of the 17
 * generated families: compose() emits their tokens, rules and touch behaviour
 * only when one is explicitly listed in `components`. The default
 * `components: 'all'` path must never include them — the frozen 0.1.9
 * fixture pins that output byte-for-byte (index.test.ts), and existing
 * consumers must not pay for mail CSS they did not ask for.
 */
export const MAIL_COMPONENTS = [
  'mail-action-bar', 'mail-compose', 'mail-folder-tree',
  'mail-list', 'mail-search', 'mail-thread',
] as const

export const COMPONENTS = [
  'auth', 'buttons', 'composites', 'crud', 'dialog', 'form', 'markdown',
  'menu', 'modal', 'page', 'regions', 'search', 'sessions', 'sidepanel',
  'status', 'table', 'toast',
  ...MAIL_COMPONENTS,
] as const
export type ComponentName = (typeof COMPONENTS)[number]

export interface ComposeOptions {
  /** Theme name, e.g. 'nord' or 'vision-atkinson'. */
  theme: string
  /**
   * Component blocks to include; 'all' (default) reproduces the full theme
   * byte-for-byte. The mail families (MAIL_COMPONENTS) are opt-in: they are
   * emitted — with their `--mail-*` tokens and touch rules — only when
   * listed explicitly here, never by 'all'.
   */
  components?: readonly ComponentName[] | 'all'
  /** Append the shared mobile & touch layer (default true). */
  mobile?: boolean
  /**
   * Extra CSS appended at the END of the components layer — inside the
   * layer, so specificity resolves normally against the block rules.
   * Callers use it for class names sure-ui does not own (generator template
   * defaults like `.field-input`). Placing it outside the layers would make
   * it unlayered, and unlayered CSS beats every layered rule regardless of
   * specificity — it would silently override the theme.
   */
  extra?: string
}

export function compose({ theme, components = 'all', mobile = true, extra }: ComposeOptions): string {
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
  // Mail namespaces: selected explicitly, never implied by 'all' (see the
  // MAIL_COMPONENTS doc — the frozen fixture pins the default output).
  const mailWanted = want === null ? [] : MAIL_COMPONENTS.filter((f) => want!.has(f))
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
  // mail families sit at the end of the components layer (after base +
  // shared), so every same-specificity tie resolves above the generic blocks
  for (const fam of mailWanted) comp += (mail[fam] ?? []).join('')
  // layer order mirrors the original source order (tokens, then base +
  // components, then mobile), so every same-specificity tie resolves exactly
  // as it did unlayered; what changes is only vs CONSUMER css, which is
  // unlayered and now always wins
  if (extra) comp += `\n${extra}`
  // Mail tokens extend the tokens layer — same :root vocabulary rules, still
  // below every components rule and below any unlayered skin override.
  const tokenBlock = mailWanted.length > 0 ? `${tokensOf}\n${mailTokens}` : tokensOf
  let out = `${LAYER_DECL}\n\n${wrap('sure.tokens', tokenBlock)}\n\n${wrap('sure.components', comp)}`
  if (mobile) {
    // Mail touch rules ride the SAME sure.mobile layer, appended after the
    // shared block — the shared layer's bytes stay untouched (the
    // byte-identical-across-themes assertion slices them from the marker to
    // EOF inside each theme string, which never carries mail output).
    const mobileBlock = mailWanted.length > 0 ? `${mobileLayer}${mailMobile}` : mobileLayer
    out += `\n\n${wrap('sure.mobile', mobileBlock)}`
  }
  return out + '\n'
}
