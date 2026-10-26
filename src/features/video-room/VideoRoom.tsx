import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { birthdayConfig } from '../../config/birthday'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function VideoRoom() {
  const rootRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.cinema-shell', {
        autoAlpha: 0,
        y: 28,
        rotate: -2,
        scale: 0.96,
        duration: 0.82,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.cinema-shell', start: 'top 84%', once: true },
      })
    })
    media.add('(prefers-reduced-motion: reduce)', () => gsap.set('.cinema-shell', { clearProps: 'all' }))
    return () => media.revert()
  }, { scope: rootRef })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !video.paused) video.pause()
    }, { threshold: 0.18 })
    observer.observe(video)
    return () => { observer.disconnect(); video.pause() }
  }, [])

  return (
    <section ref={rootRef} id="video" className="story-section video-section" aria-labelledby="video-title">
      <header className="story-heading">
        <p className="eyebrow">Stop 03 · Private transmission</p>
        <h2 id="video-title">A tiny Cipher broadcast</h2>
        <p>Tekan play kalau sudah siap. Video tidak akan menyala atau bersuara hanya karena kamu scroll.</p>
      </header>

      <div className="cinema-layout">
        <div className="cinema-shell">
          <div className="cinema-marquee" aria-hidden="true"><span>NOW PLAYING</span><i>✦</i><span>CAR 03</span></div>
          <div className="cinema-screen">
            {!failed ? (
              <video
                ref={videoRef}
                src={birthdayConfig.video.src}
                poster={birthdayConfig.gallery[2].thumb}
                controls
                playsInline
                preload="metadata"
                onError={() => setFailed(true)}
                aria-label={birthdayConfig.video.title}
              />
            ) : (
              <div className="video-fallback" role="status"><strong>Transmisi terputus.</strong><span>Tenang, surat dan finale tetap ada di bawah.</span></div>
            )}
          </div>
          <div className="cinema-footer" aria-hidden="true"><span>LOCAL FILE</span><span>9:16</span><span>AUDIO: USER CONTROL</span></div>
        </div>

        <aside className="transmission-note">
          <span className="signal"><i aria-hidden="true" /> SIGNAL RECEIVED</span>
          <h3>{birthdayConfig.video.title}</h3>
          <p>Pesan lokal dari gerbong Cipher—dibingkai seperti layar bioskop pixel, dengan kontrol video native tetap utuh.</p>
          <div className="terminal-lines"><span>FILE: CIPHER_COSPLAY.MP4</span><span>MODE: CLICK TO PLAY</span><span>STATUS: READY_</span></div>
        </aside>
      </div>
    </section>
  )
}
