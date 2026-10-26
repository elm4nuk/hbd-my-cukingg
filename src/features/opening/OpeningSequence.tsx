import { useState } from 'react'
import { audioService } from '../../lib/audio'
import { BoardingScreen } from './BoardingScreen'
import { JourneyAnimation } from './JourneyAnimation'

export type OpeningSequenceProps = {
  reducedMotion: boolean
  /** Dipanggil saat opening selesai atau dilewati → App pindah ke hub. */
  onComplete: () => void
}

/** Boarding (tombol mulai) → animasi perjalanan → hub. Audio hanya dimulai dari klik pengguna. */
export function OpeningSequence({ reducedMotion, onComplete }: OpeningSequenceProps) {
  const [phase, setPhase] = useState<'boarding' | 'journey'>('boarding')
  const start = () => {
    audioService.unlock()
    audioService.playSfx('click')
    setPhase('journey')
  }
  const skip = () => {
    audioService.unlock()
    onComplete()
  }
  return phase === 'boarding'
    ? <BoardingScreen onStart={start} onSkip={skip} />
    : <JourneyAnimation reducedMotion={reducedMotion} onDone={onComplete} />
}
