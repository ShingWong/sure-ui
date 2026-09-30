// Derived from package.json rather than hardcoded, so it cannot drift out of
// sync on a version bump. A literal here previously broke the test suite on
// every release until someone remembered to edit it by hand.
export const VERSION: string = (await import('../package.json', { with: { type: 'json' } })).default.version

export { nord, forest, dracula, dark, themes } from './styles/index.js'
export type { ThemeName } from './styles/index.js'

export { showNotification, clearNotifications } from './notifications.js'
export type { NotificationMode, NotificationLevel, Notification } from './notifications.js'
