// Fondasi motion scroll-story. Satu-satunya tempat plugin GSAP didaftarkan.
// Section mengimpor { gsap, ScrollTrigger, useGSAP, MQ } dari sini, lalu memakai
// useGSAP(..., { scope }) + gsap.matchMedia() agar cleanup hanya menyentuh milik section itu.
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Bar alamat mobile muncul/hilang → jangan refresh hanya karena tinggi viewport berubah sedikit.
ScrollTrigger.config({ ignoreMobileResize: true })

/** Kondisi gsap.matchMedia yang dipakai bersama. Desktop = boleh pin; mobile = tanpa pin. */
export const MQ = {
  desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const

/** Anggaran pin desktop (brief: maksimal dua adegan pendek). Express memakai 1; sisa 1 untuk Codex. */
export const PIN_BUDGET = { express: 1, codexAvailable: 1 } as const

/**
 * Hitung ulang posisi trigger setelah font siap dan saat tinggi dokumen benar-benar berubah
 * (gambar lazy, video metadata). Debounce 200ms — bukan pada setiap event scroll.
 */
export function useScrollRefresh(rootSelector = '#main-story') {
  useEffect(() => {
    let timer = 0
    let lastHeight = 0
    const refresh = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    }
    document.fonts?.ready.then(refresh).catch(() => undefined)
    const root = document.querySelector(rootSelector)
    const observer = root && 'ResizeObserver' in window
      ? new ResizeObserver(([entry]) => {
          const height = Math.round(entry.contentRect.height)
          if (Math.abs(height - lastHeight) > 2) { lastHeight = height; refresh() }
        })
      : null
    if (root && observer) observer.observe(root)
    return () => { window.clearTimeout(timer); observer?.disconnect() }
  }, [rootSelector])
}

export { gsap, ScrollTrigger, useGSAP }
