import { Howl, Howler } from 'howler'
import { useSyncExternalStore } from 'react'
import { birthdayConfig, type SfxName } from '../config/birthday'

// Nada sintetis dipakai bila file audio lokal belum tersedia (lihat birthdayConfig.audio).
// Hasilnya WAV mono 8 kHz sebagai data URI — tanpa hotlink, tanpa file tambahan.
function makeToneDataUri(notes: number[], noteSeconds: number, loops = 1, gain = 2200) {
  const rate = 8000
  const duration = notes.length * noteSeconds * loops
  const samples = Math.floor(rate * duration)
  const buffer = new ArrayBuffer(44 + samples * 2)
  const view = new DataView(buffer)
  const write = (offset: number, value: string) => [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)))
  write(0, 'RIFF'); view.setUint32(4, 36 + samples * 2, true); write(8, 'WAVEfmt ')
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true)
  view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true)
  write(36, 'data'); view.setUint32(40, samples * 2, true)
  for (let i = 0; i < samples; i++) {
    const t = i / rate
    const local = t % noteSeconds
    const note = notes[Math.floor(t / noteSeconds) % notes.length]
    const envelope = Math.min(1, local / 0.012) * Math.max(0, 1 - local / noteSeconds)
    view.setInt16(44 + i * 2, note ? Math.sin(2 * Math.PI * note * t) * envelope * gain : 0, true)
  }
  let binary = ''
  new Uint8Array(buffer).forEach(byte => { binary += String.fromCharCode(byte) })
  return `data:audio/wav;base64,${btoa(binary)}`
}

const synth: Record<'bgm' | SfxName, () => string> = {
  bgm: () => makeToneDataUri([261.63, 329.63, 392, 523.25], 0.6),
  click: () => makeToneDataUri([880], 0.08, 1, 1600),
  ticket: () => makeToneDataUri([523.25, 783.99], 0.12, 1, 2000),
  whistle: () => makeToneDataUri([987.77, 0, 987.77, 1174.66], 0.18, 1, 1500),
  reveal: () => makeToneDataUri([523.25, 659.25, 783.99, 1046.5], 0.11, 1, 2000),
}

export type AudioState = {
  /** Preferensi pengguna: suara boleh berbunyi. Disimpan di localStorage. */
  enabled: boolean
  volume: number
  /** true setelah ada gesture pengguna (klik/tap) — sebelum itu tidak ada bunyi sama sekali. */
  unlocked: boolean
}

const prefsKey = 'picuy-birthday-sound-v1'

function loadPrefs(): Pick<AudioState, 'enabled' | 'volume'> {
  try {
    const saved = JSON.parse(localStorage.getItem(prefsKey) ?? '{}') as Partial<AudioState>
    return {
      enabled: typeof saved.enabled === 'boolean' ? saved.enabled : true,
      volume: typeof saved.volume === 'number' && saved.volume >= 0 && saved.volume <= 1 ? saved.volume : 0.35,
    }
  } catch {
    return { enabled: true, volume: 0.35 }
  }
}

class AudioService {
  private state: AudioState = { ...loadPrefs(), unlocked: false }
  private listeners = new Set<() => void>()
  private bgm: Howl | null = null
  private sfx = new Map<SfxName, Howl>()

  getState = () => this.state
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }

  private set(patch: Partial<AudioState>) {
    this.state = { ...this.state, ...patch }
    try { localStorage.setItem(prefsKey, JSON.stringify({ enabled: this.state.enabled, volume: this.state.volume })) } catch { /* Storage is optional. */ }
    this.listeners.forEach(listener => listener())
  }

  // File lokal dicoba dulu; bila gagal dimuat, otomatis jatuh ke nada sintetis. Tidak pernah melempar error.
  private makeHowl(sources: readonly string[], fallback: () => string, loop: boolean, sprite?: Record<string, [number, number, boolean]>) {
    const howl = new Howl({ src: sources.length ? [...sources] : [fallback()], loop, volume: loop ? 1 : 0.7, html5: false, sprite: sources.length ? sprite : undefined })
    if (sources.length) howl.once('loaderror', () => {
      const replacement = new Howl({ src: [fallback()], loop, volume: loop ? 1 : 0.7 })
      if (loop) { this.bgm = replacement; this.bgmId = undefined; this.bgmSprite = undefined; this.playBgm() }
    })
    return howl
  }

  private bgmId: number | undefined
  private bgmSprite: string | undefined

  // Satu instance suara bgm: play pertama memakai sprite reff (loop sample-accurate via Web Audio),
  // berikutnya melanjutkan id yang sama setelah pause. Fade-in pendek supaya tidak mengagetkan.
  private playBgm() {
    const bgm = this.bgm
    if (!bgm || !this.canPlay() || bgm.playing()) return
    this.bgmId = this.bgmId !== undefined ? bgm.play(this.bgmId) : bgm.play(this.bgmSprite)
    bgm.fade(0, 1, 900, this.bgmId)
  }

  private canPlay() { return this.state.enabled && this.state.unlocked && !document.hidden }

  /** Panggil dari handler klik/tap. Menandai gesture dan memulai musik bila diizinkan. */
  unlock() {
    if (!this.state.unlocked) {
      Howler.volume(this.state.volume)
      this.set({ unlocked: true })
    }
    this.startMusic()
  }

  startMusic() {
    if (!this.canPlay()) return
    if (!this.bgm) {
      const { bgm, bgmLoop } = birthdayConfig.audio
      const sprite = bgmLoop ? { reff: [bgmLoop.start * 1000, (bgmLoop.end - bgmLoop.start) * 1000, true] as [number, number, boolean] } : undefined
      this.bgmSprite = sprite && bgm.length ? 'reff' : undefined
      this.bgm = this.makeHowl(bgm, synth.bgm, true, sprite)
    }
    this.playBgm()
  }

  playSfx(name: SfxName) {
    if (!this.canPlay()) return
    let howl = this.sfx.get(name)
    if (!howl) { howl = this.makeHowl(birthdayConfig.audio.sfx[name], synth[name], false); this.sfx.set(name, howl) }
    howl.play()
  }

  setEnabled(enabled: boolean) {
    this.set({ enabled })
    if (enabled) this.unlock()
    else this.bgm?.pause()
  }

  toggle() { this.setEnabled(!this.state.enabled); return this.state.enabled }

  setVolume(volume: number) {
    Howler.volume(volume)
    this.set({ volume })
  }

  pause() { this.bgm?.pause() }
  resume() { this.playBgm() }
  destroy() { this.bgm?.unload(); this.bgm = null; this.bgmId = undefined; this.sfx.forEach(howl => howl.unload()); this.sfx.clear() }
}

export const audioService = new AudioService()

/** Hook React untuk membaca status audio (re-render saat berubah). */
export function useAudioState() {
  return useSyncExternalStore(audioService.subscribe, audioService.getState)
}
