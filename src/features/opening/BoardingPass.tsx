import { birthdayConfig } from '../../config/birthday'
import { AssetFallback } from '../../components/AssetFallback'

type Props = {
  className?: string
  /** Tampilkan stempel BOARDED (dianimasikan di JourneyAnimation lewat `.ticket-stamp`). */
  stamp?: boolean
  /** Foto penumpang kecil di tiket. Default true. */
  photo?: boolean
}

/** Tiket "Passenger: Picuy" — dipakai di boarding (statis) dan perjalanan (dianimasikan). */
export function BoardingPass({ className = '', stamp = false, photo = true }: Props) {
  const { nickname, sender, assets } = birthdayConfig
  return (
    <div className={`boarding-pass ${className}`} role="img" aria-label={`Tiket penumpang atas nama ${nickname}, tujuan Stasiun Ulang Tahun, dikirim oleh ${sender}`}>
      <div className="boarding-pass__head" aria-hidden="true"><span>✦ BIRTHDAY EXPRESS</span><span>No. 001</span></div>
      <div className="boarding-pass__body" aria-hidden="true">
        {photo && (
          <div className="boarding-pass__photo">
            <AssetFallback src={assets.heroPhoto} alt="" label="Foto" style={{ objectPosition: assets.heroPhotoPosition }} />
          </div>
        )}
        <dl>
          <div className="boarding-pass__name"><dt>Passenger</dt><dd className="ticket-name">{nickname}</dd></div>
          <div><dt>Tujuan</dt><dd>Stasiun Ulang Tahun</dd></div>
          <div><dt>Kelas</dt><dd>Cipher Side Quest</dd></div>
          <div><dt>Dikirim oleh</dt><dd>{sender}</dd></div>
        </dl>
        <div className="boarding-pass__stub"><span>PERON</span><b>01</b><i /></div>
      </div>
      {stamp && <span className="ticket-stamp" aria-hidden="true">BOARDED</span>}
    </div>
  )
}
