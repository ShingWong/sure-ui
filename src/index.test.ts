import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { VERSION, nord, forest, dracula, dark, themes, compose, COMPONENTS, showNotification, clearNotifications } from './index.js'

describe('sure-ui', () => {
  it('exports VERSION matching package.json', () => {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as {
      version: string
    }
    expect(VERSION).toBe(pkg.version)
  })

  it('exports all four themes', () => {
    expect(nord).toBeTruthy()
    expect(forest).toBeTruthy()
    expect(dracula).toBeTruthy()
    expect(dark).toBeTruthy()
  })

  it('themes object contains all themes', () => {
    expect(themes.nord).toBe(nord)
    expect(themes.forest).toBe(forest)
    expect(themes.dracula).toBe(dracula)
    expect(themes.dark).toBe(dark)
  })

  it('nord theme contains expected CSS classes', () => {
    expect(nord).toContain('.sure-form')
    expect(nord).toContain('.btn-primary')
    expect(nord).toContain('.toast')
    expect(nord).toContain('.status-bar')
    expect(nord).toContain('.side-panel')
    expect(nord).toContain('.sure-table')
    expect(nord).toContain('.sure-crud')
    expect(nord).toContain('.sure-search')
    expect(nord).toContain('.sure-modal__form')
  })

  it('forest theme contains expected CSS classes', () => {
    expect(forest).toContain('.sure-form')
    expect(forest).toContain('.btn-primary')
    expect(forest).toContain('.toast')
    expect(forest).toContain('.status-bar')
  })

  it('dracula theme contains expected CSS classes', () => {
    expect(dracula).toContain('.sure-form')
    expect(dracula).toContain('.btn-primary')
    expect(dracula).toContain('.toast')
    expect(dracula).toContain('.side-panel')
  })

  it('themes have distinct styles', () => {
    expect(nord).not.toBe(forest)
    expect(forest).not.toBe(dracula)
  })

  it('all themes include auth classes', () => {
    for (const theme of [nord, forest, dracula, dark]) {
      expect(theme).toContain('sure-auth__form')
      expect(theme).toContain('sure-auth__input')
      expect(theme).toContain('sure-auth__btn')
      expect(theme).toContain('sure-auth__error')
      expect(theme).toContain('sure-auth__divider')
    }
  })

  it('all themes include markdown classes', () => {
    for (const theme of [nord, forest, dracula, dark]) {
      expect(theme).toContain('sure-markdown')
      expect(theme).toContain('sure-markdown table')
      expect(theme).toContain('sure-markdown pre')
      expect(theme).toContain('sure-markdown blockquote')
    }
  })

  it('all themes include menu classes', () => {
    for (const theme of [nord, forest, dracula, dark]) {
      expect(theme).toContain('sure-menu__item')
      expect(theme).toContain('sure-menu__divider')
    }
  })

  it('all themes include dialog classes', () => {
    for (const theme of [nord, forest, dracula, dark]) {
      expect(theme).toContain('sure-dialog-overlay')
      expect(theme).toContain('sure-dialog__header')
      expect(theme).toContain('sure-dialog__body')
      expect(theme).toContain('sure-dialog__resize--se')
    }
  })

  it('all themes include form field styles', () => {
    for (const theme of [nord, forest, dracula]) {
      expect(theme).toContain('__field')
      expect(theme).toContain('__label')
      expect(theme).toContain('__error')
      expect(theme).toContain('__help')
    }
  })

  it('exports notification functions', () => {
    expect(typeof showNotification).toBe('function')
    expect(typeof clearNotifications).toBe('function')
  })

  it('showNotification with inline mode adds error to DOM', () => {
    document.body.innerHTML = '<div class="sure-form__field"><input name="email" /></div>'
    showNotification({ id: '1', message: 'Required', level: 'error', mode: 'inline', field: 'email' })
    const errorEl = document.querySelector('.field-error')
    expect(errorEl).not.toBeNull()
    expect(errorEl!.textContent).toBe('Required')
  })

  it('showNotification with toast mode creates toast element', () => {
    showNotification({ id: '2', message: 'Saved!', level: 'success', mode: 'toast' })
    const toast = document.querySelector('.toast')
    expect(toast).not.toBeNull()
    expect(toast!.textContent).toContain('Saved!')
    expect(toast!.className).toContain('toast--success')
  })

  it('showNotification with statusBar mode creates status bar', () => {
    showNotification({ id: '3', message: 'Server error', level: 'error', mode: 'statusBar' })
    const bar = document.querySelector('.status-bar')
    expect(bar).not.toBeNull()
    expect(bar!.textContent).toContain('Server error')
  })

  it('clearNotifications removes toast container', () => {
    showNotification({ id: '4', message: 'test', level: 'info', mode: 'toast' })
    clearNotifications('toast')
    expect(document.querySelector('.toast')).toBeNull()
  })
})

// Every theme must expose the same generic names, and they must sit inside a
// selector. A block of `--x: y;` with no enclosing rule is silently discarded
// by every browser, which is exactly what happened: `--bg` and `--text` were
// declared outside `:root` in all four themes, so any app styling itself with
// `var(--bg)` got no background at all.
describe('themes: generic aliases', () => {
  const GENERIC = ['--bg', '--surface', '--text', '--muted', '--border', '--accent', '--error', '--success', '--warn',
    '--error-ink', '--success-ink', '--accent-ink', '--warn-ink']

  for (const [name, css] of Object.entries(themes)) {
    it(`${name} declares every generic alias`, () => {
      const missing = GENERIC.filter((v) => !css.includes(`${v}:`))
      expect(missing, `${name} is missing ${missing.join(', ')}`).toEqual([])
    })

    it(`${name} declares them inside a selector, not orphaned`, () => {
      for (const variable of GENERIC) {
        const at = css.indexOf(`${variable}:`)
        expect(at, `${name} does not declare ${variable}`).toBeGreaterThan(-1)
        const before = css.slice(0, at)
        const depth = (before.match(/{/g) ?? []).length - (before.match(/}/g) ?? []).length
        expect(depth, `${name} declares ${variable} at nesting depth 0 — the browser ignores it`).toBeGreaterThan(0)
      }
    })

    it(`${name} references no undefined variable`, () => {
      const declared = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]!))
      const used = [...css.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]!)
      const unknown = [...new Set(used)].filter((v) => !declared.has(v))
      expect(unknown, `${name} uses variables it never declares: ${unknown.join(', ')}`).toEqual([])
    })
  }
})

// A button's label must be readable against its own background. Measured from
// the shipped CSS, because that is what a browser applies — nord's primary
// button was 4.03:1, under the 4.5 WCAG AA threshold for normal text, and
// nothing caught it.
describe('themes: button contrast', () => {
  const luminance = (hex: string): number => {
    const parts = hex.match(/[0-9a-f]{2}/gi) ?? []
    if (parts.length < 3) throw new Error(`not a hex colour: ${hex}`)
    const [r = 0, g = 0, b = 0] = parts.slice(0, 3).map((p) => {
      const v = parseInt(p, 16) / 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const contrast = (a: string, b: string): number => {
    const hi = luminance(a)
    const lo = luminance(b)
    const [top = 0, bottom = 0] = [hi, lo].sort((x, y) => y - x)
    return (top + 0.05) / (bottom + 0.05)
  }
  /** Resolve `var(--x)` against the theme's own :root declarations. */
  const resolve = (css: string, value: string): string => {
    // A literal hex (including the 3-digit shorthand) needs no lookup.
    if (/^#[0-9a-fA-F]{3,8}$/.test(value.trim())) {
      const hex = value.trim()
      return hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join("")}` : hex
    }
    const ref = /var\((--[a-z0-9-]+)\)/i.exec(value)?.[1]
    if (!ref) return value.trim()
    const hex = new RegExp(`${ref}:\\s*(#[0-9a-fA-F]{3,8})`).exec(css)?.[1]
    if (!hex) throw new Error(`cannot resolve ${ref}`)
    return hex.length === 4
      ? `#${[...hex.slice(1)].map((c) => c + c).join("")}`
      : hex
  }

  for (const [name, css] of Object.entries(themes)) {
    it(`${name} primary button text is readable (>= 4.5:1)`, () => {
      const rule = /\.btn-primary\s*\{([^}]*)\}/.exec(css)?.[1] ?? ""
      const bg = /background:\s*([^;]+)/.exec(rule)?.[1]
      const fg = /color:\s*([^;]+)/.exec(rule)?.[1]
      expect(bg, `${name} has no .btn-primary background`).toBeTruthy()
      expect(fg, `${name} has no .btn-primary colour`).toBeTruthy()
      const ratio = contrast(resolve(css, resolve(css, bg!)), resolve(css, resolve(css, fg!)))
      expect(ratio, `${name} .btn-primary is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5)
    })
  }
})

/**
 * The page-region classes were promoted out of the management console, which had
 * carried them privately. Four themes means four places to forget one, and a
 * consumer that switches themes at runtime sees an unstyled page with nothing
 * in the logs to explain it. These assert presence, not appearance.
 *
 * The contrast of the *status* colours is asserted, not assumed — see
 * `describe('themes: status contrast')`.
 */
const REGION_CLASSES = [
  '.sure-toolbar', '.sure-filters', '.sure-note', '.sure-panel',
  '.sure-help', '.sure-help__title', '.sure-help__item', '.sure-help__summary',
  '.sure-help__details', '.sure-help__example',
  '.sure-toggle-group', '.sure-toggle', '.sure-row-actions',
  '.sure-nav__item', '.sure-nav__item--active', '.sure-nav__item:hover',
  '.visually-hidden', '.sure-table tr.is-selected',
]

describe('themes: page regions', () => {
  for (const [name, css] of Object.entries(themes)) {
    it(`${name} styles every promoted region class`, () => {
      const missing = REGION_CLASSES.filter((c) => !css.includes(c))
      expect(missing, `${name} is missing: ${missing.join(', ')}`).toEqual([])
    })

    it(`${name} hardcodes no colour in the promoted regions`, () => {
      // The whole point of the promotion is that a consumer can hand these to a
      // theme. A hex here would pin one palette, which is the bug that moved
      // the console's own stylesheet in the first place.
      const start = css.indexOf('.sure-toolbar')
      const block = start === -1 ? '' : css.slice(start)
      const hexes = [...block.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0])
      expect([...new Set(hexes)], `${name} pins colours: ${[...new Set(hexes)].join(', ')}`).toEqual([])
    })

    it(`${name} derives the nav hover from the theme, not a fixed white`, () => {
      // A hardcoded white tint is invisible on the light themes. The console
      // shipped exactly that until it was promoted.
      const hover = /\.sure-nav__item:hover\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
      expect(hover, `${name} has no .sure-nav__item:hover`).not.toBe('')
      expect(hover, `${name} uses a hardcoded rgba on nav hover`).not.toMatch(/rgba\(\s*255/)
      expect(hover, `${name} does not derive the hover from the theme`).toMatch(/var\(--/)
    })
  }
})

/**
 * Status contrast: text that reads on a 10% tint of its status colour.
 *
 * The alert pattern is a 10% tint of the status colour with a darker or
 * lighter cut of the same hue — the `*-ink` alias — as the text. The bare
 * status hues are mid-tone, so as text they landed at 1.7:1 (nord success)
 * against a near-white page. Each ink is its hue pushed until it clears the
 * 4.5 WCAG AA threshold, keeping the hue so the colour coding survives:
 *
 *     nord     error #86444a  success #525f46  accent #4d6174  warn #6a5b3f
 *     forest   error #7d2e2e  success #40623f  accent itself   warn #765623
 *     dracula  error #ff8888  the rest themselves
 *     dark     all themselves (each already clears it)
 *
 * The test composites the translucent background over the page the way a user
 * sees it, then measures the ink against that — comparing against the raw
 * 10%-alpha colour instead is what let the original failure report all-OK.
 */
describe('themes: status contrast', () => {
  const luminance = (hex: string): number => {
    const parts = hex.match(/[0-9a-f]{2}/gi) ?? []
    if (parts.length < 3) throw new Error(`not a hex colour: ${hex}`)
    const [r = 0, g = 0, b = 0] = parts.slice(0, 3).map((p) => {
      const v = parseInt(p, 16) / 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const contrast = (a: string, b: string): number => {
    const hi = luminance(a)
    const lo = luminance(b)
    const [top = 0, bottom = 0] = [hi, lo].sort((x, y) => y - x)
    return (top + 0.05) / (bottom + 0.05)
  }
  /** Follow `var(--x)` through alias chains to the palette hex. */
  const resolve = (css: string, value: string, depth = 0): string => {
    const v = value.trim()
    if (/^#[0-9a-fA-F]{3,8}$/.test(v)) {
      return v.length === 4 ? `#${[...v.slice(1)].map((c) => c + c).join('')}` : v
    }
    if (depth > 6) throw new Error(`cannot resolve ${value}: chain too deep`)
    const ref = /var\((--[a-z0-9-]+)\)/i.exec(v)?.[1]
    if (!ref) throw new Error(`cannot resolve ${value}: not a hex or a var()`)
    const decl = new RegExp(`${ref}:\\s*([^;]+);`).exec(css)?.[1]
    if (!decl) throw new Error(`cannot resolve ${ref}: never declared`)
    return resolve(css, decl, depth + 1)
  }
  /** What the eye sees: a translucent layer composited over the page. */
  const over = (fg: string, bg: string, alpha: number): string => {
    const a = fg.match(/[0-9a-f]{2}/gi)!.map((h) => parseInt(h, 16))
    const b = bg.match(/[0-9a-f]{2}/gi)!.map((h) => parseInt(h, 16))
    const c = a.map((v, i) => Math.round(v * alpha + (b[i] ?? 0) * (1 - alpha)))
    return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('')
  }

  const ALERTS = [
    { alert: 'error', status: '--error', ink: '--error-ink' },
    { alert: 'success', status: '--success', ink: '--success-ink' },
    { alert: 'info', status: '--accent', ink: '--accent-ink' },
  ] as const
  const INKS: ReadonlyArray<readonly [string, string]> = [
    ['--error', '--error-ink'],
    ['--success', '--success-ink'],
    ['--accent', '--accent-ink'],
    ['--warn', '--warn-ink'],
  ]

  for (const [name, css] of Object.entries(themes)) {
    for (const { alert, status, ink } of ALERTS) {
      it(`${name} alert--${alert} text clears AA on its own tint`, () => {
        const rule = new RegExp(`\\.sure-auth__alert--${alert}\\s*\\{([^}]*)\\}`).exec(css)?.[1] ?? ''
        expect(rule, `${name} has no .sure-auth__alert--${alert}`).not.toBe('')
        const bg = /background:\s*([^;]+);/.exec(rule)?.[1] ?? ''
        expect(bg, `${name} alert--${alert} is not a 10% tint of ${status}`)
          .toMatch(new RegExp(`color-mix\\(in srgb, var\\(${status}\\) 10%, transparent\\)`))
        const fg = /(?:^|;)\s*color\s*:\s*([^;]+);/.exec(`;${rule}`)?.[1] ?? ''
        expect(fg, `${name} alert--${alert} does not use its ink`)
          .toMatch(new RegExp(`var\\(${ink}\\)`))
        const seen = over(resolve(css, `var(${status})`), resolve(css, 'var(--bg)'), 0.1)
        const ratio = contrast(resolve(css, fg), seen)
        expect(ratio, `${name} alert--${alert} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5)
      })
    }

    it(`${name} declares a readable ink for every status`, () => {
      for (const [status, ink] of INKS) {
        const seen = over(resolve(css, `var(${status})`), resolve(css, 'var(--bg)'), 0.1)
        const ratio = contrast(resolve(css, `var(${ink})`), seen)
        expect(ratio, `${name} ${ink} is ${ratio.toFixed(2)}:1 on its tint`).toBeGreaterThanOrEqual(4.5)
      }
    })
  }
})

/**
 * Typography is part of the theme contract (added with the vision themes):
 * every theme declares the font vars AND ships the html/body rules that
 * apply them, so a runtime swap never drops the base typography. The site
 * additionally extracts only `:root` blocks — which is why every knob a
 * theme can turn must live in `:root` as a variable.
 */
describe('themes: typography contract', () => {
  const TYPO = ['--font-body', '--font-mono', '--font-size', '--line-height']

  for (const [name, css] of Object.entries(themes)) {
    it(`${name} declares the font variables`, () => {
      const missing = TYPO.filter((v) => !css.includes(`${v}:`))
      expect(missing, `${name} is missing ${missing.join(', ')}`).toEqual([])
    })

    it(`${name} ships the consumption rules`, () => {
      expect(css, `${name} html rule`).toMatch(/html \{ font-size: var\(--font-size, 100%\)/)
      expect(css, `${name} body font-family`).toMatch(/\nbody \{\n[^}]*font-family: var\(--font-body\)/)
      expect(css, `${name} body line-height`).toMatch(/\nbody \{\n[^}]*line-height: var\(--line-height/)
      expect(css, `${name} mono rule`).toMatch(/code, pre \{ font-family: var\(--font-mono\)/)
    })
  }
})

/**
 * Mobile & touch is part of the theme contract too (added 2026-10-09): the
 * layer is appended centrally in styles/index.ts, so what these assert is
 * that no theme escapes it and that the layer really is one shared block —
 * byte-identical across all seven — not seven hand-maintained copies.
 */
describe('themes: mobile and touch layer', () => {
  const MARK = '/* ── Mobile & touch'

  for (const [name, css] of Object.entries(themes)) {
    it(`${name} ships the shared mobile layer`, () => {
      const i = css.indexOf(MARK)
      expect(i, `${name} is missing the mobile & touch layer`).toBeGreaterThan(-1)
      const layer = css.slice(i)
      expect(layer, `${name} small screens`).toContain('@media (max-width: 640px)')
      expect(layer, `${name} touch reveals`).toContain('@media (hover: none)')
      expect(layer, `${name} coarse pointers`).toContain('@media (pointer: coarse)')
      expect(layer, `${name} 44px targets`).toContain('44px')
      // Last, so it wins ties against the component rules above it.
      expect(i, `${name} layer must follow the body rules`).toBeGreaterThan(css.indexOf('body {'))
    })
  }

  it('the layer is byte-identical in every theme', () => {
    const layers = Object.entries(themes).map(([name, css]) => {
      const i = css.indexOf(MARK)
      return i < 0 ? `MISSING in ${name}` : css.slice(i)
    })
    expect(new Set(layers).size).toBe(1)
  })

  it('touch reveals hover-only affordances', () => {
    const css: string = themes.nord
    const layer = css.slice(css.indexOf(MARK))
    expect(layer).toContain('.message .msg-actions { display: flex; }')
    expect(layer).toContain('.sure-session-item .sure-session-actions { display: flex; }')
  })
})

/**
 * compose() (0.2.0a): the exported theme strings ARE compose output —
 * tokens + component runs + mobile layer. Two properties are load-bearing
 * and measured here, not assumed: (1) `components: 'all'` is byte-identical
 * to the frozen 0.1.9 strings, so nothing moved for existing consumers;
 * (2) a subset really drops the unselected blocks (this is the whole
 * point of compile-time inclusion).
 */
describe('compose: compile-time assembly', () => {
  const fixture = JSON.parse(
    readFileSync(join(process.cwd(), 'src/__fixtures__/themes-0.1.9.json'), 'utf8'),
  ) as Record<string, string>

  for (const name of Object.keys(themes)) {
    it(`${name}: compose(all) is byte-identical to the 0.1.9 string`, () => {
      expect(compose({ theme: name }), `${name} drifted from fixture`).toBe(fixture[name])
    })
  }

  it('a subset drops unselected blocks and keeps tokens, base and mobile', () => {
    const css = compose({ theme: 'nord', components: ['form', 'table'] })
    expect(css).toContain(':root {')
    expect(css).toContain('.sure-form__title')
    expect(css).toContain('.sure-table {')
    expect(css).toContain('body {')
    expect(css).toContain('44px')
    // block-unique markers (the mobile layer names component classes too)
    expect(css).not.toContain('.sure-auth__divider')
    expect(css).not.toContain('.sure-dialog__header:active')
    expect(css).not.toContain('.sure-markdown blockquote')
    expect(css.length).toBeLessThan(themes.nord.length)
  })

  it('an empty component list keeps only tokens, base and mobile', () => {
    const css = compose({ theme: 'nord', components: [] })
    expect(css).toContain(':root {')
    expect(css).toContain('body {')
    expect(css).toContain('44px')
    expect(css).not.toContain('.sure-form__title')
    expect(css).not.toContain('.btn-primary:hover')
  })

  it('mobile can be excluded', () => {
    expect(compose({ theme: 'nord', components: [], mobile: false })).not.toContain('Mobile & touch')
  })

  it('names its failures (agent-friendly errors)', () => {
    expect(() => compose({ theme: 'nope' })).toThrow(/unknown theme "nope" — valid themes: nord/)
    expect(() => compose({ theme: 'nord', components: ['nope' as never] })).toThrow(/unknown component "nope" — valid components: auth/)
  })

  it('COMPONENTS names every family the generated data carries (minus base)', async () => {
    const { runs } = await import('./generated/themes.js')
    const fams = new Set<string>()
    for (const themeRuns of Object.values(runs)) for (const [f] of themeRuns) if (f !== 'base') fams.add(f)
    expect([...fams].sort()).toEqual([...COMPONENTS].sort())
  })
})

/**
 * The landing-page audit (2026-10-09) measured every theme with this same
 * math: two themes served sub-AA body text and four shipped sub-3:1 borders.
 * These assert the floor on the shipped CSS — measured, not assumed.
 */
describe('themes: readable text and borders (AA)', () => {
  const luminance = (hex: string): number => {
    const parts = hex.match(/[0-9a-f]{2}/gi) ?? []
    if (parts.length < 3) throw new Error(`not a hex colour: ${hex}`)
    const [r = 0, g = 0, b = 0] = parts.slice(0, 3).map((p) => {
      const v = parseInt(p, 16) / 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const contrast = (a: string, b: string): number => {
    const hi = luminance(a)
    const lo = luminance(b)
    const [top = 0, bottom = 0] = [hi, lo].sort((x, y) => y - x)
    return (top + 0.05) / (bottom + 0.05)
  }
  const resolve = (css: string, value: string, depth = 0): string => {
    const v = value.trim()
    if (/^#[0-9a-fA-F]{3,8}$/.test(v)) {
      return v.length === 4 ? `#${[...v.slice(1)].map((c) => c + c).join("")}` : v
    }
    if (depth > 6) throw new Error(`cannot resolve ${value}`)
    const ref = /var\((--[a-z0-9-]+)\)/i.exec(v)?.[1]
    if (!ref) throw new Error(`not a hex or var(): ${value}`)
    const decl = new RegExp(`${ref}:\\s*([^;]+);`).exec(css)?.[1]
    if (!decl) throw new Error(`never declared: ${ref}`)
    return resolve(css, decl, depth + 1)
  }

  for (const [name, css] of Object.entries(themes)) {
    const pair = (label: string, fg: string, bg: string, min: number) => {
      it(`${name} ${label} >= ${min}:1`, () => {
        const ratio = contrast(resolve(css, `var(${fg})`), resolve(css, `var(${bg})`))
        expect(ratio, `${name} ${label} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min)
      })
    }
    pair('body text on page', '--text', '--bg', 4.5)
    pair('muted text on page', '--muted', '--bg', 4.5)
    pair('muted text on card', '--muted', '--surface', 4.5)
    pair('links on page', '--accent', '--bg', 4.5)
    pair('links on card', '--accent', '--surface', 4.5)
    pair('border on page', '--border', '--bg', 3)
    pair('border on card', '--border', '--surface', 3)
  }
})

/**
 * The two vision themes: AAA text, large print. They share a palette and
 * differ only in --font-body, so a reader compares fonts, not colours.
 */
describe('vision themes: AAA contrast and large print', () => {
  const VISION = ['vision-system', 'vision-atkinson']
  const luminance = (hex: string): number => {
    const parts = hex.match(/[0-9a-f]{2}/gi) ?? []
    const [r = 0, g = 0, b = 0] = parts.slice(0, 3).map((p) => {
      const v = parseInt(p, 16) / 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const contrast = (a: string, b: string): number => {
    const [top = 0, bottom = 0] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (top + 0.05) / (bottom + 0.05)
  }
  const resolve = (css: string, value: string, depth = 0): string => {
    const v = value.trim()
    if (/^#[0-9a-fA-F]{3,8}$/.test(v)) {
      return v.length === 4 ? `#${[...v.slice(1)].map((c) => c + c).join("")}` : v
    }
    if (depth > 6) throw new Error(`cannot resolve ${value}`)
    const ref = /var\((--[a-z0-9-]+)\)/i.exec(v)?.[1]
    if (!ref) throw new Error(`not a hex or var(): ${value}`)
    const decl = new RegExp(`${ref}:\\s*([^;]+);`).exec(css)?.[1]
    if (!decl) throw new Error(`never declared: ${ref}`)
    return resolve(css, decl, depth + 1)
  }

  for (const name of VISION) {
    const css = themes[name as keyof typeof themes]
    it(`${name} clears AAA on body, muted and link text`, () => {
      for (const [label, fg, bg] of [
        ['text', '--text', '--bg'], ['muted', '--muted', '--bg'],
        ['muted on card', '--muted', '--surface'],
        ['links', '--accent', '--bg'], ['links on card', '--accent', '--surface'],
      ] as const) {
        const ratio = contrast(resolve(css, `var(${fg})`), resolve(css, `var(${bg})`))
        expect(ratio, `${name} ${label} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(7)
      }
    })

    it(`${name} keeps borders at non-text contrast (>= 3:1)`, () => {
      const ratio = contrast(resolve(css, 'var(--border)'), resolve(css, 'var(--surface)'))
      expect(ratio, `${name} border is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(3)
    })

    it(`${name} ships large print (>= 112.5% of the browser default)`, () => {
      const m = /--font-size:\s*([\d.]+)%/.exec(css)
      expect(m, `${name} has no percentage --font-size`).toBeTruthy()
      expect(parseFloat(m![1]!), `${name} --font-size`).toBeGreaterThanOrEqual(112.5)
      const lh = /--line-height:\s*([\d.]+)/.exec(css)
      expect(parseFloat(lh![1]!), `${name} --line-height`).toBeGreaterThanOrEqual(1.6)
    })
  }

  it('vision-atkinson leads with Atkinson Hyperlegible; vision-system with Verdana', () => {
    expect(themes['vision-atkinson']).toMatch(/--font-body: 'Atkinson Hyperlegible'/)
    expect(themes['vision-atkinson']).toMatch(/@font-face/)
    expect(themes['vision-system']).toMatch(/--font-body: Verdana/)
    expect(themes['vision-system']).not.toMatch(/@font-face/)
  })
})
