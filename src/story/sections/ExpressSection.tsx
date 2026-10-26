import { useRef } from 'react'
import { birthdayConfig } from '../../config/birthday'
import { AssetFallback } from '../../components/AssetFallback'
import { PixelStarfield } from '../../components/PixelStarfield'
import { PixelTrain } from '../../features/opening/PixelTrain'
import { gsap, MQ, useGSAP } from '../motion/gsap'
import type { StorySectionProps } from '../types'

const KM_TOTAL = 24
const pad = (n: number) => String(n).padStart(3, '0')

/**
 * Bab 2 — Birthday Express. Satu-satunya adegan ber-pin milik Claude (desktop ≥900px).
 * CSS default = keadaan akhir (kereta sudah tiba) → aman tanpa JS & untuk reduced motion.
 */
export function ExpressSection(_: StorySectionProps) {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const km = useRef<HTMLElement>(null)
  const { nickname, assets } = birthdayConfig

  useGSAP(() => {
    const stageEl = stage.current
    if (!stageEl) return
    const train = stageEl.querySelector<HTMLElement>('.express-train')
    const topbarHeight = () => document.querySelector<HTMLElement>('.story-topbar')?.offsetHeight ?? 0
    // Mulai dari luar sisi kiri stage, berhenti di posisi CSS (tengah).
    const startX = () => -(stageEl.offsetWidth / 2 + (train?.offsetWidth ?? 0) / 2 + 40)
    const setKm = (progress: number) => { if (km.current) km.current.textContent = pad(Math.round(progress * KM_TOTAL)) }

    const build = (scrollTrigger: ScrollTrigger.Vars) =>
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { ...scrollTrigger, invalidateOnRefresh: true, onUpdate: self => setKm(self.progress) } })
        .fromTo('.express-train', { x: startX }, { x: 0, ease: 'power2.out', duration: 0.78 }, 0)
        .fromTo('.express-route path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1 }, 0)
        .fromTo('.express-ruler i', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
        .fromTo('.express-stars', { xPercent: 0 }, { xPercent: -4, duration: 1 }, 0)
        .fromTo('.express-planet', { xPercent: 8 }, { xPercent: -12, duration: 1 }, 0)
        .fromTo('.express-sign', { yPercent: -140, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, ease: 'back.out(1.6)', duration: 0.18 }, 0.7)
        .fromTo('.express-cipher', { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, ease: 'back.out(1.8)', duration: 0.14 }, 0.82)

    const mm = gsap.matchMedia()
    mm.add(MQ.desktop, () => {
      build({ trigger: stageEl, start: () => `top ${Math.max(topbarHeight(), window.innerHeight * 0.82)}px`, end: 'bottom 28%', scrub: 1.15 })
    })
    mm.add(MQ.mobile, () => {
      // Mobile: tanpa pin; kereta melaju selama stage melintasi viewport.
      build({ trigger: stageEl, start: 'top 88%', end: 'bottom 32%', scrub: 1 })
    })
    mm.add(MQ.reduced, () => setKm(1))
    return () => mm.revert()
  }, { scope: root })

  return (
    <section ref={root} id="express" className="express" aria-labelledby="express-title">
      <header className="story-heading story-heading--center express-heading">
        <p className="eyebrow">Peron 01 · Birthday route</p>
        <h2 id="express-title">Birthday Express berangkat</h2>
        <p>Rute pendek, tanpa transit, satu penumpang VIP. Pemandangannya cuma bintang — dan kamu.</p>
      </header>

      <div ref={stage} className="express-stage" role="img" aria-label={`Kereta pixel Birthday Express melaju dan tiba di Stasiun ${nickname}`}>
        <PixelStarfield className="express-stars" count={56} seed={41} />
        <span className="express-planet express-planet--a" aria-hidden="true" />
        <span className="express-planet express-planet--b" aria-hidden="true" />

        <svg className="express-route" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength={1} d="M20 90 H220 L300 40 H560 L640 80 H980" />
          {[[20, 90], [300, 40], [640, 80], [980, 90]].map(([x, y]) => <rect key={x} x={x - 6} y={y - 6} width="12" height="12" />)}
        </svg>

        <div className="express-sign" aria-hidden="true">
          <small>ARRIVING · PERON 01</small>
          <strong>PICUY STATION</strong>
        </div>

        <div className="express-train" aria-hidden="true"><PixelTrain /></div>
        <AssetFallback className="express-cipher" src={assets.stickers.laugh} alt="" label="Cipher" />
        <div className="express-rail" aria-hidden="true" />

        <div className="express-hud" aria-hidden="true">
          <span>KM <b ref={km}>{pad(KM_TOTAL)}</b> / {pad(KM_TOTAL)}</span>
          <span className="express-ruler"><i /></span>
          <span>NEXT STOP: CIPHER &amp; PICUY</span>
        </div>
      </div>
    </section>
  )
}
