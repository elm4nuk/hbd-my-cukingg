/**
 * Kontrak section scroll-story.
 * - Setiap section adalah satu <section id="…"> dalam document flow, dirender penuh tanpa JS animasi.
 * - Animasi lokal: useGSAP + scope ke ref section + gsap.matchMedia(MQ.*) dari `story/motion/gsap`.
 * - Tidak boleh ada klik wajib untuk melanjutkan cerita; kontrol (video, musik, lightbox) opsional.
 * - Konten tidak boleh disembunyikan oleh CSS awal; state awal animasi hanya diset lewat JS (gsap.from/fromTo).
 */
export type StorySectionProps = {
  /** Dari useReducedMotion(); dipakai untuk logika non-CSS (mis. confetti, typewriter). */
  reducedMotion: boolean
}

/** Urutan dan anchor halaman (dipakai nav topbar). */
export const storyRoute = [
  { id: 'top', label: 'Halo', owner: 'claude' },
  { id: 'express', label: 'Express', owner: 'claude' },
  { id: 'cipher', label: 'Cipher', owner: 'claude' },
  { id: 'memories', label: 'Kenangan', owner: 'codex' },
  { id: 'video', label: 'Video', owner: 'codex' },
  { id: 'letter', label: 'Surat', owner: 'codex' },
  { id: 'finale', label: 'Finale', owner: 'codex' },
] as const
