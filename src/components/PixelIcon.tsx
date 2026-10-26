// Satu keluarga ikon: pixelarticons (MIT, grid 24×24, fill currentColor).
// Impor per file agar bundle hanya memuat ikon yang dipakai.
import { ArrowRight } from 'pixelarticons/react/ArrowRight.js'
import { Bus } from 'pixelarticons/react/Bus.js'
import { Cake } from 'pixelarticons/react/Cake.js'
import { Check } from 'pixelarticons/react/Check.js'
import { Flag } from 'pixelarticons/react/Flag.js'
import { Gift } from 'pixelarticons/react/Gift.js'
import { Home } from 'pixelarticons/react/Home.js'
import { Images } from 'pixelarticons/react/Images.js'
import { Mail } from 'pixelarticons/react/Mail.js'
import { MapPin } from 'pixelarticons/react/MapPin.js'
import { Pause } from 'pixelarticons/react/Pause.js'
import { Play } from 'pixelarticons/react/Play.js'
import { Reload } from 'pixelarticons/react/Reload.js'
import { Sparkles } from 'pixelarticons/react/Sparkles.js'
import { Video } from 'pixelarticons/react/Video.js'
import { Volume2 } from 'pixelarticons/react/Volume2.js'
import { VolumeX } from 'pixelarticons/react/VolumeX.js'

const icons = {
  'arrow-right': ArrowRight,
  train: Bus,
  cake: Cake,
  check: Check,
  flag: Flag,
  gift: Gift,
  home: Home,
  images: Images,
  mail: Mail,
  pin: MapPin,
  pause: Pause,
  play: Play,
  reload: Reload,
  sparkles: Sparkles,
  video: Video,
  'volume-on': Volume2,
  'volume-off': VolumeX,
} as const

export type PixelIconName = keyof typeof icons

type Props = {
  name: PixelIconName
  /** Kelipatan 24 paling tajam (24, 48). Default 24. */
  size?: number
  className?: string
  /** Isi bila ikon berdiri sendiri tanpa teks; selain itu ikon disembunyikan dari pembaca layar. */
  label?: string
}

export function PixelIcon({ name, size = 24, className = '', label }: Props) {
  const Icon = icons[name]
  return (
    <Icon
      width={size}
      height={size}
      className={`px-icon ${className}`}
      shapeRendering="crispEdges"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
    />
  )
}
