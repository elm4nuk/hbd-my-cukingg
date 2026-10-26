import { useState, type CSSProperties } from 'react'
import { birthdayConfig, type SceneId } from '../../config/birthday'
import { audioService } from '../../lib/audio'
import { getBirthdayCountdown } from '../../lib/birthday-date'
import type { JourneyState } from '../../lib/progress'
import { AssetFallback } from '../../components/AssetFallback'
import { DialogueBox } from '../../components/DialogueBox'
import { PixelButton } from '../../components/PixelButton'
import { PixelIcon, type PixelIconName } from '../../components/PixelIcon'
import { PixelPanel } from '../../components/PixelPanel'
import { PixelStarfield } from '../../components/PixelStarfield'

export type BirthdayHubProps = {
  journey: JourneyState
  reducedMotion: boolean
  onNavigate: (scene: SceneId) => void
  /** Menghapus progress tersimpan dan kembali ke opening. */
  onReset: () => void
}

type Destination = { scene: SceneId; label: string; icon: PixelIconName; blurb: string; status: (j: JourneyState) => string | null }

const destinations: Destination[] = [
  { scene: 'gallery', label: 'Kenangan', icon: 'images', blurb: 'Galeri foto Picuy', status: j => j.visited.includes('gallery') ? 'Sudah dilihat' : null },
  { scene: 'quest', label: 'Misi', icon: 'flag', blurb: 'Cari 3 kargo yang hilang', status: j => `${j.found.length}/${birthdayConfig.questItems.length} ditemukan` },
  { scene: 'video', label: 'Bioskop', icon: 'video', blurb: 'Transmisi Cipher', status: j => j.visited.includes('video') ? 'Sudah ditonton' : null },
  { scene: 'gift', label: 'Hadiah', icon: 'gift', blurb: 'Tiket hadiah + surat', status: j => j.giftOpened ? 'Sudah dibuka' : 'Masih tersegel' },
]

export function BirthdayHub({ journey, reducedMotion, onNavigate, onReset }: BirthdayHubProps) {
  const [confirmReset, setConfirmReset] = useState(false)
  const countdown = getBirthdayCountdown(birthdayConfig.birthDate)
  const { recipient, nickname, dialogue, assets } = birthdayConfig
  const explored = destinations.every(d => journey.visited.includes(d.scene))
  const go = (scene: SceneId) => { audioService.playSfx('click'); onNavigate(scene) }

  return (
    <main className="scene hub" tabIndex={-1}>
      <PixelStarfield className="hub__stars" count={32} seed={23} />

      <section className="hub-hero">
        <figure className="hub-art">
          <div className="hub-art__planet" aria-hidden="true" />
          <div className="hub-polaroid">
            <span className="hub-polaroid__tape" aria-hidden="true" />
            <div className="hub-polaroid__photo">
              <AssetFallback src={assets.hubPhoto} alt={assets.hubPhotoAlt} label="Foto Pica" style={{ objectPosition: assets.hubPhotoPosition }} />
            </div>
            <figcaption>Penumpang VIP · {nickname}</figcaption>
          </div>
          <AssetFallback className="hub-art__cipher" src={assets.stickers.laugh} alt="" label="Cipher" />
        </figure>

        <div className="hub-title">
          <p className="eyebrow">Stasiun Ulang Tahun • Peron 01</p>
          <h1>Happy Birthday, <em>{recipient}!</em></h1>
          <p className="hub-sub">Semua gerbong di stasiun ini disiapkan khusus untuk {nickname}.</p>
          {countdown && (
            <p className={`hub-countdown ${countdown.isToday ? 'is-today' : ''}`}>
              {countdown.isToday ? '★ HARI INI ULANG TAHUNMU! ★' : `${countdown.days} hari lagi menuju hari H`}
            </p>
          )}
          <DialogueBox speaker="Cipher" text={explored ? dialogue.hubDone : dialogue.hub} portrait={assets.stickers.tail} reducedMotion={reducedMotion}>
            {explored && <PixelButton onClick={() => go('finale')}>Ke peron terakhir <PixelIcon name="arrow-right" /></PixelButton>}
          </DialogueBox>
        </div>
      </section>

      <section className="hub-board" aria-labelledby="hub-board-title">
        <header className="hub-board__head">
          <h2 id="hub-board-title">Pilih tujuan</h2>
          <span aria-hidden="true">KEBERANGKATAN · {destinations.length} GERBONG</span>
        </header>
        <nav className="hub-grid" aria-label="Gerbong">
          {destinations.map((d, index) => {
            const status = d.status(journey)
            const done = journey.visited.includes(d.scene)
            return (
              <PixelPanel as="div" key={d.scene} tone={index % 2 ? 'pink' : 'lavender'} className={`hub-card ${done ? 'is-done' : ''}`} style={{ '--i': index } as CSSProperties}>
                <button onClick={() => go(d.scene)} aria-label={`${d.label}: ${d.blurb}${status ? `, ${status}` : ''}`}>
                  <span className="hub-card__icon" aria-hidden="true"><PixelIcon name={d.icon} size={48} /></span>
                  <span className="hub-card__text">
                    <span className="hub-card__no">Peron 0{index + 1}</span>
                    <strong>{d.label}</strong>
                    <small>{d.blurb}</small>
                  </span>
                  <span className="hub-card__meta">
                    {status && <span className="hub-card__status">{done && <PixelIcon name="check" />}{status}</span>}
                    <span className="hub-card__go" aria-hidden="true"><PixelIcon name="arrow-right" /></span>
                  </span>
                </button>
              </PixelPanel>
            )
          })}
        </nav>
      </section>

      <div className="hub-reset">
        {confirmReset ? (
          <p role="alert">
            Hapus semua progress dan mulai dari tiket lagi?{' '}
            <button className="text-button" onClick={onReset}>Ya, reset</button>{' '}
            <button className="text-button" onClick={() => setConfirmReset(false)}>Batal</button>
          </p>
        ) : (
          <button className="text-button" onClick={() => setConfirmReset(true)}><PixelIcon name="reload" /> Reset progress</button>
        )}
      </div>
    </main>
  )
}
