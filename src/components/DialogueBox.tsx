import { useEffect, useState, type ReactNode } from 'react'
import { AssetFallback } from './AssetFallback'

type Props = {
  speaker: string
  text: string
  /** URL potret/stiker kecil di sisi kiri. */
  portrait?: string
  /** Efek mengetik per huruf; otomatis dimatikan bila reduced motion. */
  typewriter?: boolean
  reducedMotion?: boolean
  children?: ReactNode
}

/** Kotak dialog RPG. Tap teks untuk langsung menampilkan semuanya. */
export function DialogueBox({ speaker, text, portrait, typewriter = true, reducedMotion = false, children }: Props) {
  const animate = typewriter && !reducedMotion
  const [shown, setShown] = useState(animate ? 0 : text.length)

  useEffect(() => {
    if (!animate) { setShown(text.length); return }
    setShown(0)
    const id = window.setInterval(() => setShown(count => {
      if (count >= text.length) { window.clearInterval(id); return count }
      return count + 1
    }), 28)
    return () => window.clearInterval(id)
  }, [text, animate])

  const done = shown >= text.length
  return (
    <div className="dialogue-box">
      {portrait && <AssetFallback className="dialogue-portrait" src={portrait} alt="" label="Cipher" />}
      <div className="dialogue-body">
        <p className="dialogue-speaker">{speaker}</p>
        {/* Teks lengkap untuk pembaca layar; versi animasi hanya visual. */}
        <p className="sr-only">{text}</p>
        <p className="dialogue-text" aria-hidden="true" onClick={() => setShown(text.length)}>
          {text.slice(0, shown)}{!done && <span className="dialogue-caret">▌</span>}
        </p>
        {children && <div className="dialogue-actions">{children}</div>}
      </div>
      {done && <span className="dialogue-next" aria-hidden="true">▼</span>}
    </div>
  )
}
