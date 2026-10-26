import { audioService, useAudioState } from '../lib/audio'
import { PixelIcon } from './PixelIcon'

type Props = {
  showVolume?: boolean
  /** Tampilkan teks status ("Putar musik" / "Musik nyala") di samping ikon. */
  label?: boolean
}

/**
 * Tombol musik opsional + slider volume. Tidak ada bunyi sebelum tombol ini (gesture) ditekan.
 * "Berbunyi" = preferensi nyala DAN audio sudah di-unlock oleh gesture.
 */
export function SoundToggle({ showVolume = true, label = false }: Props) {
  const { enabled, unlocked, volume } = useAudioState()
  const playing = enabled && unlocked
  // setEnabled(true) memanggil unlock() → BGM mulai dari gesture klik ini.
  const toggle = () => audioService.setEnabled(!playing)
  const text = playing ? 'Musik nyala' : 'Putar musik'
  return (
    <div className={`audio-controls ${label ? 'audio-controls--labelled' : ''}`}>
      <button onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Matikan musik' : 'Putar musik'} title={text}>
        <PixelIcon name={playing ? 'volume-on' : 'volume-off'} />
        {label && <span className="audio-controls__text" aria-hidden="true">{text}</span>}
      </button>
      {showVolume && (
        <label className="audio-controls__volume">
          <span className="sr-only">Volume</span>
          <input type="range" min="0" max="1" step="0.05" value={volume} disabled={!playing} onChange={event => audioService.setVolume(Number(event.target.value))} />
        </label>
      )}
    </div>
  )
}
