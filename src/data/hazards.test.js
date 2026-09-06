import { describe, expect, it } from 'vitest'
import { HAZARDS, generateHazardLayout, getHazard } from './hazards'

describe('generateHazardLayout', () => {
  it('places every hazard type exactly once, on distinct cells', () => {
    const layout = generateHazardLayout(50)
    const cells = Object.keys(layout).map(Number)
    expect(cells.length).toBe(HAZARDS.length)
    expect(new Set(cells).size).toBe(cells.length)
  })

  it('keeps hazards within the board bounds', () => {
    const layout = generateHazardLayout(50)
    Object.keys(layout).map(Number).forEach(cell => {
      expect(cell).toBeGreaterThanOrEqual(1)
      expect(cell).toBeLessThanOrEqual(50)
    })
  })

  it('produces different layouts across calls (very unlikely to collide every time)', () => {
    const layouts = Array.from({ length: 10 }, () => JSON.stringify(generateHazardLayout(50)))
    expect(new Set(layouts).size).toBeGreaterThan(1)
  })
})

describe('getHazard', () => {
  it('returns the matching hazard by id', () => {
    expect(getHazard('radioativo')?.effect).toBe('start')
  })

  it('returns null for an unknown or missing id', () => {
    expect(getHazard('inexistente')).toBeNull()
    expect(getHazard(undefined)).toBeNull()
  })
})
