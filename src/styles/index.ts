// The public theme strings are compose() output — tokens + every component
// run + the mobile layer, byte-identical to the 0.1.9 monolithic strings
// (equivalence asserted in index.test.ts against the frozen fixture). The
// per-theme source files were retired by scripts/split-themes.mjs; the
// generated data under src/generated/ is now the source of truth until the
// shared component blocks land (0.2.0b).
import { compose } from '../compose.js'

export { compose } from '../compose.js'

export const nord = compose({ theme: 'nord' })
export const forest = compose({ theme: 'forest' })
export const dracula = compose({ theme: 'dracula' })
export const dark = compose({ theme: 'dark' })
export const positronic = compose({ theme: 'positronic' })
export const visionSystem = compose({ theme: 'vision-system' })
export const visionAtkinson = compose({ theme: 'vision-atkinson' })

export { mobileLayer } from './mobile.js'

export const themes = {
  nord,
  forest,
  dracula,
  dark,
  positronic,
  'vision-system': visionSystem,
  'vision-atkinson': visionAtkinson,
} as const
export type ThemeName = keyof typeof themes
