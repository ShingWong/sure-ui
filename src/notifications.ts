export type NotificationMode = 'inline' | 'toast' | 'statusBar' | 'sidePanel'
export type NotificationLevel = 'error' | 'success' | 'info'

export interface Notification {
  id: string
  message: string
  level: NotificationLevel
  mode: NotificationMode
  field?: string
  duration?: number
}

let toastContainer: HTMLElement | null = null
let statusBarEl: HTMLElement | null = null
let sidePanelEl: HTMLElement | null = null
let toastTimer: ReturnType<typeof setTimeout> | null = null

function ensureContainer(mode: NotificationMode): HTMLElement {
  if (mode === 'toast') {
    if (!toastContainer) {
      toastContainer = document.createElement('div')
      toastContainer.style.cssText = 'position:fixed;top:1rem;right:1rem;z-index:1000;display:flex;flex-direction:column;gap:0.5rem;'
      document.body.appendChild(toastContainer)
    }
    return toastContainer
  }
  if (mode === 'statusBar') {
    if (!statusBarEl) {
      statusBarEl = document.createElement('div')
      document.body.prepend(statusBarEl)
    }
    return statusBarEl
  }
  if (mode === 'sidePanel') {
    if (!sidePanelEl) {
      sidePanelEl = document.createElement('div')
      sidePanelEl.className = 'side-panel'
      const title = document.createElement('div')
      title.className = 'side-panel__title'
      title.textContent = 'Errors'
      sidePanelEl.appendChild(title)
      document.body.appendChild(sidePanelEl)
    }
    return sidePanelEl
  }
  throw new Error(`Unknown notification mode: ${mode}`)
}

function scrollToField(fieldName: string): void {
  const el = document.querySelector(`[name="${fieldName}"], #${fieldName}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export function showNotification(n: Notification): void {
  const { mode, message, level, field, duration = 4000 } = n

  if (mode === 'inline') {
    if (!field) return
    const fieldEl = document.querySelector(`[name="${field}"], #${field}`)
    if (!fieldEl) return
    const parent = fieldEl.closest('.field, [class*="__field"]') ?? fieldEl.parentElement
    if (!parent) return
    const existing = parent.querySelector('.field-error, [class*="__error"]')
    if (existing) {
      existing.textContent = message
      return
    }
    const err = document.createElement('span')
    err.className = 'field-error'
    err.textContent = message
    parent.appendChild(err)
    return
  }

  const container = ensureContainer(mode)

  if (mode === 'toast') {
    const el = document.createElement('div')
    el.className = `toast toast--${level}`
    el.textContent = message
    if (field) {
      el.style.cursor = 'pointer'
      el.addEventListener('click', () => scrollToField(field))
    }
    container.appendChild(el)
    setTimeout(() => { el.remove() }, duration)
    return
  }

  if (mode === 'statusBar') {
    container.className = `status-bar status-bar--${level}`
    container.textContent = message
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => { container.textContent = ''; container.className = '' }, duration)
    return
  }

  if (mode === 'sidePanel') {
    const item = document.createElement('div')
    item.className = 'side-panel__item'
    item.textContent = message
    if (field) {
      item.addEventListener('click', () => scrollToField(field))
    }
    container.appendChild(item)
    return
  }
}

export function clearNotifications(mode?: NotificationMode): void {
  if (!mode || mode === 'toast') {
    toastContainer?.remove()
    toastContainer = null
  }
  if (!mode || mode === 'statusBar') {
    statusBarEl?.remove()
    statusBarEl = null
  }
  if (!mode || mode === 'sidePanel') {
    sidePanelEl?.remove()
    sidePanelEl = null
  }
}
