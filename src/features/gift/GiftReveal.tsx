import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { birthdayConfig } from '../../config/birthday'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function GiftReveal() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({
        scrollTrigger: { trigger: '.letter-envelope', start: 'top 82%', end: 'bottom 58%', scrub: 1.05 },
      })
        .to('.envelope-flap', { rotateX: 180, transformOrigin: '50% 0%', ease: 'none' })
        .to('.envelope-ticket', { y: -36, rotate: -2, ease: 'none' }, '<25%')

      gsap.from('.letter-panel', {
        autoAlpha: 0,
        y: 24,
        scale: 0.98,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.letter-panel', start: 'top 88%', once: true },
      })
    })
    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.envelope-flap', { rotateX: 180 })
      gsap.set(['.envelope-ticket', '.letter-panel'], { clearProps: 'all' })
    })
    return () => media.revert()
  }, { scope: rootRef })

  return (
    <section ref={rootRef} id="letter" className="story-section letter-section" aria-labelledby="letter-title">
      <header className="story-heading story-heading--center">
        <p className="eyebrow">Stop 04 · Special delivery</p>
        <h2 id="letter-title">Surat dari Firaz</h2>
        <p>Amplopnya membuka saat kamu mendekat. Surat lengkap tetap berada di halaman dan bisa langsung dibaca.</p>
      </header>

      <div className="letter-envelope" aria-hidden="true">
        <div className="envelope-back" />
        <div className="envelope-ticket"><small>ONE WAY</small><strong>GIFT PASS</strong><span>FOR PICUY · 001</span></div>
        <div className="envelope-front" />
        <div className="envelope-flap" />
      </div>

      <article className="letter-panel">
        <div className="letter-meta" aria-hidden="true"><span>PRIVATE MAIL</span><span>EXPRESS / 001</span></div>
        <div className="letter-stamp" aria-hidden="true">P ✦</div>
        <p className="letter-greeting">{birthdayConfig.letter.greeting}</p>
        <div className="letter-copy">
          {birthdayConfig.letter.paragraphs.map((paragraph, index) => (
            <p key={index} className={paragraph.startsWith('[') ? 'letter-placeholder' : ''}>{paragraph}</p>
          ))}
        </div>
        <p className="letter-signoff">{birthdayConfig.letter.signoff}<br /><span>✦</span></p>
      </article>
    </section>
  )
}
