import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mountThemeSwitcher, applyTheme } from './theme-switcher.js'
import { compose } from './compose.js'
import { themes } from './styles/index.js'

// The switcher is the only sure-ui export that writes to the document, so its
// tests own the DOM lifecycle and reset storage between cases.

describe('theme switcher', () => {
  beforeEach(() => {
    localStorage.clear()
    document.head.innerHTML = ''
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.getElementById('sure-ui-theme')?.remove()
  })

  it('offers every exported theme, in order', () => {
    const switcher = mountThemeSwitcher({ target: document.body })
    const options = Array.from(switcher.select.options).map((o) => o.value)
    expect(options).toEqual(Object.keys(themes))
    switcher.destroy()
  })

  it('applies the default theme immediately', () => {
    mountThemeSwitcher({ target: document.body, defaultTheme: 'forest' })
    const style = document.getElementById('sure-ui-theme')!
    expect(style.getAttribute('data-sure-theme')).toBe('forest')
    expect(style.textContent).toBe(compose({ theme: 'forest' }))
  })

  it('swaps the stylesheet when the selection changes and persists it', () => {
    const seen: string[] = []
    const switcher = mountThemeSwitcher({
      target: document.body,
      defaultTheme: 'nord',
      onChange: (theme) => seen.push(theme),
    })

    switcher.select.value = 'dracula'
    switcher.select.dispatchEvent(new Event('change'))

    expect(document.getElementById('sure-ui-theme')!.getAttribute('data-sure-theme')).toBe('dracula')
    expect(localStorage.getItem('sure-ui-theme')).toBe('dracula')
    expect(seen).toEqual(['nord', 'dracula'])
  })

  it('restores the stored theme on the next mount', () => {
    localStorage.setItem('sure-ui-theme', 'positronic')
    const switcher = mountThemeSwitcher({ target: document.body })
    expect(switcher.select.value).toBe('positronic')
    expect(document.getElementById('sure-ui-theme')!.getAttribute('data-sure-theme')).toBe('positronic')
  })

  it('ignores a stored theme that is no longer offered', () => {
    localStorage.setItem('sure-ui-theme', 'retired-theme')
    const switcher = mountThemeSwitcher({ target: document.body, defaultTheme: 'nord' })
    expect(switcher.select.value).toBe('nord')
    expect(switcher.select.options).toHaveLength(Object.keys(themes).length)
  })

  it('steps aside the bundled stylesheet only while a non-default theme is active', () => {
    document.head.innerHTML = '<link rel="stylesheet" href="/assets/theme.css">'
    const switcher = mountThemeSwitcher({ target: document.body, defaultTheme: 'nord' })
    const link = document.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')!

    expect(link.disabled, 'the bundled default needs no override').toBe(false)

    switcher.select.value = 'dark'
    switcher.select.dispatchEvent(new Event('change'))
    expect(link.disabled, 'two themes must not be layered over each other').toBe(true)

    switcher.apply('nord')
    expect(link.disabled).toBe(false)
  })

  it('leaves an unrelated stylesheet alone', () => {
    document.head.innerHTML = '<link rel="stylesheet" href="/assets/print.css">'
    mountThemeSwitcher({ target: document.body })
    expect(Boolean(document.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')!.disabled)).toBe(false)
  })

  it('can apply a theme without the control, and cleans up after itself', () => {
    applyTheme('forest', 'nord')
    expect(document.getElementById('sure-ui-theme')!.getAttribute('data-sure-theme')).toBe('forest')

    const switcher = mountThemeSwitcher({ target: document.body })
    expect(document.body.contains(switcher.element)).toBe(true)
    switcher.destroy()
    expect(document.body.contains(switcher.element)).toBe(false)
    expect(document.getElementById('sure-ui-theme')).toBeNull()
  })

  it('mounts into a fixed corner when no target is given', () => {
    const switcher = mountThemeSwitcher({ label: '' })
    expect(switcher.element.parentElement).toBe(document.body)
    expect(switcher.element.style.position).toBe('fixed')
    expect(switcher.element.querySelector('label')).toBeNull()
    switcher.destroy()
  })
})
