import { describe, expect, it } from 'vitest'
import { initialJourney, journeyReducer, loadJourney } from './progress'

// Lingkungan test Node tidak punya localStorage; cukup stub di memori.
const memory = new Map<string, string>()
globalThis.localStorage = { getItem: k => memory.get(k) ?? null, setItem: (k, v) => void memory.set(k, v), removeItem: k => void memory.delete(k) } as Storage

describe('journey progress', () => {
  it('records each item only once', () => {
    const found = journeyReducer(initialJourney, { type: 'FIND', id: 'ticket' })
    expect(journeyReducer(found, { type: 'FIND', id: 'ticket' }).found).toEqual(['ticket'])
  })

  it('can move directly to the gift and reset everything', () => {
    const skipped = journeyReducer(initialJourney, { type: 'GO', scene: 'gift' })
    expect(skipped.scene).toBe('gift')
    expect(journeyReducer({ ...skipped, found: ['ticket'], giftOpened: true }, { type: 'RESET' })).toEqual(initialJourney)
  })

  it('remembers visited scenes once', () => {
    const once = journeyReducer(initialJourney, { type: 'GO', scene: 'hub' })
    const twice = journeyReducer(journeyReducer(once, { type: 'GO', scene: 'gallery' }), { type: 'GO', scene: 'hub' })
    expect(twice.visited).toEqual(['hub', 'gallery'])
  })

  it('ignores corrupted storage', () => {
    localStorage.setItem('picuy-birthday-progress-v1', '{"scene":"nowhere","found":[1,"cake"],"giftOpened":"yes"}')
    expect(loadJourney()).toEqual({ ...initialJourney, found: ['cake'] })
    localStorage.setItem('picuy-birthday-progress-v1', 'not json')
    expect(loadJourney()).toEqual(initialJourney)
  })
})
