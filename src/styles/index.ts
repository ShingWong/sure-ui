import { nord } from './nord'
import { forest } from './forest'
import { dracula } from './dracula'
import { dark } from './dark'

export { nord, forest, dracula, dark }
export const themes = { nord, forest, dracula, dark } as const
export type ThemeName = keyof typeof themes
