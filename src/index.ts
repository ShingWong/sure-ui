// Derived from package.json rather than hardcoded, so it cannot drift out of
// sync on a version bump. A literal here previously broke the test suite on
// every release until someone remembered to edit it by hand.
export const VERSION: string = (await import('../package.json', { with: { type: 'json' } })).default.version

/**
 * A document text style: the theme's CSS font stack plus physical print metrics.
 * Sizes and leading are in points; weight is carried here, not as a CSS rule.
 */
export interface TypographyStyle {
  readonly css: string
  readonly ptSize: number
  readonly linePt: number
  readonly weight: number
}

/**
 * The single source of truth for document typography. `css` points at the
 * `--sure-font-*` custom property every theme declares; the numbers are the
 * metrics sure-document needs to lay out paper (pt), independent of the browser.
 * No runtime dependencies — callers can import this in a test harness.
 */
export const SURE_TYPOGRAPHY = {
  heading1: { css: 'var(--sure-font-h1)', ptSize: 18, linePt: 22, weight: 700 },
  heading2: { css: 'var(--sure-font-h2)', ptSize: 14, linePt: 18, weight: 600 },
  body: { css: 'var(--sure-font-body)', ptSize: 10, linePt: 14, weight: 400 },
  caption: { css: 'var(--sure-font-caption)', ptSize: 8, linePt: 11, weight: 400 },
  mono: { css: 'var(--sure-font-mono)', ptSize: 9, linePt: 12, weight: 400 },
} as const satisfies Record<string, TypographyStyle>

export type TypographyKind = keyof typeof SURE_TYPOGRAPHY

export { nord, forest, dracula, dark, themes, positronic, mobileLayer } from './styles/index.js'
export type { ThemeName } from './styles/index.js'
export { compose, stripLayers, LAYER_DECL, COMPONENTS, MAIL_COMPONENTS } from './compose.js'
export type { ComponentName, ComposeOptions } from './compose.js'

export { showNotification, clearNotifications } from './notifications.js'
export type { NotificationMode, NotificationLevel, Notification } from './notifications.js'

export { mountThemeSwitcher, applyTheme } from './theme-switcher.js'
export type { ThemeSwitcher, ThemeSwitcherOptions } from './theme-switcher.js'
