import { useRef } from 'react'
import { birthdayConfig } from '../../config/birthday'
import { AssetFallback } from '../../components/AssetFallback'
import { DialogueBox } from '../../components/DialogueBox'
import { gsap, MQ, useGSAP } from '../motion/gsap'
import type { StorySectionProps } from '../types'

/**
 * Bab 3 — Cipher & Picuy. Dua foto cosplay dalam bingkai pixel + stiker Cipher sebagai aksen.
 * Tanpa pin. Desktop: foto masuk dari sisi berlawanan + stiker parallax ringan. Mobile: fade-up sederhana.
 */
export function CipherPicuySection({ reducedMotion }: StorySectionProps) {
  const root = useRef<HTMLElement>(null)
  const { recipient, nickname, dialogue, assets } = birthdayConfig

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.desktop, () => {
      const enter = { trigger: '.duo-stage', start: 'top 78%', toggleActions: 'play none none reverse' }
      gsap.timeline({ scrollTrigger: enter, defaults: { ease: 'power3.out', duration: 0.85 } })
        .from('.duo-photo--main', { x: -80, rotate: -9, autoAlpha: 0 })
        .from('.duo-photo--side', { x: 80, rotate: 10, autoAlpha: 0 }, '<0.12')
        .from('.duo-sticker', { scale: 0.3, autoAlpha: 0, stagger: 0.1, ease: 'back.out(1.8)', duration: 0.45 }, '-=0.35')
      gsap.from('.duo-copy > *', { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: '.duo-copy', start: 'top 80%', once: true } })
      // Parallax ringan: stiker bergerak sedikit berlawanan dengan foto.
      gsap.to('.duo-sticker--laugh', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.1 } })
      gsap.to('.duo-sticker--tail', { yPercent: 16, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.1 } })
    })
    mm.add(MQ.mobile, () => {
      gsap.utils.toArray<HTMLElement>('.duo-photo, .duo-copy').forEach(el => {
        gsap.from(el, { y: 28, autoAlpha: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      })
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <section ref={root} id="cipher" className="duo" aria-labelledby="duo-title">
      <div className="duo-stage">
        <figure className="duo-photo duo-photo--main">
          <span className="duo-tape" aria-hidden="true" />
          <div className="duo-photo__img">
            <AssetFallback src={assets.hubPhoto} alt={assets.hubPhotoAlt} label="Foto Pica" style={{ objectPosition: assets.hubPhotoPosition }} />
          </div>
          <figcaption>Penumpang VIP · {nickname}</figcaption>
        </figure>
        <figure className="duo-photo duo-photo--side">
          <div className="duo-photo__img">
            <AssetFallback src={assets.duoPhoto} alt={assets.duoPhotoAlt} label="Foto Pica" style={{ objectPosition: assets.duoPhotoPosition }} loading="lazy" />
          </div>
          <figcaption>Cipher mode: ON</figcaption>
        </figure>
        <AssetFallback className="duo-sticker duo-sticker--laugh" src={assets.stickers.laugh} alt="" label="Cipher" />
        <AssetFallback className="duo-sticker duo-sticker--tail" src={assets.stickers.tail} alt="" label="Cipher" />
      </div>

      <div className="duo-copy">
        <p className="eyebrow">Peron 02 · Side quest partner</p>
        <h2 id="duo-title">Cipher <span>&amp;</span> <em>{nickname}</em></h2>
        <p className="duo-lede">Satu kucing hoodie dari Honkai: Star Rail, satu {recipient} yang membawanya keluar dari layar. Kostum lengkap, pose lengkap — misi hari ini cuma satu: merayakan kamu.</p>
        <DialogueBox speaker="Cipher" text={dialogue.duo} portrait={assets.stickers.plead} reducedMotion={reducedMotion} />
      </div>
    </section>
  )
}
