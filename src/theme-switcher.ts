// Theme switcher — the control that goes with the theme CSS strings.
//
// sure-ui ships themes as complete CSS; this mounts a select that swaps one in
// at runtime and remembers the choice. It owns no colours of its own: the
// control is styled by `var(--text)` / `var(--border)` like everything else, so
// switching the theme restyles the switcher too.
//
// The app still ships a default stylesheet (a `<link href="theme.css">`) so the
// page is styled before any JavaScript runs. While a non-default theme is
// active that link is disabled, so the two never fight in the cascade.

import { compose } from './compose.js'
import { themes } from './styles/index.js'
import type { ThemeName } from './styles/index.js'

export interface ThemeSwitcherOptions {
  /** Themes offered, in order. Defaults to every theme sure-ui exports. */
  themes?: ThemeName[]
  /** Where to mount. Defaults to a fixed slot in the top-right corner. */
  target?: HTMLElement | null
  /** Label text; pass '' to render the select alone. */
  label?: string
  /** localStorage key. Defaults to `sure-ui-theme`. */
  storageKey?: string
  /** Theme applied when nothing is stored. Defaults to `nord`. */
  defaultTheme?: ThemeName
  /** Persist the choice across visits. Defaults to true. */
  persist?: boolean
  onChange?: (theme: ThemeName) => void
}

export interface ThemeSwitcher {
  element: HTMLElement
  select: HTMLSelectElement
  /** Apply a theme without touching the control. */
  apply(theme: ThemeName): void
  destroy(): void
}

const STYLE_ID = 'sure-ui-theme'
const DEFAULT_STORAGE_KEY = 'sure-ui-theme'

/** The static stylesheet a page links to, if it has one. */
function defaultStylesheet(): HTMLLinkElement | null {
  const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
  return links.find((link) => /(^|\/)theme(\.min)?\.css(\?|$)/.test(link.getAttribute('href') ?? '')) ?? null
}

/** Write a theme into the page, replacing any previous one. */
export function applyTheme(theme: ThemeName, defaultTheme: ThemeName = 'nord'): void {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!style) {
    style = document.createElement('style')
    style.id = STYLE_ID
    style.setAttribute('data-sure-theme', theme)
    document.head.appendChild(style)
  }
  style.setAttribute('data-sure-theme', theme)
  style.textContent = compose({ theme })

  // The bundled stylesheet is the pre-JS default; step aside when another theme
  // is in force so both are not layered over each other.
  const link = defaultStylesheet()
  if (link) link.disabled = theme !== defaultTheme
}

export function mountThemeSwitcher(options: ThemeSwitcherOptions = {}): ThemeSwitcher {
  const names = options.themes ?? (Object.keys(themes) as ThemeName[])
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY
  const defaultTheme = options.defaultTheme ?? 'nord'
  const persist = options.persist ?? true

  const stored = persist ? (localStorage.getItem(storageKey) as ThemeName | null) : null
  const initial = stored && names.includes(stored) ? stored : defaultTheme

  const root = document.createElement('div')
  root.className = 'sure-theme-switcher'
  root.style.cssText = 'display:inline-flex;align-items:center;gap:0.4rem;'

  const labelText = options.label ?? 'Theme'
  if (labelText) {
    const label = document.createElement('label')
    label.className = 'sure-theme-switcher__label'
    label.htmlFor = 'sure-theme-switcher'
    label.textContent = labelText
    label.style.cssText = 'font-size:0.75rem;opacity:0.75;color:var(--text);'
    root.appendChild(label)
  }

  const select = document.createElement('select')
  select.id = 'sure-theme-switcher'
  select.className = 'sure-theme-switcher__select'
  select.style.cssText =
    'padding:0.3rem 0.5rem;border:1px solid var(--border);border-radius:6px;' +
    'background:var(--field);color:var(--text);font:inherit;font-size:0.8125rem;'
  for (const name of names) {
    const option = document.createElement('option')
    option.value = name
    option.textContent = name
    select.appendChild(option)
  }
  select.value = initial
  root.appendChild(select)

  const apply = (theme: ThemeName) => {
    applyTheme(theme, defaultTheme)
    if (persist) localStorage.setItem(storageKey, theme)
    options.onChange?.(theme)
  }

  select.addEventListener('change', () => apply(select.value as ThemeName))
  apply(initial)

  const target = options.target === undefined ? document.body : options.target
  if (target) {
    if (options.target === undefined) {
      root.style.cssText += 'position:fixed;top:0.75rem;right:0.75rem;z-index:900;'
    }
    target.appendChild(root)
  }

  return {
    element: root,
    select,
    apply(theme: ThemeName) {
      select.value = theme
      apply(theme)
    },
    destroy() {
      root.remove()
      document.getElementById(STYLE_ID)?.remove()
    },
  }
}
