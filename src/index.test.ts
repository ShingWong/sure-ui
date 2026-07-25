import { describe, it, expect } from 'vitest'
import { VERSION, nord, forest, dracula, themes, showNotification, clearNotifications } from './index'

describe('sure-ui', () => {
  it('exports VERSION', () => {
    expect(VERSION).toBe('0.1.0')
  })

  it('exports all three themes', () => {
    expect(nord).toBeTruthy()
    expect(forest).toBeTruthy()
    expect(dracula).toBeTruthy()
  })

  it('themes object contains all themes', () => {
    expect(themes.nord).toBe(nord)
    expect(themes.forest).toBe(forest)
    expect(themes.dracula).toBe(dracula)
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
