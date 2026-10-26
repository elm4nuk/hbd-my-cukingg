import { birthdayConfig } from '../../config/birthday'
import { AssetFallback } from '../../components/AssetFallback'
import { PixelButton } from '../../components/PixelButton'
import { PixelIcon } from '../../components/PixelIcon'
import { PixelStarfield } from '../../components/PixelStarfield'
import { SoundToggle } from '../../components/SoundToggle'
import { BoardingPass } from './BoardingPass'

export function BoardingScreen({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <main className="opening scene" tabIndex={-1}>
      <PixelStarfield className="opening__stars" count={40} seed={5} />
      <div className="opening-copy">
        <p className="eyebrow">Incoming transmission • for {birthdayConfig.recipient}</p>
        <h1 className="opening-title"><span>PICUY'S</span> <span>BIRTHDAY</span> <em>EXPRESS</em></h1>
        <p className="subtitle">A Cipher Side Quest</p>
        <p className="intro-text">Satu tiket misterius tiba. Tujuannya? Sebuah perjalanan kecil khusus untuk Picuy.</p>
        <div className="opening-actions">
          <PixelButton onClick={onStart} size="lg" className="pixel-button--start">
            Mulai perjalanan <PixelIcon name="arrow-right" />
          </PixelButton>
          <div className="opening-secondary">
            <button className="text-button" onClick={onSkip}>Lewati opening</button>
            <SoundToggle showVolume={false} label />
          </div>
        </div>
        <p className="opening-note">Musik kecil mulai setelah tombol ditekan.</p>
      </div>

      <div className="opening-art">
        <div className="opening-art__planet" aria-hidden="true" />
        <BoardingPass className="opening-pass" />
        <AssetFallback className="opening-art__cipher" src={birthdayConfig.assets.stickers.coin} alt="" label="Cipher" />
        <span className="opening-art__spark is-a" aria-hidden="true"><PixelIcon name="sparkles" /></span>
        <span className="opening-art__spark is-b" aria-hidden="true"><PixelIcon name="sparkles" /></span>
      </div>
    </main>
  )
}
