import { nord as nordCss } from './nord.js'
import { forest as forestCss } from './forest.js'
import { dracula as draculaCss } from './dracula.js'
import { dark as darkCss } from './dark.js'
import { positronic as positronicCss } from './positronic.js'
import { visionSystem as visionSystemCss } from './vision-system.js'
import { visionAtkinson as visionAtkinsonCss } from './vision-atkinson.js'
import { mobileLayer } from './mobile.js'

// Every theme ships the shared mobile & touch layer verbatim, appended
// last so it wins ties against the component rules above it. One wrap
// point instead of seven copies: the layer cannot drift between themes
// (index.test.ts asserts they are byte-identical).
const withMobile = (css: string): string => css + mobileLayer

export const nord = withMobile(nordCss)
export const forest = withMobile(forestCss)
export const dracula = withMobile(draculaCss)
export const dark = withMobile(darkCss)
export const positronic = withMobile(positronicCss)
export const visionSystem = withMobile(visionSystemCss)
export const visionAtkinson = withMobile(visionAtkinsonCss)

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
