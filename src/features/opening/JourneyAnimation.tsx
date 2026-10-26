import { useEffect, useMemo, useRef, useState } from 'react'
import anime from 'animejs'
import { birthdayConfig } from '../../config/birthday'
import { audioService } from '../../lib/audio'
import { AssetFallback } from '../../components/AssetFallback'
import { DialogueBox } from '../../components/DialogueBox'
import { PixelButton } from '../../components/PixelButton'
import { BoardingPass } from './BoardingPass'
import { PixelTrain } from './PixelTrain'

export type JourneyAnimationProps = {
  reducedMotion: boolean
  /** Dipanggil sekali: saat animasi selesai, saat dilewati, atau dari tombol di mode reduced motion. */
  onDone: () => void
}

/** Total durasi timeline ≈ 8,8 detik. */
const SAFETY_TIMEOUT = 12000

// Bintang pixel dengan posisi deterministik (tidak berubah tiap render).
function makeStars(count: number) {
  let seed = 7
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  return Array.from({ length: count }, () => ({ left: rand() * 100, top: rand() * 62, size: rand() > 0.85 ? 4 : 2, tone: rand() > 0.8 ? 'pink' : rand() > 0.6 ? 'lavender' : 'cream' }))
}

export function JourneyAnimation({ reducedMotion, onDone }: JourneyAnimationProps) {
  const rootRef = useRef<HTMLElement>(null)
  const doneRef = useRef(false)
  const [caption, setCaption] = useState('Malam ini ada satu penumpang spesial…')
  const [arrived, setArrived] = useState(reducedMotion)
  const stars = useMemo(() => makeStars(48), [])
  const { nickname, dialogue, assets } = birthdayConfig

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    onDone()
  }

  useEffect(() => {
    const root = rootRef.current
    if (reducedMotion || !root) return
    const q = (selector: string) => root.querySelectorAll(selector)
    const stage = root.querySelector<HTMLElement>('.journey-track')
    const train = root.querySelector<HTMLElement>('.journey-train')

    const timeline = anime.timeline({ easing: 'easeOutQuad', complete: () => window.setTimeout(finish, 900) })
      .add({ targets: q('.px-star'), opacity: [0, 1], scale: [0, 1], duration: 500, delay: anime.stagger(22) })
      .add({ targets: q('.journey-ticket'), opacity: [0, 1], translateY: [140, 0], rotate: [-8, -2], duration: 900, easing: 'easeOutBack', begin: () => setCaption(`Tiket atas nama ${nickname} sudah dicetak.`) }, 1100)
      .add({ targets: q('.ticket-stamp'), opacity: [0, 1], scale: [2.6, 1], rotate: [-20, -12], duration: 320, easing: 'easeInQuad', begin: () => audioService.playSfx('ticket') }, 2400)
      .add({ targets: q('.journey-ticket'), opacity: 0, translateY: -60, scale: 0.7, duration: 600, easing: 'easeInQuad' }, 3500)
      .add({
        targets: train,
        translateX: [() => -(train?.offsetWidth ?? 600) - 40, () => ((stage?.offsetWidth ?? 800) - (train?.offsetWidth ?? 600)) / 2],
        duration: 2700,
        easing: 'easeOutCubic',
        begin: () => { train?.classList.add('is-moving'); audioService.playSfx('whistle'); setCaption('Birthday Express melaju menembus bintang…') },
        complete: () => train?.classList.remove('is-moving'),
      }, 3700)
      .add({ targets: q('.journey-sky'), translateX: [0, -50], duration: 2700, easing: 'easeOutCubic' }, 3700)
      .add({ targets: q('.journey-station'), opacity: [0, 1], translateY: [-90, 0], duration: 700, easing: 'easeOutBounce', begin: () => setCaption('Tiba di Stasiun Ulang Tahun.') }, 6300)
      .add({ targets: q('.journey-cipher'), opacity: [0, 1], scale: [0, 1], duration: 500, easing: 'easeOutBack', begin: () => { audioService.playSfx('reveal'); setArrived(true) } }, 6800)
      .add({ targets: q('.journey-caption'), opacity: [1, 1], duration: 1100 }, 7300) // jeda baca sebelum pindah

    // Jaring pengaman: alur tetap lanjut walau timeline macet (tab di-background, dsb.).
    const safety = window.setTimeout(finish, SAFETY_TIMEOUT)
    return () => { timeline.pause(); anime.remove(root.querySelectorAll('*')); window.clearTimeout(safety) }
  }, [reducedMotion])

  return (
    <main ref={rootRef} className={`journey ${reducedMotion ? 'journey--static' : ''}`} aria-label="Perjalanan menuju Stasiun Ulang Tahun" tabIndex={-1}>
      <div className="journey-sky" aria-hidden="true">
        {stars.map((star, i) => <i key={i} className={`px-star px-star--${star.tone}`} style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size }} />)}
      </div>

      <div className="journey-station" aria-hidden={!arrived}>
        <div className="station-sign">
          <small>Peron ✦ 01</small>
          <strong>STASIUN ULANG TAHUN</strong>
          <span>Selamat datang, {nickname}!</span>
        </div>
      </div>

      <BoardingPass className="journey-ticket" stamp />

      <div className="journey-track" aria-hidden="true">
        <div className="journey-train"><PixelTrain /></div>
        <div className="journey-rail" />
        <AssetFallback className="journey-cipher" src={assets.stickers.laugh} alt="" label="Cipher" />
      </div>

      <p className={`journey-caption ${arrived ? 'sr-only' : ''}`} aria-live="polite">{arrived ? 'Tiba di Stasiun Ulang Tahun.' : caption}</p>

      {arrived && (
        <div className="journey-dialogue">
          <DialogueBox speaker="Cipher" text={dialogue.arrival} portrait={assets.stickers.plead} reducedMotion={reducedMotion}>
            {reducedMotion && <PixelButton onClick={finish}>Masuk stasiun →</PixelButton>}
          </DialogueBox>
        </div>
      )}

      {!reducedMotion && <button className="journey-skip" onClick={finish}>Lewati ›</button>}
    </main>
  )
}
