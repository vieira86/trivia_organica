import { describe, expect, it } from 'vitest'
import { QUESTIONS, shuffleQuestionOptions, pickRandomQuestion } from './questions'

describe('QUESTIONS bank', () => {
  it('has unique ids', () => {
    const ids = QUESTIONS.map(q => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every question has exactly 4 options and a valid correct index', () => {
    QUESTIONS.forEach(q => {
      expect(q.options).toHaveLength(4)
      expect(q.correct).toBeGreaterThanOrEqual(0)
      expect(q.correct).toBeLessThan(4)
    })
  })

})

describe('shuffleQuestionOptions', () => {
  it('keeps the same set of options after shuffling', () => {
    const question = QUESTIONS[0]
    const { options } = shuffleQuestionOptions(question)
    expect([...options].sort()).toEqual([...question.options].sort())
  })

  it('correctIndex always points at the actual correct answer text', () => {
    const question = QUESTIONS[0]
    const { options, correctIndex } = shuffleQuestionOptions(question)
    expect(options[correctIndex]).toBe(question.options[question.correct])
  })

  it('does not always place the correct answer at the same displayed index (fixes the old "always option A" pattern)', () => {
    const question = QUESTIONS[0]
    const observedIndexes = new Set(
      Array.from({ length: 50 }, () => shuffleQuestionOptions(question).correctIndex)
    )
    expect(observedIndexes.size).toBeGreaterThan(1)
  })
})

describe('pickRandomQuestion', () => {
  it('avoids recently used questions when alternatives exist', () => {
    const recentIds = QUESTIONS.slice(0, -1).map(q => q.id)
    const picked = pickRandomQuestion(recentIds)
    expect(picked.id).toBe(QUESTIONS[QUESTIONS.length - 1].id)
  })

  it('falls back to the full pool once every question has been used recently', () => {
    const allIds = QUESTIONS.map(q => q.id)
    const picked = pickRandomQuestion(allIds)
    expect(allIds).toContain(picked.id)
  })
})
