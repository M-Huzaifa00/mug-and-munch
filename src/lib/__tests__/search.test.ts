import { describe, expect, it } from 'vitest'
import { menu } from '@/data/menu'
import { filterMenu } from '@/lib/menuFilter'

const real = menu.filter((i) => !i.id.startsWith('test-'))
const names = (q: string) => filterMenu(q, new Set(), real).map((i) => i.name)

describe('menu search: local words', () => {
  it('"chai" finds the teas', () => {
    expect(names('chai')).toEqual(expect.arrayContaining(['Tea / Chai', 'Green Tea', 'Peach Iced Tea']))
  })
  it('"thanda" finds cold drinks and the cold-able lattes', () => {
    const r = names('thanda')
    expect(r).toEqual(expect.arrayContaining(['Blue Mint Mojito', 'Spanish Latte', 'Classic Matcha']))
    expect(r).not.toContain('Munch Smash')
  })
  it('"meetha" finds sweet coffees, "teekha" finds spicy items, "burgur" finds burgers', () => {
    expect(names('meetha')).toEqual(expect.arrayContaining(['Spanish Latte', 'Tiramisu Latte']))
    expect(names('teekha')).toEqual(expect.arrayContaining(['Munch Hellfire', 'Jalapeño Jolt']))
    expect(names('burgur').length).toBeGreaterThan(0)
  })
  it('plain names still work as before', () => {
    expect(names('Mocha')).toContain('Mocha')
    expect(names('spanish')).toEqual(['Spanish Latte'])
  })
})
