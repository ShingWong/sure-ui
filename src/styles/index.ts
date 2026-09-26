import { nord } from './nord.js'
import { forest } from './forest.js'
import { dracula } from './dracula.js'
import { dark } from './dark.js'

export { nord, forest, dracula, dark }
export const themes = { nord, forest, dracula, dark } as const
export type ThemeName = keyof typeof themes
