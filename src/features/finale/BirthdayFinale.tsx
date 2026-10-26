import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import confetti from 'canvas-confetti'
import { birthdayConfig } from '../../config/birthday'
import { PixelIcon } from '../../components/PixelIcon'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const CONFETTI_KEY = 'picuy-finale-confetti-v1'

export function BirthdayFinale({ reducedMotion }: { reducedMotion: boolean }) {
  const rootRef = useRef<HTMLElement>(null)
  const [wishMade, setWishMade] = useState(false)

  useGSAP(() => {
    if (reducedMotion) return
    const trigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top 72%',
      once: true,
      onEnter: () => {
        try {
          if (sessionStorage.getItem(CONFETTI_KEY)) return
          sessionStorage.setItem(CONFETTI_KEY, '1')
        } catch { /* storage may be unavailable; ScrollTrigger still guarantees once per mount */ }
        confetti({
          particleCount: 64,
          spread: 70,
          origin: { y: 0.72 },
          colors: ['#bea0ff', '#f18ac8', '#7fe3ff', '#ffd76a'],
          disableForReducedMotion: true,
          ticks: 160,
        })
      },
    })
    return () => trigger.kill()
  }, { scope: rootRef, dependencies: [reducedMotion] })

  return (
    <section ref={rootRef} id="finale" className="story-section finale-section" aria-labelledby="finale-title">
      <div className="finale-stickers" aria-hidden="true">
        <img src={birthdayConfig.assets.stickers.laugh} alt="" />
        <img src={birthdayConfig.assets.stickers.plead} alt="" />
      </div>
      <header className="story-heading story-heading--center">
        <p className="eyebrow">Final stop · Birthday platform</p>
        <h2 id="finale-title">Happy Birthday, {birthdayConfig.nickname}!</h2>
        <p>Perjalanan kecilnya sampai di sini. Semoga wish yang kamu simpan hari ini menemukan jalannya jadi nyata.</p>
      </header>

      <div className={`pixel-cake ${wishMade ? 'candles-out' : ''}`} aria-label={wishMade ? 'Kue pixel dengan lilin padam' : 'Kue pixel dengan lilin menyala'}>
        <div className="cake-stars" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></div>
        <div className="candles"><i /><i /><i /></div><div className="cake-top" /><div className="cake-middle">HBD</div><div className="cake-bottom" />
      </div>

      <button className="pixel-button pixel-button--lg" onClick={() => setWishMade(true)} disabled={wishMade}>
        {wishMade ? 'Wish sent to the stars ✦' : 'Make a wish'}
      </button>

      <figure className="finale-meme">
        <img src={birthdayConfig.finaleMeme} alt="Meme kejutan untuk Pica" loading="lazy" />
        <figcaption>Bonus cargo berhasil ditemukan.</figcaption>
      </figure>

      <a className="back-to-top" href="#top"><PixelIcon name="arrow-right" /> Kembali ke atas</a>
    </section>
  )
}
