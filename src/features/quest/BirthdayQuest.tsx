import { useState } from 'react'
import { birthdayConfig } from '../../config/birthday'
import { PixelButton } from '../../components/PixelButton'
import { SceneFrame } from '../../components/SceneFrame'

export type BirthdayQuestProps = {
  found: string[]
  onFind: (id: string) => void
  onNext: () => void
  onSkip: () => void
}

export function BirthdayQuest({ found, onFind, onNext, onSkip }: BirthdayQuestProps) {
  const [reveal, setReveal] = useState<(typeof birthdayConfig.questItems)[number] | null>(null)
  const choose = (item: (typeof birthdayConfig.questItems)[number]) => { onFind(item.id); setReveal(item) }
  return (
    <SceneFrame eyebrow="Stop 02 • Side quest" title="Find the three lost cargo items">
      <div className="quest-progress" aria-live="polite">
        <div className="quest-progress__copy"><small>MISSION PROGRESS</small><strong>{found.length} / {birthdayConfig.questItems.length}</strong></div>
        <div className="quest-progress__slots">
          {birthdayConfig.questItems.map(item => <span key={item.id} className={found.includes(item.id) ? 'is-found' : ''} aria-label={`${item.label}: ${found.includes(item.id) ? 'ditemukan' : 'belum ditemukan'}`}>{found.includes(item.id) ? '✓' : '?'}</span>)}
        </div>
        <div className="quest-progress__bar"><i style={{ width: `${found.length / birthdayConfig.questItems.length * 100}%` }} /></div>
      </div>
      <p className="quest-instruction">Tiga benda bersembunyi di gerbong. Tap atau tekan Enter untuk mengambilnya—nggak ada timer, santai aja.</p>
      <div className="quest-board" role="group" aria-label="Arena pencarian benda">
        <div className="quest-board__sign" aria-hidden="true"><span>CARGO BAY</span><strong>SEARCH MODE</strong></div>
        {birthdayConfig.questItems.map((item, index) => (
          <button key={item.id} className={`quest-item quest-item-${index + 1} ${found.includes(item.id) ? 'is-found' : ''}`} onClick={() => choose(item)} aria-label={`${found.includes(item.id) ? 'Lihat lagi' : 'Temukan'} ${item.label}`} aria-pressed={found.includes(item.id)}>
            <span aria-hidden="true">{item.icon}</span><small>{found.includes(item.id) ? item.label : 'Cari benda'}</small>
          </button>
        ))}
        <div className="pixel-platform platform-a" /><div className="pixel-platform platform-b" /><div className="pixel-platform platform-c" />
      </div>
      {reveal && <aside className="quest-reveal" aria-live="polite"><img src={reveal.reveal} alt={reveal.revealAlt} /><div><span>ITEM FOUND</span><h2>{reveal.label}</h2><p>Satu langkah lebih dekat ke hadiah rahasia.</p></div></aside>}
      <div className="dual-actions">
        {found.length === 3 && <PixelButton onClick={onNext}>Lanjut ke video →</PixelButton>}
        <button className="text-button" onClick={onSkip}>Lewati misi, buka surat</button>
      </div>
    </SceneFrame>
  )
}
