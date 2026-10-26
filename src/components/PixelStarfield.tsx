import { useMemo } from 'react'

type Props = {
  /** Jumlah bintang; 24–48 cukup. */
  count?: number
  seed?: number
  className?: string
}

/**
 * Latar bintang pixel dekoratif (kotak 2–4px + beberapa bintang plus yang berkedip).
 * Posisi deterministik dari `seed`; kedip berhenti otomatis saat reduced motion (CSS).
 */
export function PixelStarfield({ count = 36, seed = 11, className = '' }: Props) {
  const stars = useMemo(() => {
    let s = seed
    const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647 }
    return Array.from({ length: count }, (_, i) => ({
      left: rand() * 100,
      top: rand() * 100,
      kind: i % 9 === 0 ? 'plus' : rand() > 0.8 ? 'big' : 'dot',
      tone: rand() > 0.82 ? 'pink' : rand() > 0.6 ? 'lavender' : 'cream',
      delay: Math.round(rand() * 3000),
    }))
  }, [count, seed])

  return (
    <div className={`px-starfield ${className}`} aria-hidden="true">
      {stars.map((star, i) => (
        <i key={i} className={`px-starfield__star is-${star.kind} is-${star.tone}`} style={{ left: `${star.left}%`, top: `${star.top}%`, animationDelay: `${star.delay}ms` }} />
      ))}
    </div>
  )
}
