import { nord } from './nord.js'
import { forest } from './forest.js'
import { dracula } from './dracula.js'
import { dark } from './dark.js'
import { positronic } from './positronic.js'
import { visionSystem } from './vision-system.js'
import { visionAtkinson } from './vision-atkinson.js'

export { nord, forest, dracula, dark, positronic, visionSystem, visionAtkinson }
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
