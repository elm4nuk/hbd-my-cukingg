import { useState, type ImgHTMLAttributes } from 'react'

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
  /** Teks yang tampil bila gambar gagal dimuat. */
  label?: string
  /** true untuk aset pixel art (image-rendering: pixelated). Jangan dipakai untuk foto. */
  pixel?: boolean
}

/** <img> yang tidak pernah memblokir alur: bila gagal, tampil kotak placeholder bergaya pixel. */
export function AssetFallback({ src, alt, label, pixel = false, className = '', ...props }: Props) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span className={`asset-fallback ${className}`} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
        <span aria-hidden="true">✦</span>
        <small>{label ?? 'aset belum tersedia'}</small>
      </span>
    )
  }
  return <img src={src} alt={alt} className={`${pixel ? 'is-pixel' : ''} ${className}`} onError={() => setFailed(true)} {...props} />
}
