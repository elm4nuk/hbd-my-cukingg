# Design Handoff — Picuy's Birthday Express

## Claude — fondasi scroll-story + bab 1–3 (25 Oktober 2026, setelah Codex selesai)

Dikerjakan **di atas** integrasi Codex di bawah ini. Section Codex (Kenangan, Meme, Video, Surat, Finale) dan `story.css` tidak diubah.

### File ownership

| File | Pemilik | Status |
| --- | --- | --- |
| `src/story/motion/gsap.ts` | Claude | **Baru**: satu tempat `registerPlugin`, `MQ`, `PIN_BUDGET`, dan `useScrollRefresh` (fonts.ready + ResizeObserver `<main>`, debounce 200ms, `ignoreMobileResize`) |
| `src/story/types.ts` | Claude | **Baru**: `StorySectionProps` dan `storyRoute` (urutan anchor + pemilik) |
| `src/story/sections/HeroSection.tsx` | Claude | **Baru**: "Hello, Picuy!", tiket, stiker, cue scroll, tombol musik opsional |
| `src/story/sections/ExpressSection.tsx` | Claude | **Baru**: adegan kereta (pin #1 desktop) |
| `src/story/sections/CipherPicuySection.tsx` | Claude | **Baru**: dua foto cosplay + stiker + dialog Cipher |
| `src/styles/story-core.css` | Claude | **Baru**: gaya bab 1–3 |
| `src/App.tsx` | Claude (integrasi) | `StoryIntro` diganti tiga section Claude. Nav memakai `storyRoute` (anchor: `#express`, `#cipher`, `#memories`, `#video`, `#letter`, `#finale`). `useScrollRefresh` dipasang. Section Codex dan props-nya tetap sama. |
| `src/components/SoundToggle.tsx` | Claude | Perbaikan bug: tanpa start gate, klik pertama sebelumnya justru **mematikan** suara. Sekarang status = "berbunyi" (nyala + sudah di-unlock), dan klik pertama memutar musik. Props tetap sama. |
| `src/config/birthday.ts` | bersama | **Aditif**: `dialogue.duo`, `assets.duoPhoto`, `assets.duoPhotoAlt`, `assets.duoPhotoPosition`. Blok `memories` milik Codex tidak disentuh. |
| `src/main.tsx` | — | + impor `./styles/story-core.css` setelah `story.css` |
| `docs/SCROLL-STORYBOARD.md` | Claude | **Baru** |
| `src/features/story/StoryIntro.tsx` | Codex (lama) | **Tidak dirender lagi** (digantikan bab 1–3). Tidak dihapus; silakan dihapus bersama aturan `.story-hero*`, `.story-journey*`, dan `.story-station*` di `story.css` bila setuju. |
| `src/features/{memory-gallery,video-room,gift,finale}/*`, `src/styles/story.css` | Codex | Tidak diubah |

### Kontrak untuk section

- Satu `<section id>` per bab, dalam document flow. Tidak ada klik wajib. CSS default = keadaan akhir.
- Animasi: `useGSAP(fn, { scope: ref })` + `gsap.matchMedia()` dengan `MQ.*` dari `src/story/motion/gsap.ts`. Cleanup lewat `mm.revert()`. Jangan memanggil `ScrollTrigger.killAll()` atau membunuh trigger global.
- Pin hanya di `MQ.desktop`. Sisa anggaran: **1 pin** (lihat `PIN_BUDGET`).
- Props: section baru menerima `StorySectionProps` (`{ reducedMotion }`). Section Codex yang ada tetap boleh tanpa props.

### Dependency

`gsap@^3.15.0` dan `@gsap/react@^2.1.2` (dipasang Codex), `pixelarticons`, `howler`, dan `canvas-confetti` dipakai. `animejs` dan `embla-carousel-react` kini **hanya dipakai file legacy** yang tidak dirender (opening/hub/quest lama, `StoryIntro`); keduanya bisa dihapus setelah legacy dibersihkan. Lenis/smooth-scroll **tidak** dipasang.

### Tugas Codex

1. Seragamkan impor GSAP di 5 section Codex ke `src/story/motion/gsap.ts` dan pakai `MQ.desktop`/`MQ.mobile` bila ada perbedaan desktop/mobile.
2. Opsional: gunakan pin #2 untuk amplop surat (desktop saja, ≤ `+=80%`). Pastikan surat tetap di flow setelah pin selesai.
3. Hapus `StoryIntro.tsx` dan CSS `.story-hero*`, `.story-journey*`, `.story-station*` yang tidak dipakai, lalu file legacy (opening/hub/quest, `RouteNav`, `progress` reducer bila tak dipakai) serta dependency `animejs`/`embla-carousel-react` bila sudah tidak dirujuk.
4. **Tinjau konten `kenangan picuy` bersama Firaz.** Keenam arsip saat ini tampil, termasuk yang memuat lelucon Hitler, peta Israel/Yerusalem, umpatan, DM tiruan berlogo lembaga, dan wajah/nama orang ketiga (lihat `docs/ASSETS.md`).
5. QA responsif akhir (360/390/768/1440 + reduced motion) setelah poin 1–3, ditambah cek `npm audit` (10 temuan dilaporkan saat instalasi).

### Verifikasi Claude (benar-benar dijalankan)

- `npm run typecheck`, `npm run test` (6/6), dan `npm run build` lulus (lihat laporan akhir).
- Playwright + Chrome headless: scroll wheel turun-naik di 390/1440, normal dan reduced motion. Hasilnya: 0 langkah macet, kembali ke `scrollY = 0`, 0 konten tersembunyi, 0 overflow-x, dan 0 error. Pin hanya di desktop (1). Detail tabel ada di `docs/SCROLL-STORYBOARD.md`.
- Screenshot review ada di `docs/screenshots/scroll-story-claude/`.
- **Tidak diuji**: perangkat fisik/iOS Safari, audio secara auditori, dan perilaku mobile kedua situs referensi.

---

## Cartoon motion pass — 25 Oktober 2026

- Visual kini memakai gaya **cartoon scrapbook space-trip**: headline bulat ekspresif, candy palette lavender–pink–cyan, frame foto seperti stiker, panel organik, rounded cinema/envelope, serta shadow berlapis yang lebih lembut.
- `src/styles/cartoon.css` diimpor paling akhir agar fondasi pixel dan konten existing tetap aman, sementara siluet visual menjadi lebih fun.
- Pin desktop pada adegan Express dihapus. Kereta sekarang mengikuti native document scroll dengan scrub 1–1,15; parallax dekorasi juga diberi smoothing agar trackpad/wheel tidak terasa tertahan.
- Ditambahkan progress strip warna di bagian atas (`src/story/ScrollProgress.tsx`) sebagai feedback posisi tanpa mengubah native scroll.
- QA Chrome 360/390/768/844-landscape/1440: tanpa overflow horizontal, error runtime, autoplay video, atau konten tersembunyi pada reduced motion.

## Codex scroll-story integration — 25 Oktober 2026

### Outcome

- Aplikasi kini berupa **satu halaman vertikal**. Hero, stasiun/Cipher, Kenangan, meme interlude, video, surat, dan finale selalu berada di document flow; tidak ada start gate, quest wajib, tombol next, atau surat terkunci.
- Navigasi header memakai anchor asli (`#station`, `#memories`, `#video`, `#letter`, `#finale`). Keyboard scrolling dan direct anchor tetap native.
- Fondasi warna, font, komponen pixel, konten personal, audio service, serta aset pilihan Claude dipertahankan. Override halaman tunggal berada di `src/styles/story.css`, yang diimpor terakhir.
- `docs/SCROLL-STORYBOARD.md` yang disebut di brief tidak tersedia di checkout ini. Integrasi memakai `DESIGN-SYSTEM.md`, dokumen handoff yang ada, manifest aset, dan implementasi aktual sebagai sumber kebenaran.

### Implementasi utama

| Area | Implementasi |
| --- | --- |
| Shell | `src/App.tsx` sekarang merender seluruh cerita sekaligus; header sticky hanya menyediakan anchor opsional dan kontrol suara. |
| Opening + Cipher | `src/features/story/StoryIntro.tsx` memakai boarding pass, foto, stiker, dan kereta existing dalam hero + adegan stasiun yang tidak memblokir scroll. |
| Kenangan | `MemoryGallery.tsx` adalah scrapbook vertikal 12 kartu (6 foto + 6 arsip `kenangan picuy`), bergantian kiri/kanan di desktop dan satu kolom di mobile. Semua terlihat tanpa klik; lightbox tetap opsional. Wrapper memakai aspect ratio sumber untuk mengurangi layout shift. |
| Meme | `MemeInterlude.tsx` menampilkan tiga stiker meme dalam stagger pendek; semuanya non-interaktif dan tidak menutupi copy. |
| Video | `VideoRoom.tsx` memakai frame bioskop pixel, poster, rasio 9:16, serta kontrol native. Tidak autoplay; video dijeda saat keluar viewport dan tidak diputar ulang otomatis. Error media menampilkan fallback. |
| Surat | `GiftReveal.tsx` membuka amplop dekoratif lewat scroll, tetapi isi surat selalu dirender penuh dalam flow normal. Isi `birthdayConfig.letter` tidak diubah. |
| Finale | `BirthdayFinale.tsx` menampilkan kue, ucapan, dua stiker, bonus meme, wish opsional, dan anchor kembali ke atas. Confetti dipicu satu kali per session saat section masuk viewport dan dimatikan pada reduced motion. |
| Motion | `gsap`, `ScrollTrigger`, dan `@gsap/react` menjadi pengendali scroll. Semua hook memakai scope + cleanup dan `gsap.matchMedia`; tidak ada pinning atau smooth-scroll library. |
| Aset | `scripts/prepare-assets.mjs` membuat salinan WebP ≤1200/1600px dari `kenangan picuy` ke `public/assets/memories/`; sumber asli hanya dibaca. |

### Referensi

- `alche.studio` dapat dibaca: ritme bab dan cue “scroll to explore” dipakai sebagai inspirasi, tanpa menyalin layout.
- `arcmarumo.com/work/scza` tidak dapat diakses oleh alat web pada sesi ini; tidak ada detail visual yang ditebak.

### Verifikasi aktual

- `npm run typecheck` — lulus.
- `npm run test` — lulus, 6/6.
- `npm run build` — lulus (Vite production build).
- Chrome headless QA via `scripts/visual-qa.mjs` pada 360×740, 390×844, 768×1024, 844×390, dan 1440×900:
  - `scrollWidth` tidak melebihi viewport;
  - keenam anchor section tersedia;
  - video tetap paused sebelum interaksi;
  - surat tetap terlihat dan tingginya tidak terpotong;
  - reduced motion: 0 kartu tersembunyi, flap amplop langsung terbuka, video tetap paused;
  - jalur error video menampilkan fallback dan finale tetap tersedia;
  - fokus keyboard berpindah ke kontrol native;
  - tidak ada error console/runtime.
- Screenshot hasil QA tersimpan di `docs/screenshots/scroll-story/`.

### Batasan

- Audio tidak dapat dinilai secara auditori di Chrome headless; kebijakan no-autoplay tetap dipertahankan di kode.
- Perangkat fisik/iOS Safari belum diuji.
- Referensi ArcMarumo tidak dapat diakses.
- Placeholder `[TULIS PESAN PERSONAL FIRAZ DI SINI]` tetap dibiarkan karena brief melarang mengarang atau mengubah isi surat.

---

Untuk: Codex (pemilik styling layar fitur dan QA responsif). Acuan visual lengkap ada di `docs/DESIGN-SYSTEM.md`, sedangkan kontrak state dan navigasi di `docs/HANDOFF.md`.

Dokumen ini berisi dua laporan:

1. **Design pass fondasi (Claude, 20:06–20:30)**: token, komponen bersama, Opening, dan BirthdayHub.
2. **Design pass layar fitur (agen lain, 20:01–20:08)**: dipertahankan **verbatim** di bagian bawah.

---

## 1. Design pass fondasi (Claude)

### Konteks dan keputusan

- **Arah warna** dipilih user: navy–pink pixel sesuai brief (#14162E / #292044 / #BEA0FF / #F18AC8 / #FFF1D6). Override tema teal "portfolio" yang sempat ada di `foundation.css` sudah dihapus. Alias tokennya tetap dipertahankan agar `styles.css` dan `features.css` tidak rusak.
- **Dasar pixel UI:** frame pixel bertakik buatan sendiri di `foundation.css`, terinspirasi teknik `border-image` RetroUI. Pertimbangannya:
  - RetroUI (BSD-3-Clause) dievaluasi dari paketnya: CSS-nya scoped dan `Button`-nya meneruskan semua atribut. Tapi `Card`/`Dropdown` memaksa font Minecraft (font ketiga) dan class Tailwind `p-0`. Karena tema hanya perlu frame, teknik itu diimplementasikan ulang tanpa dependency.
  - NES.css (MIT) **ditolak** karena membawa Bootstrap Reboot global yang akan menimpa tampilan existing.
- **Ikon:** `pixelarticons@2.4.2` (MIT) dipasang sebagai dependency; satu keluarga, grid 24px, impor per file.
- **tweakcn** tidak dipakai karena proyek tidak memakai shadcn/ui.
- **UI/UX Pro Max:** pemasangan project-local (`npx ui-ux-pro-max-cli init --ai claude`) **ditolak oleh pemeriksa izin sesi Claude**, jadi tidak ada file skill di `.claude/`. Aturan dari `SKILL.md` dan `references/pro-rules.md` repositori resmi dibaca manual dan diterapkan: kontras ≥4,5:1, target 44px, jarak antar target 8px, feedback tekan 80–150ms tanpa mengubah layout, satu keluarga ikon SVG, reduced motion, dan tanpa scroll horizontal.

### File yang diubah atau dibuat

| File | Perubahan |
| --- | --- |
| `src/styles/foundation.css` | **Ditulis ulang**: token semantik + alias lama, frame pixel bertakik, shell global (topbar, starfield, footer, fokus), komponen bersama, Opening, perjalanan, Hub, breakpoint, reduced motion. Backup versi sebelumnya: di luar repo (scratchpad Claude). |
| `src/styles/features.css` | **Baru**: blok "Feature screens" dari agen lain dipindah **verbatim** dari `foundation.css` (diff = kosong), plus satu baris `touch-action` khusus fitur. Aturan bersama `.pixel-button/.text-button/.scene-heading/.eyebrow` dipindah ke fondasi. |
| `src/main.tsx` | Impor `./styles/features.css` setelah fondasi. |
| `src/components/PixelButton.tsx` | + `size?: 'md' \| 'lg'`, `type="button"` default, label dibungkus `span`. Props lama tetap kompatibel. |
| `src/components/SoundToggle.tsx` | Ikon pixel volume; + `label?` opsional. |
| `src/components/SceneFrame.tsx` | Hanya komentar; markup dan props tetap. |
| `src/components/PixelIcon.tsx` | **Baru**: pembungkus pixelarticons. |
| `src/components/RouteNav.tsx` | **Baru**: nav topbar dengan ikon pixel (menggantikan markup nav inline di App). |
| `src/components/PixelStarfield.tsx` | **Baru**: bintang dekoratif. |
| `src/App.tsx` | Topbar memakai `RouteNav` + ikon brand. Logika, state, dan handler tidak berubah. |
| `src/features/opening/BoardingPass.tsx` | **Baru**: tiket "Passenger: Picuy" (boarding + perjalanan). |
| `src/features/opening/BoardingScreen.tsx` | Desain ulang: judul pixel, tiket berfoto, START besar, skip + suara dekat CTA. Handler `onStart`/`onSkip` tetap. |
| `src/features/opening/JourneyAnimation.tsx` | Tiket diganti `<BoardingPass className="journey-ticket" stamp />`. **Timeline, durasi, selector Anime.js, skip, dan reduced motion tidak berubah.** |
| `src/features/hub/BirthdayHub.tsx` | Desain ulang: polaroid foto + Cipher \| judul + dialog, "Pilih tujuan" sebagai papan keberangkatan. Props, status, dan reset 2 langkah tetap. |
| `src/config/birthday.ts` | **Aditif**: `assets.heroPhotoPosition`, `assets.hubPhoto`, `assets.hubPhotoAlt`, `assets.hubPhotoPosition`. |
| `package.json` | + `pixelarticons` (dependency). |
| `docs/DESIGN-SYSTEM.md`, `docs/DESIGN-HANDOFF.md` | Ditulis ulang. Laporan agen lain dipertahankan di bawah. |
| `docs/ASSETS.md` | + inventaris dan peringatan untuk `kenangan picuy/`. |
| `docs/screenshots/design-pass/` | Screenshot review (lihat Verifikasi). |

**Tidak disentuh:** `src/styles.css`, file di `src/features/{memory-gallery,quest,video-room,gift,finale}`, reducer/progress, audio service, dan folder aset sumber.

### Token dan komponen yang tersedia

Lihat `docs/DESIGN-SYSTEM.md`. Ringkasnya:

- warna `--color-*`;
- font `--font-pixel` / `--font-body`;
- judul `--title-hero` / `--title-page` / `--title-block` / `--label-pixel`;
- spacing `--space-1..9`;
- frame `--frame`, `--frame-inner`, `--lift`, `--drop`;
- motion `--dur-press` / `--dur-hover` / `--dur-enter` dan `--ease-pixel`;
- target sentuh `--target`.

Komponen: `PixelButton`, `PixelPanel`, `DialogueBox`, `SoundToggle`, `SceneFrame`, `RouteNav`, `PixelIcon`, `PixelStarfield`, `AssetFallback`, `BoardingPass`.

### Aturan aset (ringkas)

- Foto Pica natural, tanpa pixelate. Wajah tidak boleh terpotong (`object-position` per foto di config).
- Stiker Cipher (chibi halus) tidak dipixelate dan tidak boleh menutupi wajah, teks, atau tombol.
- `kenangan picuy/` berisi screenshot inside joke dengan konten sensitif dan data orang ketiga. **Belum dipakai di UI**; lihat `docs/ASSETS.md` sebelum memasukkannya ke galeri.

### Pekerjaan untuk Codex

1. **Sisa warna teal** di aturan fitur `styles.css` (domain fitur), misalnya:
   - track progress quest `#29433f`;
   - `.meme-toggle` `#738f87`;
   - border `#55726a`, `#5d7a70`, `#628178`, `#608078`;
   - bayangan `#031517` / `#04181b`.

   Ganti ke token `--color-*`. Contohnya terlihat di `docs/screenshots/design-pass/1440-finale.png` (link "Psst… bonus kecil?").
2. Selaraskan kartu fitur ke frame pixel bertakik: tambahkan selector ke grup frame di `foundation.css`, atau set `--frame`/`--lift` (lihat DESIGN-SYSTEM "Border, frame, dan shadow"). Saat ini kartu fitur masih memakai border 2px polos.
3. Ganti glyph (`←`, `→`, `↻`, `✓`, `◆`, `♜`, `▰`) pada kontrol fitur dengan `PixelIcon` agar satu keluarga ikon.
4. Tombol prev/next galeri dan tombol modal: pakai `PixelButton variant="ghost"` atau frame yang sama (target ≥44px sudah terpenuhi).
5. QA responsif 360/390/768/1440 + reduced motion untuk layar fitur setelah perubahan di atas.
6. Putuskan pemakaian `kenangan picuy/` bersama Firaz (lihat peringatan di ASSETS).

### Masalah visual yang tersisa

- Kontrol fitur masih memakai glyph teks dan border 2px. Ini belum seragam dengan frame bertakik di opening/hub (poin 2–3 di atas).
- Sisa warna teal di `styles.css` (poin 1).
- Stempel "BOARDED" di tiket perjalanan sengaja menimpa sudut kanan bawah tiket. Di HP stempel mendekati kolom "Kelas", tapi tidak menutup teks (dicek di screenshot 390).
- Nav topbar di ≤900px hanya menampilkan ikon; label tersedia lewat `aria-label` dan `title` (tooltip tidak muncul di layar sentuh).
- Belum dicek di Safari/iOS fisik. Slider volume memakai pseudo-element WebKit/Firefox; tampilannya di Safari lama belum diverifikasi.

### Verifikasi (yang benar-benar dijalankan)

- `npm run typecheck`: lulus.
- `npm run test`: 2 file, 6/6 test lulus.
- `npm run build`: lulus (JS 273 KB / gzip 90 KB, CSS 67 KB / gzip 15 KB).
- **Playwright + Chrome headless (lokal):**
  - Screenshot semua 7 layar pada **390×844** dan **1440×900** + frame perjalanan (`docs/screenshots/design-pass/`, termasuk `before-*.png` sebelum design pass).
  - **Hover**: tombol START dan kartu hub (bayangan memanjang, geser −2/−3px).
  - **Focus keyboard**: Tab sampai START dan kartu hub → outline `solid rgb(127,227,255)` terukur.
  - **Reduced motion (390)**: boarding → perjalanan statis → "Masuk stasiun" → hub; jumlah animasi berjalan = 0.
  - **Target sentuh**: ukuran terkecil dari semua tombol nav, suara, kartu hub, `text-button`, dan `pixel-button` = 44px.
  - **Overflow horizontal**: 0px untuk 7 layar pada 360×740, dan 0px pada 390 & 1440.
  - Tombol START di 390×844 berakhir di y=741 (terlihat tanpa scroll).
  - **Regresi fungsional pada build produksi** (4 skenario): opening → hub 9,6–10,0 dtk termasuk jeda screenshot (durasi timeline tidak diubah), Lewati → hub 1,7 dtk, reduced motion → hub 0,8 dtk. Hub → Kenangan → kembali via brand, status "✓ Sudah dilihat", reload tetap di hub, dan reset 2 langkah kembali ke boarding. Tanpa error JS.
- Kontras token diukur dengan rumus WCAG (tabel di DESIGN-SYSTEM). `--color-paper-accent` dikoreksi dari `#B84A8E` (4,27:1) ke `#A8417F` (5,04:1).

**Belum diverifikasi:** perangkat sentuh fisik, iOS Safari, bunyi audio yang sebenarnya, dan lebar 768px (tidak diminta di brief ini).

---

## 2. Design pass layar fitur (agen lain, 20:01–20:08) — verbatim

> Catatan Claude: blok CSS yang dijelaskan di bawah kini berada di `src/styles/features.css`, bukan `foundation.css`. Isinya tidak diubah. Sejak design pass fondasi, `pixelarticons` sudah dipasang sebagai dependency, jadi poin Batasan terakhir tentang Pixelarticons sudah tidak berlaku.

### Lingkup perubahan

Design pass ini hanya memperbarui layar Memory Gallery, Birthday Quest, Video Room, Gift Reveal/Surat, Birthday Finale, serta CSS pendukung. Reducer, navigasi, progress, event handler, isi surat, dan urutan alur tidak diubah.

### Perubahan akhir

#### Memory Gallery

- Kartu dibuat seperti scrapbook dengan tape, nomor foto, caption di kartu, dan variasi tinggi untuk foto cosplay.
- Foto aktif tidak di-crop (`object-fit: contain`); foto utuh juga dipakai di modal.
- Ditambahkan dot navigation berukuran sentuh 44px, prev/next, keyboard arrows, Escape, dan focus return.

#### Birthday Quest

- Progress dipindahkan ke HUD kecil berisi angka, tiga slot, dan progress bar.
- Item memiliki label, `aria-pressed`, focus state, dan area tap lebih besar.
- Arena diberi hierarki cargo-bay tanpa mengubah logika pencarian.

#### Video Room

- Video dibungkus frame bioskop pixel dengan marquee dan footer dekoratif.
- Kontrol native tetap bebas dari overlay setelah playback dimulai.
- Poster menggunakan path dari config, bukan URL aset absolut di CSS.

#### Gift Reveal dan Surat

- Tiket, lintasan bintang, kartu hadiah, dan letter state dirapikan tanpa mengubah timeline Anime.js.
- Path stiker memakai config.
- Surat memiliki metadata, ukuran baris maksimum, paragraph spacing, dan kontras cream/dark yang lebih nyaman.

#### Finale

- Kue menjadi fokus komposisi; sticker mission-complete diletakkan sebagai aksen samping di desktop dan turun ke bawah di mobile.
- Aksi wish, kembali, reset, dan bonus meme tetap terpisah jelas.
- Aset meme memakai config dan warna confetti mengikuti token resmi.

### Token tambahan

Alias layout `--bg`, `--surface`, `--panel-2`, `--line`, `--line-soft`, `--text`, `--muted`, `--purple`, dan `--mint` ditambahkan sebagai alias/derivasi token resmi. Identitas utama tetap navy, lavender, pink, dan cream.

### Verifikasi

- `npm run typecheck` lulus.
- `npm run test` lulus: 2 file, 6/6 test.
- `npm run build` lulus; output produksi berhasil dibuat di `dist/`.
- Audit statis path media lulus: tidak ada hardcoded `/assets/...` di komponen/CSS; semua media runtime memakai config + helper `asset()`.
- Target sentuh utama minimal 44px; slot kecil pada HUD quest bersifat indikator non-interaktif.
- Browser-control, Playwright, dan fasilitas screenshot tidak tersedia pada sesi ini. QA visual baru untuk 360/390/768/1440 belum diklaim; hasil Playwright lama di `docs/HANDOFF.md` terjadi sebelum design pass ini.
- UI/UX Pro Max dijalankan dengan query design-system `interactive birthday scrapbook pixel art playful`, audit UX `keyboard focus modal carousel responsive`, dan panduan stack React. Hasil mengonfirmasi Pixel Art + Hero-Centric, density sedang, motion standar, focus ring, native button semantics, reduced motion, dan breakpoint 375/768/1440.
- Rasio kontras token utama diperiksa secara numerik: cream/navy 15.88:1, muted/navy 9.91:1, cream/panel 13.58:1, muted/panel 8.48:1, navy/lavender 8.16:1, navy/pink 7.78:1, cyan/navy 12.11:1.
- Navigasi tujuh langkah dipadatkan menjadi tujuh target 44px pada mobile agar muat di 360px tanpa memotong item.

### Batasan

- UI/UX Pro Max terpasang lokal dari repo resmi di `~/.codex/skills/ui-ux-pro-max`. Palet merah/biru generik dan font body VT323 dari hasil generator tidak diterapkan karena bertentangan dengan kontrak navy/lavender/pink/cream dan kebutuhan keterbacaan body Nunito.
- RetroUI/NES.css/Pixelarticons tidak ditambahkan sebagai dependency agar fondasi Claude dan bundle tetap stabil; pola visualnya dipakai sebagai referensi, bukan framework baru.
- Pemeriksaan akhir di perangkat sentuh fisik dan iOS Safari masih disarankan sebelum publikasi.
