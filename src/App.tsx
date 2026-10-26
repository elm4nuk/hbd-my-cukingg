import { useEffect } from 'react'
import { birthdayConfig } from './config/birthday'
import { audioService } from './lib/audio'
import { useReducedMotion } from './lib/useReducedMotion'
import { SoundToggle } from './components/SoundToggle'
import { PixelIcon } from './components/PixelIcon'
import { useScrollRefresh } from './story/motion/gsap'
import { storyRoute } from './story/types'
import { HeroSection } from './story/sections/HeroSection'
import { ExpressSection } from './story/sections/ExpressSection'
import { CipherPicuySection } from './story/sections/CipherPicuySection'
import { ScrollProgress } from './story/ScrollProgress'
import { MemoryGallery } from './features/memory-gallery/MemoryGallery'
import { MemeInterlude } from './features/memory-gallery/MemeInterlude'
import { VideoRoom } from './features/video-room/VideoRoom'
import { GiftReveal } from './features/gift/GiftReveal'
import { BirthdayFinale } from './features/finale/BirthdayFinale'

// Nav topbar: semua bab kecuali hero (brand sudah menuju #top).
const route = storyRoute.filter(item => item.id !== 'top')

export default function App() {
  const reducedMotion = useReducedMotion()
  useScrollRefresh('#main-story')

  useEffect(() => {
    const visibility = () => document.hidden ? audioService.pause() : audioService.resume()
    document.addEventListener('visibilitychange', visibility)
    return () => document.removeEventListener('visibilitychange', visibility)
  }, [])

  return (
    <div className="app-shell story-shell">
      <a className="skip-link" href="#main-story">Lewati navigasi</a>
      <div className="starfield" aria-hidden="true" />
      <div className="cartoon-space-decor" aria-hidden="true"><i /><i /><i /><i /></div>
      <ScrollProgress />
      <header className="topbar story-topbar">
        <a className="brand" href="#top" aria-label="Kembali ke awal halaman"><span><PixelIcon name="sparkles" /></span><strong>PICUY EXPRESS</strong></a>
        <nav aria-label="Rute Birthday Express">
          {route.map((item, index) => <a href={`#${item.id}`} key={item.id}><span>{String(index + 1).padStart(2, '0')}</span><small>{item.label}</small></a>)}
        </nav>
        <SoundToggle showVolume={false} />
      </header>

      <main id="main-story">
        {/* Bab 1–3: Claude */}
        <HeroSection reducedMotion={reducedMotion} />
        <ExpressSection reducedMotion={reducedMotion} />
        <CipherPicuySection reducedMotion={reducedMotion} />
        {/* Bab 4–8: Codex */}
        <MemoryGallery />
        <MemeInterlude />
        <VideoRoom />
        <GiftReveal />
        <BirthdayFinale reducedMotion={reducedMotion} />
      </main>

      <footer className="site-footer"><span>Made for {birthdayConfig.nickname}</span><span>from {birthdayConfig.sender} · {birthdayConfig.subtitle}</span></footer>
    </div>
  )
}
