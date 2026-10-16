import { describe, it, expect } from 'vitest'
import { compose, themes, COMPONENTS, MAIL_COMPONENTS } from './index.js'
import type { ComponentName } from './index.js'
import { mail } from './components/mail.js'
import { mailMobile } from './styles/mail-mobile.js'
import { mailTokens } from './styles/mail-tokens.js'

/**
 * Mail components (sure-mail Track B): an OPT-IN namespace on top of the 17
 * generated families. Three properties are load-bearing and measured here:
 *
 *   1. default compose output is untouched — the frozen 0.1.9 fixture still
 *      matches byte-for-byte and no theme ships a `--mail-*` var it did not
 *      declare before (index.test.ts keeps owning the fixture itself);
 *   2. mail output stays inside the three-layer model: tokens in
 *      sure.tokens, rules in sure.components, touch rules appended to
 *      sure.mobile without disturbing the shared layer's bytes;
 *   3. the component CSS is skin-neutral: no colour literals, no font stack,
 *      every var() declared — fidelity comes from tokens, proven in
 *      experiments/mail-gmail/.
 */
const ALL_MAIL = MAIL_COMPONENTS
const mailCss = compose({ theme: 'nord', components: ALL_MAIL })

/** Inner content of one @layer block (brace-walked — content has braces). */
const layerOf = (css: string, name: string): string => {
  const head = `@layer ${name} {`
  const open = css.indexOf(head)
  expect(open, `no @layer ${name} block`).toBeGreaterThan(-1)
  let depth = 1
  let i = open + head.length
  for (; i < css.length; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}') { depth--; if (depth === 0) break }
  }
  expect(depth, `unbalanced ${name} layer`).toBe(0)
  return css.slice(open + head.length, i)
}

describe('mail: opt-in compose', () => {
  it('no theme ships mail CSS by default', () => {
    // compose('all') is pinned byte-for-byte to the 0.1.9 fixture by
    // index.test.ts; this asserts the same rule from the other side: the
    // mail namespace never rides along uninvited.
    for (const [name, css] of Object.entries(themes)) {
      expect(css, `${name} ships mail rules by default`).not.toContain('.sure-mail-list')
      expect(css, `${name} ships mail tokens by default`).not.toContain('--mail-')
      expect(css, `${name} ships mail touch rules by default`).not.toContain('Mail: mobile & touch')
    }
  })

  it('every mail family is a valid COMPONENTS entry and vice versa', () => {
    expect(Object.keys(mail).sort()).toEqual([...MAIL_COMPONENTS].sort())
    for (const fam of MAIL_COMPONENTS) expect(COMPONENTS).toContain(fam)
    expect(MAIL_COMPONENTS.length).toBe(6)
  })

  it('emits tokens, rules and touch behaviour inside the three layers', () => {
    const css = mailCss
    expect(css.startsWith('@layer sure.tokens, sure.components, sure.mobile;')).toBe(true)
    const order = ['sure.tokens', 'sure.components', 'sure.mobile']
    const positions = order.map((l) => css.indexOf(`@layer ${l} {`))
    expect(positions.every((p) => p > 0)).toBe(true)
    expect([...positions].sort((a, b) => a - b)).toEqual(positions)

    const tokens = layerOf(css, 'sure.tokens')
    const components = layerOf(css, 'sure.components')
    const mobile = layerOf(css, 'sure.mobile')

    // mail tokens live in the TOKENS layer (skins override them unlayered,
    // which wins over every layered rule)
    expect(tokens).toContain('--mail-list-row-h:')
    expect(tokens).toContain('--mail-density:')
    expect(tokens).toContain('--mail-unread-weight:')
    expect(tokens).toContain('--mail-accent-alias:')
    expect(tokens).toContain('--mail-pane-bg:')

    // mail rules in the COMPONENTS layer, after the shared/base blocks
    for (const fam of ALL_MAIL) {
      expect(components, `${fam} missing from the components layer`).toContain(mail[fam]![0]!.trim().slice(0, 40))
    }
    expect(components).toContain('.sure-mail-row')

    // mail touch rules appended to the MOBILE layer, shared block untouched
    // (byte-prefix proof in the test below)
    expect(mobile).toContain('/* ── Mobile & touch')
    expect(mobile).toContain('/* ── Mail: mobile & touch')
    expect(mobile.indexOf('/* ── Mail')).toBeGreaterThan(mobile.indexOf('/* ── Mobile'))
  })

  it('the shared mobile layer bytes survive a mail compose', () => {
    // A default theme's sure.mobile block, byte for byte, must remain a
    // prefix of the mail compose's — mail rules are appended, never merged.
    const mailMobileLayer = layerOf(mailCss, 'sure.mobile')
    const sharedMobileLayer = layerOf(themes.nord, 'sure.mobile')
    expect(mailMobileLayer.startsWith(sharedMobileLayer), 'shared mobile layer bytes changed').toBe(true)
    expect(mailMobileLayer).toContain('/* ── Mail: mobile & touch')
    expect(mailMobileLayer).toContain('.sure-mail-row .sure-mail-row__actions { display: flex; }')
  })

  it('mobile:false keeps mail rules but drops the touch block', () => {
    const css = compose({ theme: 'nord', components: ['mail-list'], mobile: false })
    expect(css).toContain('.sure-mail-row')
    expect(css).not.toContain('Mail: mobile & touch')
    expect(css).not.toContain('@layer sure.mobile {')
  })

  it('selecting one family does not drag in the others', () => {
    const css = compose({ theme: 'nord', components: ['mail-list'] })
    expect(css).toContain('.sure-mail-row')
    // block-unique markers only: the (shared-by-design) mail touch block
    // names classes across families, exactly like the shared mobile layer
    // names .sure-form classes in a form-less compose.
    expect(css).not.toContain('.sure-mail-thread__quote-toggle')
    expect(css).not.toContain('.sure-mail-tree__count')
    expect(css).not.toContain('.sure-mail-compose__chips')
    expect(css).not.toContain('.sure-mail-action-bar')
    expect(css).not.toContain('.sure-mail-search__chip.is-active')
    // …but the shared token block ships whole, so any mail family can rely
    // on any --mail-* var (one vocabulary, declared once)
    expect(css).toContain('--mail-search-radius:')
  })

  it('composes alongside legacy families', () => {
    const css = compose({ theme: 'nord', components: ['form', 'mail-list'] })
    expect(css).toContain('.sure-form__title')
    expect(css).toContain('.sure-mail-row')
    expect(css).toContain('@layer sure.mobile {')
  })

  it('still names its failures', () => {
    expect(() => compose({ theme: 'nord', components: ['mail-nope' as never] }))
      .toThrow(/unknown component "mail-nope"/)
  })
})

describe('mail: class contract', () => {
  const CONTRACT: Record<string, string[]> = {
    'mail-list': [
      '.sure-mail-list', '.sure-mail-list--comfortable', '.sure-mail-list--compact',
      '.sure-mail-row', '.sure-mail-row--unread', '.sure-mail-row--flagged',
      '.sure-mail-row--has-attachment',
      '.sure-mail-row--selected', '.sure-mail-row__check', '.sure-mail-row__flag',
      '.sure-mail-row__sender', '.sure-mail-row__main', '.sure-mail-row__subject',
      '.sure-mail-row__preview', '.sure-mail-row__attachments', '.sure-mail-row__time',
      '.sure-mail-row__actions',
    ],
    'mail-thread': [
      '.sure-mail-thread', '.sure-mail-thread__header', '.sure-mail-thread__title',
      '.sure-mail-thread__meta', '.sure-mail-thread__from', '.sure-mail-thread__date',
      '.sure-mail-thread__body', '.sure-mail-thread__quote-toggle',
      '.sure-mail-thread__quote', '.sure-mail-thread__quote.is-collapsed',
      '.sure-mail-thread__attachments', '.sure-mail-thread__attachment',
    ],
    'mail-folder-tree': [
      '.sure-mail-tree', '.sure-mail-tree__item', '.sure-mail-tree__item.is-selected',
      '.sure-mail-tree__item.is-dragging', '.sure-mail-tree__item.is-drop-target',
      '.sure-mail-tree__twisty', '.sure-mail-tree__icon', '.sure-mail-tree__label',
      '.sure-mail-tree__count', '.sure-mail-tree__drag',
    ],
    'mail-compose': [
      '.sure-mail-compose', '.sure-mail-compose__address', '.sure-mail-compose__label',
      '.sure-mail-compose__chips', '.sure-mail-compose__chip', '.sure-mail-compose__chip-remove',
      '.sure-mail-compose__input', '.sure-mail-compose__subject',
      '.sure-mail-compose__toolbar', '.sure-mail-compose__tool',
      '.sure-mail-compose__tool-divider', '.sure-mail-compose__body',
      '.sure-mail-compose__footer', '.sure-mail-compose__status', '.sure-mail-compose__actions',
    ],
    'mail-action-bar': [
      '.sure-mail-action-bar', '.sure-mail-action',
      '.sure-mail-action--flagged',
    ],
    'mail-search': [
      '.sure-mail-search', '.sure-mail-search__input', '.sure-mail-search__filters',
      '.sure-mail-search__chip', '.sure-mail-search__chip.is-active',
    ],
  }

  for (const [fam, classes] of Object.entries(CONTRACT)) {
    it(`${fam} styles every contracted class when selected`, () => {
      const css = compose({ theme: 'nord', components: [fam as ComponentName] })
      const missing = classes.filter((c) => !css.includes(c))
      expect(missing, `${fam} is missing: ${missing.join(', ')}`).toEqual([])
    })
  }

  it('action-bar modifiers exist for archive, junk, delete, move, flag and snooze', () => {
    // The strip ships as markup hooks: geometry/colour are tokens, the icon
    // is consumer SVG — but every named action keeps a stable modifier so
    // skins can target it.
    const css = compose({ theme: 'nord', components: ['mail-action-bar'] })
    for (const mod of ['--archive', '--junk', '--delete', '--move', '--flag', '--snooze']) {
      expect(css, `no .sure-mail-action${mod} hook`).toContain(`.sure-mail-action${mod}`)
    }
  })

  it('embeds the mail slices verbatim in every theme', () => {
    // What decides the look is the --mail-* tokens, so the rules themselves
    // must reach every theme unmodified — same bytes, seven palettes.
    for (const theme of Object.keys(themes)) {
      const css = compose({ theme, components: ALL_MAIL })
      for (const [fam, slices] of Object.entries(mail)) {
        for (const slice of slices) expect(css, `${theme} lost part of ${fam}`).toContain(slice)
      }
    }
  })
})

describe('mail: skin neutrality (tokens only)', () => {
  const mailBlocks = Object.values(mail).flat().join('\n')

  it('ships no colour literals in any mail block', () => {
    // Fidelity is a skin's job (experiments/mail-gmail overrides vars only);
    // a hex here would pin one palette into component CSS.
    const hexes = [...mailBlocks.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0])
    const functions = [...mailBlocks.matchAll(/\b(rgb|hsl)a?\(/g)].map((m) => m[0])
    expect([...new Set(hexes)], `component hexes: ${[...new Set(hexes)].join(', ')}`).toEqual([])
    expect([...new Set(functions)], `component colour functions: ${[...new Set(functions)].join(', ')}`).toEqual([])
    const mobileHexes = [...mailMobile.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0])
    expect(mobileHexes, 'the mobile block must stay colour-free too').toEqual([])
    const tokenHexes = [...mailTokens.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0])
    expect(tokenHexes, 'mail tokens default through theme aliases, not literals').toEqual([])
  })

  it('declares no font stack — typography stays on the contract', () => {
    expect(mailBlocks).not.toContain('font-family')
    expect(mailTokens).not.toContain('font-family')
    expect(mailTokens).not.toMatch(/--font-(body|mono)\s*:/)
    // …and keeps widgets in step with the inherited stack instead
    expect(mailBlocks).toContain('font: inherit')
  })

  it('the composed mail output references no undeclared variable', () => {
    // Same gate index.test.ts runs over themes: a var() with no declaration
    // is an invisible property, and skins compose on top of this output.
    for (const theme of Object.keys(themes)) {
      const css = compose({ theme, components: ALL_MAIL })
      const declared = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]!))
      const used = [...css.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]!)
      const unknown = [...new Set(used)].filter((v) => !declared.has(v))
      expect(unknown, `${theme} uses variables it never declares: ${unknown.join(', ')}`).toEqual([])
    }
  })

  it('mail tokens are declared once, at :root, inside the tokens layer', () => {
    const tokens = layerOf(mailCss, 'sure.tokens')
    expect(tokens).toMatch(/:root \{[^}]*--mail-density: 1;/s)
    // every --mail-* var the components use is declared in that one block
    const blocks = Object.values(mail).flat().join('\n') + mailMobile
    const declared = new Set([...mailTokens.matchAll(/(--mail-[a-z0-9-]+)\s*:/g)].map((m) => m[1]!))
    const used = [...new Set([...blocks.matchAll(/var\((--mail-[a-z0-9-]+)/g)].map((m) => m[1]!))]
    const unknown = used.filter((v) => !declared.has(v))
    expect(unknown, `mail blocks use undeclared tokens: ${unknown.join(', ')}`).toEqual([])
  })

  it('density is one knob: the compact modifier sets it, rows read it', () => {
    expect(mailCss).toMatch(/\.sure-mail-list--compact \{ --mail-density: 0\.72; \}/)
    expect(mailCss).toMatch(/min-height: var\(--mail-list-row-h\)/)
    expect(mailTokens).toContain('--mail-list-row-h: calc(2.5rem * var(--mail-density));')
  })
})

describe('mail: a11y basics', () => {
  const FOCUSABLE = [
    '.sure-mail-row', '.sure-mail-tree__item', '.sure-mail-action',
    '.sure-mail-compose__tool', '.sure-mail-compose__chip-remove',
    '.sure-mail-thread__quote-toggle', '.sure-mail-search__chip',
  ]

  it('every actionable element has a focus-visible ring from --focus', () => {
    for (const sel of FOCUSABLE) {
      const rule = new RegExp(`${sel.replace(/\./g, '\\.')}:focus-visible\\s*\\{([^}]*)\\}`).exec(mailCss)?.[1] ?? ''
      expect(rule, `${sel} has no :focus-visible rule`).not.toBe('')
      expect(rule, `${sel} ring does not derive from --focus`).toContain('var(--focus)')
    }
    // inputs keep the repo's idiom (input:focus ring, aria-invalid)
    expect(mailCss).toMatch(/\.sure-mail-search__input:focus\s*\{[^}]*var\(--focus\)/)
    expect(mailCss).toContain('.sure-mail-search__input[aria-invalid="true"]')
  })

  it('ships the aria state hooks the markup will carry', () => {
    expect(mailCss).toContain('.sure-mail-row[aria-selected="true"]')
    expect(mailCss).toContain('.sure-mail-action[aria-pressed="true"]')
    expect(mailCss).toContain('.sure-mail-search__chip[aria-pressed="true"]')
    expect(mailCss).toContain('.sure-mail-tree__item[aria-current]')
  })

  it('touch reveals the hover-only row actions and bumps targets to 44px', () => {
    expect(mailCss).toContain('@media (hover: none)')
    expect(mailCss).toContain('.sure-mail-row .sure-mail-row__actions { display: flex; }')
    expect(mailCss).toContain('@media (pointer: coarse)')
    expect(mailCss).toMatch(/\.sure-mail-row,?\s*\n?\s*\.sure-mail-tree__item \{ min-height: 44px; \}/)
    expect(mailCss).toMatch(/\.sure-mail-action \{ width: 44px; height: 44px; \}/)
  })
})
