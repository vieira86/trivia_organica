import { describe, expect, it } from 'vitest'
import { resolveMove, updatePlayer, applyHazardEffect, POINTS_PER_HOUSE } from './gameLogic'
import { BOARD_SIZE } from '../data/boardPath'

describe('resolveMove', () => {
  it('moves normally and awards dice*10 points', () => {
    const result = resolveMove(0, 3)
    expect(result.position).toBe(3)
    expect(result.points).toBe(3 * POINTS_PER_HOUSE)
    expect(result.won).toBe(false)
  })

  it('caps the final position at BOARD_SIZE when overshooting past the end', () => {
    const result = resolveMove(47, 6) // 53, capped
    expect(result.position).toBe(BOARD_SIZE)
    expect(result.won).toBe(true)
  })

  it('marks won when landing exactly on the last cell', () => {
    const result = resolveMove(44, 6) // exactly 50
    expect(result.position).toBe(BOARD_SIZE)
    expect(result.won).toBe(true)
  })
})

describe('updatePlayer', () => {
  const players = [
    { id: 1, name: 'A', position: 0, score: 0, finished: false },
    { id: 2, name: 'B', position: 0, score: 0, finished: false }
  ]

  it('updates only the targeted player, leaving others untouched', () => {
    const result = updatePlayer(players, 0, { position: 5, scoreDelta: 30 })
    expect(result[0]).toMatchObject({ position: 5, score: 30 })
    expect(result[1]).toEqual(players[1])
  })

  it('sets finished when provided', () => {
    const result = updatePlayer(players, 1, { position: 50, scoreDelta: 10, finished: true })
    expect(result[1].finished).toBe(true)
  })

  it('leaves finished untouched when not provided', () => {
    const result = updatePlayer(players, 0, { position: 5, scoreDelta: 10 })
    expect(result[0].finished).toBe(false)
  })
})

describe('applyHazardEffect', () => {
  it('moves back by the hazard amount for a "back" hazard', () => {
    const hazard = { effect: 'back', amount: 3 }
    expect(applyHazardEffect(20, hazard)).toBe(17)
  })

  it('never goes below zero for a "back" hazard', () => {
    const hazard = { effect: 'back', amount: 5 }
    expect(applyHazardEffect(2, hazard)).toBe(0)
  })

  it('sends the player back to the start for a "start" hazard', () => {
    const hazard = { effect: 'start' }
    expect(applyHazardEffect(30, hazard)).toBe(0)
  })
})
