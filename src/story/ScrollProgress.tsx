import { useRef } from 'react'
import { gsap, useGSAP } from './motion/gsap'

/** Progress kecil sebagai feedback posisi; mengikuti native scroll tanpa mengubah perilaku roda/trackpad. */
export function ScrollProgress() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo('.story-progress__fill', { scaleX: 0 }, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.35 },
    })
  }, { scope: root })

  return <div ref={root} className="story-progress" aria-hidden="true"><span className="story-progress__fill" /><i>✦</i></div>
}
