import { describe, it, expect } from 'vitest'
import { compose, COMPONENTS, themes } from './index.js'

/**
 * The settings family is the reusable dialog/section/nav contract sure-mail's
 * Settings composes. It is opt-in (like the mail families) and shares one set
 * of class names across every theme, so a skin may re-lay the boxes but never
 * has to invent a control.
 */
const CLASSES = [
  '.sure-settings {',
  '.sure-settings__nav',
  '.sure-settings__tab {',
  '.sure-settings__tab:hover',
  '.sure-settings__tab[aria-selected="true"]',
  '.sure-settings__tab.active',
  '.sure-settings__body',
  '.sure-settings__panel {',
  '.sure-settings__panel[hidden]',
  '.sure-settings__list',
  '.sure-settings__actions',
  '.sure-settings__status',
  '.sure-settings__result',
]

describe('settings: one class contract for every theme', () => {
  it('is an opt-in component in the catalog', () => {
    expect(COMPONENTS).toContain('settings')
  })

  for (const [name] of Object.entries(themes)) {
    it(`${name} styles every settings class the catalog can emit`, () => {
      const css = compose({ theme: name, components: ['settings'] })
      const missing = CLASSES.filter((c) => !css.includes(c))
      expect(missing, `${name} is missing: ${missing.join(', ')}`).toEqual([])
    })
  }

  it('default all output is untouched', () => {
    const all = compose({ theme: 'nord', components: 'all' })
    expect(all).not.toContain('.sure-settings__tab')
  })
})
