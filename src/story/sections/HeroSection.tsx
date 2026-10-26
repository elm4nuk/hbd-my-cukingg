import { useEffect, useRef, useState } from 'react'
import { birthdayConfig } from '../../config/birthday'
import { AssetFallback } from '../../components/AssetFallback'
import { PixelIcon } from '../../components/PixelIcon'
import { PixelStarfield } from '../../components/PixelStarfield'
import { SoundToggle } from '../../components/SoundToggle'
import { BoardingPass } from '../../features/opening/BoardingPass'
import { gsap, MQ, useGSAP } from '../motion/gsap'
import type { StorySectionProps } from '../types'

/** Bab 1 — "Hello, Picuy!". Tanpa gate: semua konten langsung terlihat, scroll membawa ke bab berikutnya. */
export function HeroSection({ reducedMotion }: StorySectionProps) {
  const root = useRef<HTMLElement>(null)
  const backgroundVideo = useRef<HTMLVideoElement>(null)
  const [videoPaused, setVideoPaused] = useState(reducedMotion)
  const { nickname, title, subtitle, assets } = birthdayConfig

  useEffect(() => {
    const video = backgroundVideo.current
    const section = root.current
    if (!video || !section) return

    if (reducedMotion || videoPaused) video.pause()

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reducedMotion && !videoPaused) {
        void video.play().catch(() => undefined)
      } else {
        video.pause()
      }
    }, { threshold: 0.12 })

    observer.observe(section)
    return () => { observer.disconnect(); video.pause() }
  }, [reducedMotion, videoPaused])

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, ctx => {
      const { desktop } = ctx.conditions as { desktop: boolean }
      // Masuk sekali saat load (bukan gate — konten sudah ada di DOM dan terlihat bila JS gagal).
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hello-title > span', { yPercent: 60, autoAlpha: 0, duration: 0.6, stagger: 0.12 })
        .from('.hello-kicker, .hello-lede, .hello-cue', { y: 14, autoAlpha: 0, duration: 0.45, stagger: 0.08 }, '-=0.25')
        .from('.hello-pass', { y: 40, rotate: -8, autoAlpha: 0, duration: 0.7 }, 0.2)
        .from('.hello-sticker', { scale: 0.4, autoAlpha: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.8)' }, 0.55)

      // Parallax ringan saat hero keluar viewport (reversible, scrub).
      gsap.to('.hello-art', {
        yPercent: desktop ? -14 : -6,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1.1 },
      })
      gsap.to('.hello-stars', {
        yPercent: desktop ? 18 : 8,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1.1 },
      })
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <section ref={root} id="top" className="hello" aria-labelledby="hello-title">
      <div className="hello-video-bg" aria-hidden="true">
        <video
          ref={backgroundVideo}
          src={birthdayConfig.video.src}
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        />
      </div>
      <PixelStarfield className="hello-stars" count={44} seed={5} />
      <div className="hello-copy">
        <p className="eyebrow hello-kicker">{title} · {subtitle}</p>
        <h1 id="hello-title" className="hello-title">
          <span>Hello,</span>
          <span><em>{nickname}!</em></span>
        </h1>
        <p className="hello-lede">Satu tiket misterius sudah atas namamu. Duduk saja, lalu scroll pelan-pelan — Birthday Express berangkat sendiri.</p>
        <div className="hello-cue">
          <span className="hello-cue__arrow" aria-hidden="true"><PixelIcon name="arrow-right" /></span>
          <span>Scroll untuk berangkat</span>
          <SoundToggle showVolume={false} label />
        </div>
      </div>

      <div className="hello-art">
        <div className="hello-art__planet" aria-hidden="true" />
        <BoardingPass className="hello-pass" />
        <AssetFallback className="hello-sticker hello-sticker--coin" src={assets.stickers.coin} alt="" label="Cipher" />
        <AssetFallback className="hello-sticker hello-sticker--plead" src={assets.stickers.plead} alt="" label="Cipher" />
      </div>

      <button
        type="button"
        className="hello-video-toggle"
        onClick={() => setVideoPaused(paused => !paused)}
        aria-pressed={videoPaused}
        aria-label={videoPaused ? 'Putar background video Cipher' : 'Jeda background video Cipher'}
      >
        <PixelIcon name={videoPaused ? 'play' : 'pause'} size={18} />
        <span>{videoPaused ? 'Putar background' : 'Jeda background'}</span>
      </button>
    </section>
  )
}
