import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { birthdayConfig } from '../../config/birthday'
import { PixelIcon } from '../../components/PixelIcon'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type GalleryItem = { id: string; src: string; alt: string; caption: string; kind: 'photo' | 'memory'; aspect: string }

const items: GalleryItem[] = [
  ...birthdayConfig.gallery.map((item, index) => ({ id: `photo-${index + 1}`, src: item.src, alt: item.alt, caption: item.caption, kind: 'photo' as const, aspect: '3 / 4' })),
  ...birthdayConfig.memories.map(item => ({ ...item, kind: 'memory' as const })),
]

export function MemoryGallery() {
  const rootRef = useRef<HTMLElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [modal, setModal] = useState<number | null>(null)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('.scrap-card').forEach((card, index) => {
        gsap.from(card, {
          autoAlpha: 0,
          x: index % 2 ? 34 : -34,
          y: 18,
          scale: 0.965,
          duration: 0.78,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        })
      })
    })
    media.add('(prefers-reduced-motion: reduce)', () => gsap.set('.scrap-card', { clearProps: 'all' }))
    return () => media.revert()
  }, { scope: rootRef })

  useEffect(() => {
    if (modal === null) return
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null)
      if (event.key === 'ArrowRight') setModal(value => value === null ? null : (value + 1) % items.length)
      if (event.key === 'ArrowLeft') setModal(value => value === null ? null : (value - 1 + items.length) % items.length)
    }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
      openerRef.current?.focus()
    }
  }, [modal])

  const open = (index: number, button: HTMLButtonElement) => {
    openerRef.current = button
    setModal(index)
  }

  return (
    <section ref={rootRef} id="memories" className="story-section memory-section" aria-labelledby="memories-title">
      <header className="story-heading">
        <p className="eyebrow">Stop 02 · Memory archive</p>
        <h2 id="memories-title">Kenangan Picuy, satu per satu</h2>
        <p>Foto dan potongan arsip disusun dalam alur halaman—nggak perlu swipe atau membuka apa pun untuk melihat semuanya.</p>
      </header>

      <div className="scrapbook-list">
        {items.map((item, index) => (
          <figure className={`scrap-card scrap-card--${item.kind}`} key={item.id}>
            <span className="scrap-tape" aria-hidden="true" />
            <button className="scrap-image" style={{ aspectRatio: item.aspect }} onClick={event => open(index, event.currentTarget)} aria-label={`Perbesar ${item.caption}`}>
              <img src={item.src} alt={item.alt} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
              <span className="scrap-zoom" aria-hidden="true"><PixelIcon name="images" /> lihat dekat</span>
            </button>
            <figcaption><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.caption}</strong></figcaption>
          </figure>
        ))}
      </div>

      {modal !== null && (
        <div className="modal-backdrop" onMouseDown={event => { if (event.currentTarget === event.target) setModal(null) }}>
          <div className="photo-modal" role="dialog" aria-modal="true" aria-label={`Foto diperbesar: ${items[modal].caption}`}>
            <button ref={closeRef} className="modal-close" onClick={() => setModal(null)} aria-label="Tutup foto">×</button>
            <div className="photo-modal__image"><img src={items[modal].src} alt={items[modal].alt} /></div>
            <p><span>{String(modal + 1).padStart(2, '0')} / {items.length}</span>{items[modal].caption}</p>
            <div className="modal-nav">
              <button onClick={() => setModal((modal - 1 + items.length) % items.length)}>Sebelumnya</button>
              <button onClick={() => setModal((modal + 1) % items.length)}>Berikutnya</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
