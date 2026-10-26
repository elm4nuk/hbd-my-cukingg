# Design System — Picuy's Birthday Express

> **Single-page integration (25 Oktober 2026):** struktur scene lama sudah digantikan oleh scroll story di `src/App.tsx`. Token dan komponen fondasi di bawah tetap berlaku; override layout/animasi halaman tunggal berada di `src/styles/story.css`. GSAP + ScrollTrigger + `@gsap/react` mengendalikan motion berbasis scroll, sedangkan Anime.js hanya tersisa pada komponen opening lama yang tidak lagi dirender.

Kontrak visual untuk semua layar. Sumber kebenaran ada di kode: token dan komponen bersama di `src/styles/foundation.css`, sedangkan styling layar fitur di `src/styles/features.css`.

Urutan impor (lihat `src/main.tsx`): `styles.css` (dasar lama) → `foundation.css` → `features.css`. File yang diimpor belakangan menang jika spesifisitasnya sama.

## Arah visual

Pixel art yang tajam, scrapbook ulang tahun (foto, stiker, tape, caption), perjalanan antarbintang ala Honkai: Star Rail, dengan Cipher sebagai karakter pendamping. Nuansanya hangat, playful, dan personal. Ruang kosong dibiarkan lega, dan dekorasi dipakai dengan sengaja, bukan sebagai pengisi.

Komposisi desktop menempatkan ilustrasi di satu sisi dan teks di sisi lain. Di mobile, komposisi disusun ulang vertikal (bukan desktop yang dikecilkan).

## Warna

Komponen memakai token semantik `--color-*`. Hex mentah hanya ada di blok token.

| Token semantik | Nilai | Pakai untuk |
| --- | --- | --- |
| `--color-bg` | `#14162E` | Latar halaman |
| `--color-bg-deep` | `#0E0F24` | Gradasi langit opening |
| `--color-surface` | `#292044` | Panel, kartu, dialog |
| `--color-surface-raised` | `#342857` | Hover panel / tombol ghost |
| `--color-surface-sunken` | `#1C1934` | Chip status, track slider |
| `--color-line` | `#4D416F` | Garis pemisah, rel putus-putus |
| `--color-text` | `#FFF1D6` (cream) | Teks utama |
| `--color-text-muted` | `#C9C2E0` | Paragraf sekunder |
| `--color-text-subtle` | `#A49CC2` | Label kecil, footer |
| `--color-primary` | `#F18AC8` (pink) | CTA utama, aksen personal, nama Pica |
| `--color-secondary` | `#BEA0FF` (lavender) | Frame default, garis, aksen sekunder |
| `--color-on-accent` | `#14162E` | Teks di atas pink/lavender |
| `--color-paper` / `--color-paper-ink` | `#FFF1D6` / `#2F2444` | Tiket, polaroid, surat |
| `--color-paper-accent` | `#A8417F` | Teks aksen di atas kertas |
| `--color-focus` / `--color-info` | `#7FE3FF` (cyan) | **Hanya** ring fokus & status info |
| `--color-reward` | `#FFD76A` (emas) | **Hanya** ikon, bintang, hadiah |
| `--color-shadow` | `#0B0C1E` | Bayangan pixel |

Alias lama (`--navy`, `--panel`, `--lavender`, `--pink`, `--cream`, `--cyan`, `--gold`, `--ink`, `--bg`, `--surface`, `--panel-2`, `--line`, `--line-soft`, `--text`, `--muted`, `--purple`, `--mint`) tetap tersedia karena dipakai `styles.css` dan `features.css`. Kode baru sebaiknya memakai `--color-*`. Catatan: `--mint` sekarang menunjuk ke lavender (sisa tema lama, bukan hijau).

Kontras yang diukur (WCAG):

| Pasangan | Rasio |
| --- | --- |
| cream / navy | 15,88:1 |
| cream / plum | 13,58:1 |
| muted / navy | 10,37:1 |
| muted / plum | 8,87:1 |
| subtle / plum | 5,86:1 |
| navy / pink (tombol utama) | 7,78:1 |
| navy / lavender | 8,16:1 |
| cyan / navy | 12,11:1 |
| emas / navy | 12,82:1 |
| paper-ink / cream | 12,91:1 |
| paper-accent / cream | 5,04:1 |

Jangan memakai warna sebagai satu-satunya pembeda status; sertakan juga ikon atau teks (contoh: chip "✓ Sudah dilihat").

## Tipografi

Hanya dua keluarga font (lokal via `@fontsource`):

- **Press Start 2P** (`--font-pixel`): judul pendek (≤ 4 kata), tombol, eyebrow/label, nama penumpang, dan angka.
- **Nunito** (`--font-body`): paragraf, caption, surat, dialog, status, dan judul bagian yang panjang.

| Token | Ukuran | Font | Contoh |
| --- | --- | --- | --- |
| `--title-hero` | clamp(28–64px) | pixel | "PICUY'S BIRTHDAY EXPRESS", "Happy Birthday, Pica!" |
| `--title-page` | clamp(28–52px) | Nunito 800 | Judul `SceneFrame` ("Find the three lost cargo items") |
| `--title-block` | clamp(13–16px) | pixel | "Pilih tujuan" |
| `--label-pixel` | 10px | pixel | Eyebrow, nameplate dialog, countdown |
| `--text-lg` / `--text-md` | 18 / 16px | Nunito | Paragraf utama / teks kartu |
| `--text-sm` / `--text-xs` | 14 / 12px | Nunito | Caption, chip status, footer |

Aturan:

- Teks body minimal 16px, line-height 1.5–1.7.
- Teks pixel di bawah 9px hanya untuk dekorasi non-esensial (nomor tiket, barcode).
- Judul pixel diberi bayangan bertingkat `3px 3px` warna gelap + `6px 6px` ink; di ≤600px dikecilkan menjadi 2/4px.

## Spacing

Skala berbasis 4/8: `--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 24 · `--space-6` 32 · `--space-7` 48 · `--space-8` 64 · `--space-9` 96.

- Jarak antarbagian 48–64px di desktop, 32–48px di mobile.
- Jarak di dalam panel 16–24px.
- Jarak antar target sentuh minimal 8px.
- Target sentuh minimal **44×44px** (`--target`).

## Border, frame, dan shadow

**Frame pixel bertakik** adalah satu teknik untuk semua komponen pixel. Bentuknya: ring 3px di empat sisi tanpa sudut (sehingga sudutnya "pixel"), inset kedua sebagai tingkat bertingkat, lalu bayangan tegas tanpa blur.

```css
/* sudah diterapkan ke: .pixel-panel, .dialogue-box, .boarding-pass, .pixel-button, .station-sign, … */
.komponen-baru {
  --frame: var(--color-secondary);   /* warna ring */
  --frame-inner: var(--color-shadow);/* ring kedua (transparent = satu tingkat) */
  --lift: var(--lift-md);            /* jarak bayangan: 4 / 6 / 10px */
  --drop: var(--color-shadow);       /* warna bayangan */
}
```

Untuk memakainya di elemen baru, tambahkan selector ke grup "Frame pixel bertakik" di `foundation.css`, atau salin deklarasi `--frame-shadow`. Ring berada **di luar** kotak (3px), jadi beri jarak minimal 4px dari tepi kontainer.

Teknik ini terinspirasi `border-image` 8×8 milik RetroUI (BSD-3-Clause) dan box-shadow pixel milik NES.css (MIT). Keduanya diimplementasikan ulang dengan CSS sendiri; tidak ada kode yang disalin.

Bayangan: `--lift-sm` 4px (tombol), `--lift-md` 6px (panel), dan `--lift-lg` 10px (hero). Tidak boleh memakai blur atau `border-radius` pada komponen pixel. Lingkaran hanya untuk planet dekoratif.

## Komponen bersama

| Komponen | Props | Catatan |
| --- | --- | --- |
| `PixelButton` | `variant?: 'primary' \| 'ghost'`, `size?: 'md' \| 'lg'`, + semua atribut `<button>` | `type="button"` default. `lg` = tombol START. Ikon boleh di `children`. |
| `PixelPanel` | `tone?: 'lavender' \| 'pink' \| 'cream'`, `as?` | Frame bertakik, latar `--color-surface`. |
| `DialogueBox` | `speaker`, `text`, `portrait?`, `typewriter?`, `reducedMotion?`, `children` | Nameplate pink di atas kotak, potret berbingkai pink. |
| `SoundToggle` | `showVolume?`, `label?` | `label` menampilkan "Suara nyala/mati" (dipakai di boarding). |
| `SceneFrame` | `eyebrow`, `title`, `children`, `footer?` | Judul bagian: eyebrow pixel + judul Nunito + rel pink putus-putus. |
| `RouteNav` | `scenes`, `current`, `visited`, `onGo` | Rute topbar; ikon pixel per stasiun; aktif = ubin pink; titik cyan = sudah dikunjungi. |
| `PixelIcon` | `name`, `size?` (24/48), `label?` | Satu keluarga ikon: **pixelarticons** (MIT). Jangan pakai emoji/glyph untuk kontrol. |
| `PixelStarfield` | `count?`, `seed?`, `className?` | Bintang dekoratif deterministik, `aria-hidden`. |
| `AssetFallback` | `src`, `alt`, `label?`, `pixel?` | Kotak placeholder bila gambar gagal dimuat. `pixel` hanya untuk pixel art. |
| `BoardingPass` (opening) | `className?`, `stamp?`, `photo?` | Tiket "Passenger: Picuy". |

Fokus: semua kontrol memakai `outline: 3px solid var(--color-focus)` dengan offset 4px. Kontainer `tabindex="-1"` tidak diberi ring.

## Breakpoint

Mobile-first dalam desain; CSS menulis override `max-width`:

| Lebar | Perilaku |
| --- | --- |
| > 1200px | Komposisi penuh dua kolom |
| ≤ 1200px | Jarak grid hub dirapatkan |
| ≤ 900px | Satu kolom. Nav topbar pindah ke baris kedua, ikon saja. Opening disusun ulang: judul → tiket → START → teks. |
| ≤ 600px | Ukuran judul turun, tombol START full-width, kartu hub jadi daftar, footer bertumpuk |
| ≤ 390px | Pengaman 360–390px: label suara jadi ikon saja |

Tidak boleh ada scroll horizontal. Nav topbar boleh scroll di dalam dirinya sendiri, tapi pada 360px ketujuh target 44px masih muat.

## Foto dan stiker

- **Foto Pica selalu natural.** Jangan beri `image-rendering: pixelated`, filter warna permanen, distorsi, atau perubahan proporsi.
- Bingkai non-persegi wajib memakai `object-position` per foto agar wajah tidak terpotong. Nilainya disimpan di config:
  - `assets.heroPhotoPosition` = `60% 66%` (wajah di kanan-bawah crop "hood")
  - `assets.hubPhotoPosition` = `50% 38%`
- Galeri memakai foto utuh dengan `object-fit: contain` (keputusan layar fitur).
- Crop WebP 900² (`gallery[].thumb`) berpusat di wajah dan bahu.
- `image-rendering: pixelated` (kelas `img.is-pixel` / `AssetFallback pixel`) **hanya** untuk aset pixel art. Stiker Cipher adalah ilustrasi chibi halus, bukan pixel art, jadi **jangan** dipixelate.
- Stiker tidak boleh menutupi wajah, tulisan, atau tombol. Letakkan di sudut bingkai, di area caption kosong, atau bertengger di atas kartu. Beri `aria-hidden`/`alt=""` bila dekoratif.
- Dekorasi non-interaktif memakai `pointer-events: none`.
- Video mempertahankan rasio sumber 9:16.

## Motion

Microinteraction dan dekorasi memakai CSS; Anime.js v3 untuk timeline opening dan hadiah.

| Token | Nilai | Pakai |
| --- | --- | --- |
| `--dur-press` | 100ms, `steps(2)` | Tekan tombol: geser 3px, bayangan menyusut |
| `--dur-hover` | 160ms, `steps(2)` | Hover: angkat 2–3px, bayangan memanjang |
| `--dur-enter` | 320ms, ease-out | Kartu hub masuk berurutan (70ms per kartu) |
| dekoratif | 2,4–4,4s | Bintang berkedip, Cipher bertengger (`perch`) |

Aturan:

- State tekan/hover tidak mengubah ukuran layout; hanya `transform` dan `box-shadow`.
- Timeline Anime.js wajib punya cleanup, tombol skip, dan jalur reduced motion (lihat `JourneyAnimation.tsx`, `GiftReveal.tsx`).
- `prefers-reduced-motion: reduce`: konten akhir langsung tampil. Semua animasi dekoratif (bintang, Cipher, kartu masuk, caret) mati, dan hover/tekan tidak menggeser elemen.
- Confetti memakai `disableForReducedMotion` dan tidak pernah menjadi syarat untuk melanjutkan alur.

## Pola untuk layar fitur (Codex)

Pakai komponen di atas sebelum membuat yang baru:

- **Galeri**: kartu polaroid seperti `.hub-polaroid` (padding kertas, tape `.hub-polaroid__tape`, caption Nunito 800 di kertas), tombol prev/next = `PixelButton variant="ghost"` dengan `PixelIcon`.
- **Quest**: HUD progress di dalam `PixelPanel`; item = tombol berframe `--frame: var(--color-secondary)` → `--color-info` saat ditemukan (sertakan ikon `check`).
- **Video**: bingkai `PixelPanel` + marquee label pixel; jangan menutupi kontrol native.
- **Surat**: kertas `--color-paper` / `--color-paper-ink`, Nunito 18px, lebar ≤ 62ch, cap pixel kecil.
- **Finale**: `PixelButton size="lg"` untuk wish; Cipher sebagai aksen samping, bukan di atas kue/teks.

## Scroll-story (Claude, 25 Okt 2026)

Detail urutan bab, perilaku per breakpoint, dan fallback ada di `docs/SCROLL-STORYBOARD.md`. Ringkasan sistemnya:

- **Fondasi motion**: `src/story/motion/gsap.ts` mengekspor `gsap`, `ScrollTrigger`, `useGSAP`, `MQ` (`desktop` ≥900px / `mobile` <900px / `reduced`), `PIN_BUDGET`, dan hook `useScrollRefresh`.
- **Kontrak section**: `src/story/types.ts` berisi `StorySectionProps = { reducedMotion }` dan `storyRoute` (urutan anchor + pemilik).
- **CSS default = keadaan akhir animasi.** GSAP hanya menyetel state awal saat berjalan.
- **Pin**: maksimal 2 di desktop (Express memakai 1); tidak boleh ada pin di mobile atau reduced motion.
- **Posisi dasar** memakai properti CSS `translate`/`rotate` terpisah, sehingga transform milik GSAP tidak menimpanya.
- **Kelas bab Claude** (`src/styles/story-core.css`, diimpor setelah `story.css`): `hello-*` (hero), `express-*` (adegan kereta), `duo-*` (Cipher & Picuy).
- **Pola visual baru yang bisa dipakai ulang**:
  - polaroid berbingkai pixel (`.duo-photo` + `.duo-photo__img`, rasio 4:5, `object-position` dari config);
  - tape (`.duo-tape`);
  - HUD odometer + penggaris tick (`.express-hud`, `.express-ruler`);
  - planet pixel (`.express-planet`, `.hello-art__planet`).
- **Stiker**: selalu `pointer-events: none`, `alt=""`, ditempatkan di celah atau di luar foto/teks. Di mobile, stiker yang berisiko menutupi konten disembunyikan, bukan dipaksakan.

