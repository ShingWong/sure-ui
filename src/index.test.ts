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
    const parts = hex.match(/[0-9a-f]{2}/gi)!.map((p) => parseInt(p, 16) / 255)
    const [r, g, b] = parts.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const contrast = (a: string, b: string): number => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (hi + 0.05) / (lo + 0.05)
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
