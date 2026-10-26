import { scenes, type SceneId } from '../config/birthday'

export type JourneyState = {
  scene: SceneId
  /** Scene yang pernah dibuka — dipakai hub untuk tanda ✓. */
  visited: SceneId[]
  found: string[]
  giftOpened: boolean
  wishMade: boolean
}

export const initialJourney: JourneyState = {
  scene: 'opening',
  visited: [],
  found: [],
  giftOpened: false,
  wishMade: false,
}

export type JourneyAction =
  | { type: 'GO'; scene: SceneId }
  | { type: 'FIND'; id: string }
  | { type: 'OPEN_GIFT' }
  | { type: 'MAKE_WISH' }
  | { type: 'RESET' }

export function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case 'GO': return { ...state, scene: action.scene, visited: state.visited.includes(action.scene) ? state.visited : [...state.visited, action.scene] }
    case 'FIND': return state.found.includes(action.id) ? state : { ...state, found: [...state.found, action.id] }
    case 'OPEN_GIFT': return { ...state, giftOpened: true }
    case 'MAKE_WISH': return { ...state, wishMade: true }
    case 'RESET': return initialJourney
  }
}

const key = 'picuy-birthday-progress-v1'
const isScene = (value: unknown): value is SceneId => scenes.some(scene => scene.id === value)
const strings = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

export function loadJourney(): JourneyState {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return initialJourney
    const saved = JSON.parse(raw) as Partial<Record<keyof JourneyState, unknown>>
    return {
      scene: isScene(saved.scene) ? saved.scene : 'opening',
      visited: strings(saved.visited).filter(isScene),
      found: strings(saved.found),
      giftOpened: saved.giftOpened === true,
      wishMade: saved.wishMade === true,
    }
  } catch {
    return initialJourney
  }
}

export function saveJourney(state: JourneyState) {
  try { localStorage.setItem(key, JSON.stringify(state)) } catch { /* Storage is optional. */ }
}

export function clearJourney() {
  try { localStorage.removeItem(key) } catch { /* Storage is optional. */ }
}
