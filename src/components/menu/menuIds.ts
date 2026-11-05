import type { Category } from '@/data/menu'

/** DOM ids shared by the menu page, its category sections and the scroll-spy nav. */
export const sectionId = (c: Category) => `cat-${c}`
export const MENU_TOP_ID = 'menu-top'
