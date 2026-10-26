# Scroll Storyboard — Picuy's Birthday Express

Halaman vertikal yang dinikmati hanya dengan scroll. Tidak ada start gate, tombol next, atau bagian terkunci. Musik, video, lightbox, dan wish bersifat opsional.

Pengendali animasi scroll satu-satunya adalah **GSAP 3.15 + ScrollTrigger + @gsap/react**, lewat `src/story/motion/gsap.ts`. Scroll memakai native vertical scroll, tanpa Lenis, tanpa smooth-scroll library, dan tanpa scroll hijacking. Anime.js tidak dipakai di halaman ini (hanya ada di file legacy yang tidak dirender).

## Prinsip referensi yang diterjemahkan

Hanya desktop yang diamati lewat Chrome, 25 Okt 2026. Mobile **tidak** sempat diamati karena jendela tidak bisa diresize.

| Referensi | Yang diamati | Terjemahan pixel-birthday |
| --- | --- | --- |
| alche.studio | Hero berupa konstruksi garis tipis yang bertambah seiring scroll; ruang kosong sangat lega; caption kecil; pergantian bab dengan judul besar satu layar | Peta rute di adegan Express "terbangun" garis demi garis mengikuti scroll; tiap bab dibuka eyebrow kecil + judul besar; ruang kosong di sekitar adegan |
| arcmarumo.com/work/scza | Bingkai layar CRT, timecode berjalan, penggaris tick yang terisi sebagai progres, label "[NEXT TAPE]" | Odometer `KM 000 → 024` dan penggaris tick pink di HUD Express; label "NEXT STOP: CIPHER & PICUY". **Scroll hijacking-nya tidak ditiru.** |

## Urutan bab

| # | Bab (id) | Pemilik | File | Perilaku desktop (≥900px) | Mobile (<900px) | Reduced motion / tanpa JS |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hello, Picuy! (`#top`) | Claude | `src/story/sections/HeroSection.tsx` | Masuk sekali saat load: judul naik per baris, tiket berputar masuk, stiker pop. Saat keluar, parallax ringan (tiket −14%, bintang +18%, scrub). | Sama, parallax lebih kecil (−6% / +8%) | Semua langsung tampil statis; panah cue tidak beranimasi |
| 2 | Birthday Express (`#express`) | Claude | `src/story/sections/ExpressSection.tsx` | **Pin #1**: stage di-pin di bawah topbar sejauh `+=110%` (±990px pada tinggi 900). Timeline scrub 0.6: kereta masuk dari kiri lalu berhenti di tengah, peta rute tergambar, penggaris tick terisi, planet/bintang parallax, odometer 000→024, papan "PICUY STATION" turun di 70%, Cipher muncul di peron di 82%. | **Tanpa pin**. Timeline yang sama di-scrub saat stage melintas viewport (`top 85%` → `bottom 35%`). Tinggi stage 64svh. | Keadaan akhir: kereta di stasiun, rute penuh, papan dan Cipher tampil, odometer 024 |
| 3 | Cipher & Picuy (`#cipher`) | Claude | `src/story/sections/CipherPicuySection.tsx` | Tanpa pin. Polaroid utama masuk dari kiri, foto kedua dari kanan, stiker pop (toggle `play none none reverse`). Copy fade-up sekali. Stiker parallax berlawanan arah (scrub). | Fade-up sekali per foto dan copy. Stiker ekor disembunyikan agar tidak menutupi foto. | Statis lengkap |
| 4 | Kenangan (`#memories`) | Codex | `src/features/memory-gallery/MemoryGallery.tsx` | 12 kartu scrapbook, fade + geser kecil saat masuk (once) | Satu kolom | Statis |
| 5 | Meme interlude | Codex | `src/features/memory-gallery/MemeInterlude.tsx` | Tiga stiker stagger pop (once) | Sama | Statis |
| 6 | Video (`#video`) | Codex | `src/features/video-room/VideoRoom.tsx` | Frame bioskop fade-in. Video `controls playsInline preload="metadata"`, tanpa autoplay, dijeda saat keluar viewport. **Playback tidak dikendalikan scroll.** | Sama | Statis |
| 7 | Surat (`#letter`) | Codex | `src/features/gift/GiftReveal.tsx` | Amplop membuka dengan scrub (dekoratif); surat selalu di document flow | Sama | Amplop terbuka statis; surat tampil |
| 8 | Finale (`#finale`) | Codex | `src/features/finale/BirthdayFinale.tsx` | Kue, ucapan, confetti sekali per sesi saat masuk viewport | Sama | Tanpa confetti |

**Anggaran pin desktop: maksimal 2.** Claude memakai 1 (Express). Sisa 1 tersedia untuk Codex, misalnya amplop surat. Pin hanya boleh lewat `MQ.desktop`; mobile dan reduced motion tidak boleh pin.

## Aturan motion (kontrak)

1. **CSS default = keadaan akhir.** Konten tidak pernah disembunyikan oleh CSS. State awal hanya diset GSAP (`from`/`fromTo`) saat JS berjalan, sehingga bila JS gagal atau reduced motion aktif, semua terlihat.
2. **Satu modul**: impor `gsap`, `ScrollTrigger`, `useGSAP`, dan `MQ` dari `src/story/motion/gsap.ts`. Jangan memanggil `registerPlugin` di section baru. File Codex yang sudah ada masih mendaftarkan sendiri; itu aman (idempoten), tapi sebaiknya diseragamkan.
3. **Scope dan cleanup**: `useGSAP(fn, { scope: sectionRef })` + `const mm = gsap.matchMedia(); …; return () => mm.revert()`. Jangan memanggil `ScrollTrigger.getAll().forEach(kill)` atau `killAll`.
4. **Kondisi**: `MQ.desktop` (≥900px, motion ok), `MQ.mobile` (<900px, motion ok), dan `MQ.reduced`. Selector yang dipakai harus ada di dalam scope section.
5. **Refresh**: `useScrollRefresh('#main-story')` di `App.tsx` memanggil `ScrollTrigger.refresh()` sekali setelah `document.fonts.ready`, lalu hanya saat tinggi `<main>` benar-benar berubah (gambar lazy, metadata video), dengan debounce 200ms. `ignoreMobileResize: true` mencegah refresh karena bar alamat mobile. Tidak ada refresh per event scroll.
6. **Properti**: GSAP memakai `transform` (`x`, `yPercent`, `rotate`, `scale`) dan `autoAlpha`. Posisi dasar di CSS memakai properti `translate`/`rotate` terpisah agar tidak bentrok dengan transform GSAP. Jangan menganimasikan properti yang sama dengan Anime.js atau CSS animation pada elemen yang sama.
7. **Tanpa blur berat**, tanpa scrub video, tanpa `scroll-snap`.
8. Konten yang diperbesar (lightbox) atau video tidak boleh mengunci scroll halaman, kecuali `body.modal-open` selama modal terbuka (milik Codex).

## Fallback

| Kondisi | Hasil |
| --- | --- |
| `prefers-reduced-motion: reduce` | Tidak ada pin, tidak ada scrub, tidak ada animasi masuk. Semua bab tampil di keadaan akhir. Cue panah, kedip bintang, dan bob stiker mati (CSS). Confetti tidak dipicu. |
| Mobile < 900px | Tanpa pin. Timeline Express di-scrub di document flow. Parallax lebih kecil. Stiker yang berisiko menutup foto disembunyikan. |
| JS animasi gagal | CSS default menampilkan keadaan akhir, sehingga konten lengkap terlihat. (React tetap diperlukan untuk merender halaman.) |
| Gambar gagal dimuat | `AssetFallback` menampilkan kotak placeholder; alur tetap jalan. |

## Hasil QA scroll (Claude, Playwright + Chrome headless, 25 Okt 2026)

Diuji dengan wheel nyata, langkah 0,45 viewport ke bawah sampai dasar, lalu 0,6 viewport ke atas sampai `scrollY = 0`:

| Viewport | Pin | Tinggi dokumen | Langkah macet | Sampai dasar / atas | Konten tersembunyi setelah scroll | Overflow-x | Error |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390×844 | 0 | 14.153px | 0 | ya / ya | 0 | 0 | 0 |
| 1440×900 | 1 (spacer 1.818px) | 20.873px | 0 | ya / ya | 0 | 0 | 0 |
| 390×844 reduced | 0 | 14.179px | 0 | ya / ya | 0 | 0 | 0 |
| 1440×900 reduced | 0 | 19.883px | 0 | ya / ya | 0 | 0 | 0 |

- Frame Express desktop: awal = KM 000 (rute kosong, kereta di luar), tengah = KM 011, akhir = KM 024 (papan + Cipher). Saat kembali ke atas, kereta kembali ke luar kiri, artinya scrub reversible.
- Elemen yang dicek visibilitasnya: judul hero, tiket, kereta, papan, kedua foto Cipher & Picuy, judul bab, kartu kenangan, stiker meme, bingkai video, surat, judul finale, dan kue.
