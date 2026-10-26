import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { birthdayConfig } from '../../config/birthday'
import { AssetFallback } from '../../components/AssetFallback'
import { DialogueBox } from '../../components/DialogueBox'
import { PixelIcon } from '../../components/PixelIcon'
import { PixelStarfield } from '../../components/PixelStarfield'
import { BoardingPass } from '../opening/BoardingPass'
import { PixelTrain } from '../opening/PixelTrain'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function StoryIntro({ reducedMotion }: { reducedMotion: boolean }) {
  const journeyRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.story-station-card', {
        autoAlpha: 0,
        y: 18,
        duration: 0.55,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.story-station-card', start: 'top 84%', once: true },
      })
      gsap.fromTo('.story-train', { xPercent: -48 }, {
        xPercent: 22,
        ease: 'none',
        scrollTrigger: { trigger: '.story-journey-stage', start: 'top 92%', end: 'bottom 28%', scrub: 0.7 },
      })
    })
    media.add('(prefers-reduced-motion: reduce)', () => gsap.set(['.story-station-card', '.story-train'], { clearProps: 'all' }))
    return () => media.revert()
  }, { scope: journeyRef })

  return (
    <>
      <section id="top" className="story-hero" aria-labelledby="story-title">
        <PixelStarfield className="story-hero__stars" count={42} seed={5} />
        <div className="story-hero__copy">
          <p className="eyebrow">Incoming transmission · for {birthdayConfig.recipient}</p>
          <h1 id="story-title"><span>PICUY'S</span><span>BIRTHDAY</span><em>EXPRESS</em></h1>
          <p className="story-kicker">A Cipher Side Quest</p>
          <p className="story-lede">Satu tiket misterius tiba. Tujuannya? Sebuah perjalanan kecil khusus untuk Picuy.</p>
          <a className="pixel-button pixel-button--lg story-cta" href="#station">
            Naik ke Express <PixelIcon name="arrow-right" />
          </a>
          <p className="story-scroll-cue" aria-hidden="true"><span /> scroll untuk berangkat</p>
        </div>
        <div className="story-hero__art">
          <div className="story-orbit" aria-hidden="true" />
          <BoardingPass className="story-pass" />
          <AssetFallback className="story-hero__cipher" src={birthdayConfig.assets.stickers.coin} alt="" label="Cipher" />
        </div>
      </section>

      <section ref={journeyRef} id="station" className="story-section story-journey" aria-labelledby="station-title">
        <header className="story-heading story-heading--center">
          <p className="eyebrow">Peron 01 · Birthday route</p>
          <h2 id="station-title">Next stop: Stasiun Ulang Tahun</h2>
          <p>Tak perlu tiket lanjutan. Semua gerbong di halaman ini terbuka dan bisa dicapai dengan scroll.</p>
        </header>

        <div className="story-journey-stage" aria-label="Birthday Express tiba di stasiun">
          <div className="story-station-sign"><small>ARRIVING</small><strong>PICUY STATION</strong></div>
          <div className="story-train"><PixelTrain /></div>
          <div className="story-rail" aria-hidden="true" />
        </div>

        <div className="story-station-card">
          <figure className="story-polaroid">
            <span className="story-tape" aria-hidden="true" />
            <AssetFallback src={birthdayConfig.assets.hubPhoto} alt={birthdayConfig.assets.hubPhotoAlt} label="Foto Pica" style={{ objectPosition: birthdayConfig.assets.hubPhotoPosition }} />
            <figcaption>Penumpang VIP · {birthdayConfig.nickname}</figcaption>
          </figure>
          <div className="story-station-copy">
            <p className="eyebrow">Cipher says</p>
            <h2>Welcome aboard, {birthdayConfig.recipient}!</h2>
            <DialogueBox speaker="Cipher" text={birthdayConfig.dialogue.hub} portrait={birthdayConfig.assets.stickers.tail} reducedMotion={reducedMotion} />
          </div>
        </div>
      </section>
    </>
  )
}
