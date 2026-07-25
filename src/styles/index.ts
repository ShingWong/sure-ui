import { nord } from './nord'
import { forest } from './forest'
import { dracula } from './dracula'

export { nord, forest, dracula }
export const themes = { nord, forest, dracula } as const
export type ThemeName = keyof typeof themes
