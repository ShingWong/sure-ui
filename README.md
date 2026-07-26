# sure-ui

**Runtime UI library for sure-factor generated interfaces.** Three preset themes (Nord, Forest, Dracula) matching sure-factor's semantic class conventions, plus a notification system with four display modes. Drop in a theme, call `showNotification`, and go.

```ts
import { nord } from 'sure-ui'

const style = document.createElement('style')
style.textContent = nord
document.head.appendChild(style)
```

### Why sure-ui?

| Problem | How sure-ui solves it |
|---------|--------------------------|
| **Generated code has no styles** | sure-factor generates semantic HTML (`.sure-form`, `.sure-table`, `.sure-crud`). sure-ui provides production CSS for all of them — no design work needed. |
| **Hopping between UI libraries** | Three cohesive themes (cool professional, warm organic, dark modern). Switch by changing one import. |
| **Scattered notification patterns** | Four modes from one function: `inline` (field-level), `toast` (pop-up), `statusBar` (banner), `sidePanel` (error list). Consistent API, consistent styling. |
| **Accessibility afterthought** | Themes include focus rings (`:focus-visible`), `aria-invalid` styling, semantic color contrast, and proper `font-size` units. |
| **Theme lock-in** | Themes are plain CSS strings — inject at runtime, swap without rebuilding. No CSS-in-JS, no bundler config, no framework dependency. |

### How it compares

| | sure-ui | Tailwind UI | shadcn/ui | Bootstrap |
|---|---|---|---|---|
| Generated code ready | ✅ `.sure-form`, `.sure-table`, etc. | ❌ Custom classes needed | ❌ Custom components | ❌ |
| Preset themes | ✅ 3 (Nord, Forest, Dracula) | ✅ Unlimited (custom) | ⚠️ Single (copy-to-project) | ✅ 5 built-in |
| Theme injection | ✅ CSS string, runtime swap | ❌ Build-time only | ⚠️ CSS variables | ⚠️ SASS vars |
| Notification modes | ✅ inline, toast, statusBar, sidePanel | ❌ | ⚠️ Sonner (toast only) | ⚠️ Toast only |
| Bundle size | ~4 KB CSS + ~2 KB JS | ~300 KB CSS | ~40 KB per component | ~150 KB CSS + JS |
| Framework | Agnostic (CSS strings) | Tailwind | React | Agnostic |
| Peer dependencies | None | Tailwind | React | None |

## Installation

```bash
npm install sure-ui
```

Zero peer dependencies. Works with any framework (React, Vue, Svelte, vanilla JS).

## Themes

Three preset themes matching sure-factor's BEM-style generated classes.

```ts
import { nord, forest, dracula, themes } from 'sure-ui'
import type { ThemeName } from 'sure-ui'

// Inject a theme at runtime:
const style = document.createElement('style')
style.textContent = nord
document.head.appendChild(style)

// Or swap themes dynamically:
function setTheme(name: ThemeName) {
  document.querySelector(':root')!.classList.remove('theme-nord', 'theme-forest', 'theme-dracula')
  document.querySelector(':root')!.classList.add(`theme-${name}`)
}

// Each theme is available individually or via the themes map:
console.log(themes.nord === nord)   // true
console.log(Object.keys(themes))    // ['nord', 'forest', 'dracula']
```

### Theme Palettes

| Theme | Background | Accent | Vibe | Best for |
|-------|-----------|--------|------|----------|
| **Nord** | Light cool (#eceff4) | Blue (#5e81ac) | Clean, professional | Dashboards, admin panels |
| **Forest** | Warm cream (#f4f1ea) | Green (#3d6b3c) | Earthy, organic | Content sites, SaaS |
| **Dracula** | Dark (#282a36) | Purple (#bd93f9) | Modern, dark mode | Developer tools, terminals |

### Styled Components

Each theme provides CSS for these semantic class conventions (matching sure-factor output):

| Component | Class prefix | Elements |
|-----------|-------------|----------|
| Form | `.sure-form` | `__field`, `__label`, `input/select/textarea`, `__error`, `__help` |
| Modal | `.sure-modal__form` | `__field`, `__label`, `input/select/textarea`, `__error`, `__help` |
| Table | `.sure-table` | `__header`, `__cell`, `__error`, `__help` |
| CRUD | `.sure-crud` | `__field`, `__label`, `__error`, `__help` |
| Search | `.sure-search` | `__input`, `__label`, `__error`, `__help` |
| Buttons | `.btn-primary` | Accent background, hover, focus ring |
| Buttons | `.btn-secondary` | Ghost style with border |

Plus form states: `input:focus`, `[aria-invalid="true"]`, `input:disabled`.

## Notifications

Four notification modes in one consistent API. Levels: `error`, `success`, `info`.

```ts
import { showNotification, clearNotifications } from 'sure-ui'

// Inline — field-level error, appended to the field container
showNotification({ id: '1', message: 'Required', level: 'error', mode: 'inline', field: 'email' })

// Toast — top-right popup, auto-dismiss
showNotification({ id: '2', message: 'Saved!', level: 'success', mode: 'toast' })

// Status bar — top banner, auto-dismiss
showNotification({ id: '3', message: 'Server error', level: 'error', mode: 'statusBar' })

// Side panel — right-side error list, click to scroll to field
showNotification({ id: '4', message: 'Email is invalid', level: 'error', mode: 'sidePanel', field: 'email' })
```

### Notification API

```ts
showNotification({
  id: string                      // unique identifier
  message: string                 // display text
  level: 'error' | 'success' | 'info'
  mode: 'inline' | 'toast' | 'statusBar' | 'sidePanel'
  field?: string                  // scroll target (inline/toast/sidePanel)
  duration?: number               // auto-dismiss ms (default: 4000)
})

clearNotifications(mode?)         // remove all, or filter by mode
```

### Notification behavior

| Mode | Position | Auto-dismiss | Click action |
|------|----------|-------------|--------------|
| `inline` | Inside field container | No | — |
| `toast` | Top-right fixed | Yes (4s) | Scrolls to field |
| `statusBar` | Top of page (banner) | Yes (4s) | — |
| `sidePanel` | Right-side panel | No | Scrolls to field |

## Architecture

```
┌──────────────────────────────────────────────┐
│  sure-ui                                      │
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Themes      │  │   Notifications      │  │
│  │  ┌──────────┐ │  │  ┌────────────────┐ │  │
│  │  │ Nord     │ │  │  │ inline         │ │  │
│  │  │ Forest   │ │  │  │ toast          │ │  │
│  │  │ Dracula  │ │  │  │ statusBar      │ │  │
│  │  └──────────┘ │  │  │ sidePanel      │ │  │
│  │  ~4 KB CSS    │  │  └────────────────┘ │  │
│  └──────────────┘  │  │ ~2 KB JS (runtime)│  │
│                   │  └────────────────────┘  │
│                   │                          │
│  Output: CSS       │  Output: DOM elements    │
│  strings           │  with BEM classes        │
└─────────┬──────────┴────────────┬─────────────┘
          │                       │
          │   sure-factor generated HTML
          ▼                       ▼
    <style>.sure-form…</style>   <div class="toast">
```

## Usage with sure-factor

sure-ui is designed to pair with [sure-factor](https://github.com/ShingWong/sure-factor). The generated code uses class conventions that sure-ui themes style out of the box.

```ts
import { generateForm } from 'sure-factor'
import { nord } from 'sure-ui'
import { showNotification } from 'sure-ui'

// Inject theme
const style = document.createElement('style')
style.textContent = nord
document.head.appendChild(style)

// Generate form HTML (from sure-factor)
const html = generateForm({ /* field configs */ })
document.body.innerHTML = html

// Wire up notifications
document.querySelector('form')?.addEventListener('submit', async (e) => {
  e.preventDefault()
  try {
    await api.submit(formData)
    showNotification({ id: 'save', message: 'Saved!', level: 'success', mode: 'toast' })
  } catch (err) {
    showNotification({ id: 'err', message: err.message, level: 'error', mode: 'inline', field: 'email' })
  }
})
```

## Agent usage

AI coding assistants can use sure-ui to theme generated interfaces:

```ts
// Prompt: "Theme this sure-factor form with the Dracula theme"
import { dracula } from 'sure-ui'
const style = document.createElement('style')
style.textContent = dracula
document.head.appendChild(style)

// Prompt: "Add toast notifications on form submit"
import { showNotification } from 'sure-ui'

form.addEventListener('submit', async () => {
  showNotification({ id: 'ok', message: 'Success', level: 'success', mode: 'toast' })
})
```

### Auth Forms

Login, register, and password-reset forms using `.sure-auth__*` CSS classes. Styled consistently across all three themes:

```html
<form class="sure-auth__form">
  <div class="sure-auth__header">
    <h1>Sign In</h1>
  </div>
  <div class="sure-auth__field">
    <label class="sure-auth__label">Email</label>
    <input class="sure-auth__input" type="email">
  </div>
  <div class="sure-auth__field">
    <label class="sure-auth__label">Password</label>
    <input class="sure-auth__input" type="password">
  </div>
  <button class="sure-auth__btn">Sign In</button>
  <div class="sure-auth__divider">or continue with</div>
  <button class="sure-auth__btn--social">Sign in with Google</button>
  <div class="sure-auth__footer">
    <a href="#">Create an account</a>
  </div>
</form>
```

| Class | Purpose |
|-------|---------|
| `.sure-auth__form` | Form container |
| `.sure-auth__input` | Text/password/email input |
| `.sure-auth__input--error` | Input with validation error |
| `.sure-auth__btn` | Primary submit button |
| `.sure-auth__btn--social` | OAuth provider button |
| `.sure-auth__divider` | "or" separator with line |
| `.sure-auth__error` | Error message text |
| `.sure-auth__alert` | Info/success/error banner |

## Development

```bash
git clone git@github.com:ShingWong/sure-ui.git
cd sure-ui
npm install
npm run build
npm test                       # 13 tests
npm run lint                   # tsc --noEmit
```
