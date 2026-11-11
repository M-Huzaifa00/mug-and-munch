import type { Category } from '@/data/menu'

/** DOM ids shared by the menu page, its category sections and the scroll-spy nav. */
export const sectionId = (c: Category) => `cat-${c}`
export const MENU_TOP_ID = 'menu-top'
/** Scroll offset when jumping to a category (clears the navbar + sticky chips). */
export const JUMP_OFFSET = -150
/** Link to one category on the menu page, e.g. /menu#cat-burger (Menu scrolls there after load). */
export const menuCategoryHref = (c: Category) => `/menu#${sectionId(c)}`
