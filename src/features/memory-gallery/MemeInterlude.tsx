import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { birthdayConfig } from '../../config/birthday'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function MemeInterlude() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.meme-sticker', {
        autoAlpha: 0,
        y: 22,
        rotate: (index: number) => index % 2 ? 5 : -5,
        scale: 0.9,
        duration: 0.65,
        stagger: 0.12,
        ease: 'back.out(1.25)',
        scrollTrigger: { trigger: '.meme-strip', start: 'top 86%', once: true },
      })
    })
    media.add('(prefers-reduced-motion: reduce)', () => gsap.set('.meme-sticker', { clearProps: 'all' }))
    return () => media.revert()
  }, { scope: rootRef })

  return (
    <section ref={rootRef} className="meme-interlude" aria-labelledby="meme-title">
      <div className="meme-copy">
        <p className="eyebrow">Commercial break-ish</p>
        <h2 id="meme-title">Selingan receh sebelum transmisi</h2>
        <p>Karena perjalanan antarbintang juga butuh jeda yang sedikit absurd.</p>
      </div>
      <div className="meme-strip">
        {birthdayConfig.memes.map(meme => (
          <figure className="meme-sticker" key={meme.id}><img src={meme.src} alt={meme.alt} loading="lazy" /></figure>
        ))}
      </div>
    </section>
  )
}
