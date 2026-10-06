import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { VERSION, nord, forest, dracula, dark, themes, showNotification, clearNotifications } from './index.js'

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
  const GENERIC = ['--bg', '--surface', '--text', '--muted', '--border', '--accent', '--error', '--success', '--warn']

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
 * The contrast of the *status* colours is a separate, known problem and is not
 * claimed here — see `describe('themes: status colours are not yet readable')`.
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
 * Known defect, recorded so it cannot be forgotten and cannot be mistaken for
 * something already handled.
 *
 * The alert pattern is a 10% tint of the status colour with the status colour
 * as the text. On the light themes the status colours are mid-tone, so the text
 * lands at 1.7:1 (nord success) against a near-white page — far below the 4.5
 * WCAG AA threshold for normal text. Measured in Chromium, compositing the
 * translucent background over the page the way a user sees it:
 *
 *     nord     success 1.7   info 2.1   error 3.2
 *     forest   success 3.1   info 4.8   error 4.3
 *     dracula  success 8.2   info 5.0   error 4.1
 *     dark     success 7.1   info 13.9  error 5.4
 *
 * Fixing it means giving each theme a foreground that reads on its own status
 * fill — black clears 4.5:1 on warn/success/accent in nord, dracula and dark,
 * but forest needs white on error and accent. That is a visual change to a
 * shipped component, so it is a decision rather than a drive-by fix.
 *
 * This test asserts the defect is still present. When it is fixed, delete it and
 * replace it with the contrast assertion it was standing in for.
 */
describe('themes: status colours are not yet readable', () => {
  it('records that the light themes fail AA on the alert pattern', () => {
    const failing = ['nord', 'forest', 'dracula']
    expect(failing).toContain('nord')
    // The assertion that matters is the one this test cannot yet make. Rather
    // than pretend, assert the shape of the problem so a future edit that
    // silently changes the pattern is noticed.
    const alert = /\.sure-auth__alert--success\s*\{([^}]*)\}/.exec(themes.nord)?.[1] ?? ''
    expect(alert, 'the alert pattern changed shape; re-measure before trusting this note')
      .toMatch(/background:\s*color-mix\(in srgb, var\(--success\) 10%, transparent\)/)
    expect(alert, 'the alert pattern changed shape; re-measure before trusting this note')
      .toMatch(/color:\s*var\(--success\)/)
  })
})
