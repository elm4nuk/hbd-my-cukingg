# Handoff — Picuy's Birthday Express

Untuk: Codex (atau siapa pun yang melanjutkan fitur). Dokumen ini adalah kontrak antara fondasi dan fitur lanjutan.

## Riwayat singkat (jujur)

Design pass terbaru menyelaraskan UI dengan `firaz-portofolio.vercel.app`: deep teal, panel tenang, border tipis, aksen gold/mint, spacing lapang, dan pixel font yang dibatasi pada detail identitas. Alur dan kontrak fitur tidak berubah.

Proyek ini dikerjakan dua agen **secara bersamaan** di folder yang sama:

1. **Agen lain (kemungkinan Codex)** membuat proyek awal: React 18 + Vite 6 + TS 5.6 + Tailwind 3 + Anime.js **v3**, beserta implementasi Gallery, Quest, VideoRoom, GiftReveal, Finale, audio chime sintetis, dan progress reducer.
2. **Claude** sempat memasang React 19 / Anime.js v4 / Tailwind 4, tetapi `package.json` itu ditimpa agen lain. User memutuskan Claude **melanjutkan di atas stack yang ada**. Jadi versi terpasang adalah React 18, Anime.js 3.2, dan Tailwind 3.4. Kode Anime.js di sini memakai **sintaks v3** (`anime.timeline`, `anime.stagger`, `easing: 'easeOutQuad'`, `complete`). Jangan campur dengan sintaks v4 (`animate`, `createTimeline`, `ease`, `onComplete`).
3. Claude memindahkan komponen fitur ke `src/features/*`. Isinya dipertahankan; yang diubah hanya path import, nama ekspor, tipe `Props` yang diekspor, dan path aset ke config. Claude juga menambahkan opening perjalanan, BirthdayHub, komponen UI bersama, audio service, dan dokumentasi ini.

⚠️ Kemungkinan tumpang-tindih: `src/config/birthday.ts` ditulis ulang Claude pukul 19:24. Agen lain bisa saja mengubahnya antara 19:22 dan 19:24 (misalnya mengganti `gallery[].src` ke WebP), dan perubahan itu mungkin tertimpa. Isi versi 19:22 sudah dipertahankan seluruhnya. Mohon cek bila ada perubahan yang hilang.

## Cara menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc -b
npm run test       # vitest (6 test)
npm run build      # vite build → dist/
npm run preview    # serve dist/
npm run assets     # buat ulang salinan WebP + docs/asset-inventory.json dari folder sumber
```

## Peta file

| Lokasi | Pemilik | Isi |
| --- | --- | --- |
| `src/config/birthday.ts` | fondasi | Semua konten: nama, `birthDate` (null), surat, dialog Cipher, aset, audio, galeri, video, item quest, daftar `scenes` |
| `src/lib/progress.ts` | fondasi | `JourneyState`, `journeyReducer`, load/save/clear localStorage (aman jika storage diblokir/korup) |
| `src/lib/audio.ts` | fondasi | `audioService` (Howler) + hook `useAudioState()` |
| `src/lib/assets.ts` | fondasi | `asset(path)` → path publik yang aman untuk subpath |
| `src/lib/birthday-date.ts` | fondasi | `getBirthdayCountdown()` — null bila tanggal kosong |
| `src/lib/useReducedMotion.ts` | fondasi | hook `prefers-reduced-motion` |
| `src/components/` | fondasi | `PixelButton`, `SceneFrame`, `PixelPanel`, `DialogueBox`, `SoundToggle`, `AssetFallback` |
| `src/features/opening/` | fondasi | `OpeningSequence` → `BoardingScreen` → `JourneyAnimation` (+ `PixelTrain`) |
| `src/features/hub/` | fondasi | `BirthdayHub` |
| `src/features/memory-gallery/` | **fitur** | `MemoryGallery` |
| `src/features/quest/` | **fitur** | `BirthdayQuest` |
| `src/features/video-room/` | **fitur** | `VideoRoom` |
| `src/features/gift/` | **fitur** | `GiftReveal` |
| `src/features/finale/` | **fitur** | `BirthdayFinale` |
| `src/styles.css` | fitur (asal agen lain) | Gaya global + semua fitur lanjutan |
| `src/styles/foundation.css` | fondasi | Token desain, frame pixel, komponen bersama, opening, hub (lihat `docs/DESIGN-SYSTEM.md`) |
| `src/styles/features.css` | **fitur** | Styling layar Gallery, Quest, Video, Gift/Surat, Finale (diimpor setelah fondasi) |

Fitur lanjutan bisa dikerjakan di direktori `src/features/<fitur>/` tanpa menyentuh fondasi.

## Kontrak state dan navigasi

```ts
type SceneId = 'opening' | 'hub' | 'gallery' | 'quest' | 'video' | 'gift' | 'finale'

type JourneyState = {
  scene: SceneId
  visited: SceneId[]   // otomatis diisi saat GO; hub memakai ini untuk tanda ✓
  found: string[]      // id questItems yang sudah ditemukan
  giftOpened: boolean
  wishMade: boolean
}

type JourneyAction =
  | { type: 'GO'; scene: SceneId }
  | { type: 'FIND'; id: string }
  | { type: 'OPEN_GIFT' }
  | { type: 'MAKE_WISH' }
  | { type: 'RESET' }
```

- State dipegang `useReducer` di `src/App.tsx` dan disimpan ke `localStorage['picuy-birthday-progress-v1']` setiap kali berubah. Nilai yang korup diabaikan.
- Navigasi hanya lewat `dispatch({ type: 'GO', scene })`. Fitur **tidak** memanggil dispatch langsung; App meneruskan callback (`onNext`, `onSkip`, dst.).
- Alur default: opening → hub → (Kenangan → Misi → Bioskop → Hadiah → Finale). Hub bisa membuka gerbong mana pun. Brand "PICUY EXPRESS" di topbar kembali ke hub, dan topbar nav melompat ke scene mana pun.
- Reset: tombol "Reset progress" di hub (konfirmasi 2 langkah, tanpa `window.confirm`) dan "Ulangi perjalanan" di finale. Keduanya memanggil `clearJourney()` + `RESET`. Preferensi suara **tidak** ikut di-reset.
- Menambah state baru: tambah field ke `JourneyState` + `initialJourney`, tambah action, validasi di `loadJourney()`, lalu tambah test di `progress.test.ts`.

## Props komponen lanjutan (sumber kebenaran: tipe yang diekspor di masing-masing file)

```ts
MemoryGalleryProps  = { onNext(): void }
BirthdayQuestProps  = { found: string[]; onFind(id: string): void; onNext(): void; onSkip(): void }
VideoRoomProps      = { onNext(): void }
GiftRevealProps     = { alreadyOpened: boolean; reducedMotion: boolean; onOpen(): void; onNext(): void }
BirthdayFinaleProps = { wishMade: boolean; reducedMotion: boolean; onWish(): void; onGallery(): void; onRestart(): void }
// fondasi
BirthdayHubProps    = { journey: JourneyState; reducedMotion: boolean; onNavigate(scene: SceneId): void; onReset(): void }
OpeningSequenceProps = { reducedMotion: boolean; onComplete(): void }
```

Kalau fitur butuh prop baru (mis. `onBackToHub`), tambahkan ke tipe Props di file fitur lalu sambungkan di `App.tsx`. Perubahan di `App.tsx` cukup satu baris.

## API audio

```ts
import { audioService, useAudioState } from '../../lib/audio'

audioService.unlock()            // panggil di handler klik/tap pertama; memulai BGM jika enabled
audioService.playSfx('click' | 'ticket' | 'whistle' | 'reveal')  // no-op bila belum unlock/dimatikan
audioService.setEnabled(bool) / toggle()
audioService.setVolume(0..1)
audioService.pause() / resume()  // App sudah memanggil ini saat tab disembunyikan
const { enabled, volume, unlocked } = useAudioState()
```

- Tidak ada bunyi sebelum ada gesture pengguna. Opening memanggil `unlock()` dari tombol "Mulai perjalanan" atau "Lewati opening".
- Preferensi `{ enabled, volume }` disimpan di `localStorage['picuy-birthday-sound-v1']` (default: enabled, 0.35).
- File lokal diambil dari `birthdayConfig.audio`. Saat ini kosong, jadi dipakai nada sintetis. File yang gagal dimuat otomatis jatuh ke nada sintetis tanpa error. Daftar file yang dibutuhkan ada di `docs/ASSETS.md`.
- Untuk SFX baru: tambah nama ke `SfxName` (config), `audio.sfx`, dan `synth` di `audio.ts`.

## Komponen UI bersama

- `PixelButton` — `variant: 'primary' | 'ghost'`, plus semua atribut `<button>`.
- `PixelPanel` — `tone: 'lavender' | 'pink' | 'cream'`, `as: 'section' | 'div' | 'article' | 'aside'`.
- `DialogueBox` — `speaker`, `text`, `portrait?`, `typewriter?`, `reducedMotion?`, `children` (tombol aksi). Tap teks untuk melewati efek ketik; teks lengkap selalu tersedia untuk pembaca layar.
- `SoundToggle` — `showVolume?`.
- `AssetFallback` — pengganti `<img>`: bila gagal dimuat, tampil kotak placeholder dan alur tidak terblokir. Prop `pixel` hanya untuk pixel art (`image-rendering: pixelated`). **Jangan dipakai untuk foto.**
- Token warna di `src/styles/foundation.css`: `--navy #14162E`, `--panel #292044`, `--lavender #BEA0FF`, `--pink #F18AC8`, `--cream #FFF1D6`. Cyan/emas hanya untuk aksen kecil.

## Opening

- Boarding (`BoardingScreen`): tombol "Mulai perjalanan" + "Lewati opening".
- `JourneyAnimation` (Anime.js v3 timeline, ±8,4 dtk + jeda 0,9 dtk): bintang pixel → tiket "Passenger: Picuy" + stempel → kereta pixel (SVG `crispEdges`) melaju dan berhenti → papan "Stasiun Ulang Tahun" + Cipher + dialog → hub.
- Tombol "Lewati ›" selalu ada. Ada timeout pengaman 12 dtk agar alur tetap lanjut walau timeline macet. Gambar memakai `AssetFallback`, dan audio tidak pernah ditunggu.
- Reduced motion: tidak ada animasi; semua elemen tampil statis dengan tombol "Masuk stasiun →".
- Referensi YouTube `Pz7Tu25EyXI`: hanya metadata yang bisa diakses ("Honkai Star Rail - Main Loading Screen [Live Wallpaper] / OST"). Isi videonya **tidak** ditonton, jadi opening memakai interpretasi dari brief (langit bintang → tiket → kereta → stasiun). Tidak ada embed YouTube.

## Status

### Selesai dan terverifikasi

- `npm run typecheck`, `npm run test` (6/6), `npm run build` lulus.
- QA otomatis dengan Playwright + Chrome headless pada build produksi:
  - 390×844 (HP) dan 1440×900: boarding → perjalanan → hub dalam ±9,7–10,1 dtk (termasuk jeda screenshot), tanpa error JS, tanpa scroll horizontal.
  - 360×740 dengan reduced motion: tampilan statis → "Masuk stasiun" → hub.
  - 1280×720: tombol Lewati → hub dalam ±1,8 dtk.
  - Hub → Kenangan → kembali via brand → status "✓ Sudah dilihat" muncul. Reload tetap di hub (progress tersimpan), dan reset 2 langkah kembali ke boarding.
- Screenshot QA diperiksa manual: tombol mulai terlihat tanpa scroll di HP, dan tidak ada elemen yang bertumpuk.

### Belum diverifikasi

- Bunyi audio yang sebenarnya (headless tidak bisa mendengar); hanya dipastikan tidak ada error.
- Perangkat sentuh fisik / iOS Safari.
- Fitur lanjutan (Gallery, Quest, Video, Gift, Finale) belum di-QA visual oleh Claude, karena itu domain fitur.

### Sisa pekerjaan (untuk Codex / Firaz)

1. **Firaz:** isi paragraf surat `[TULIS PESAN PERSONAL FIRAZ DI SINI]` dan `birthDate` jika ingin countdown. Jangan isi umur atau fakta yang tidak pasti.
2. **Gallery:** putuskan apakah kartu carousel memakai `thumb` (WebP 900², ringan, crop wajah) atau `src` (JPG utuh). Saat ini kartu memakai `src`; modal sebaiknya tetap memakai `src`.
3. Path absolut `/assets/...` masih ada di `src/styles.css` (poster Video Room). Ini rusak jika di-deploy di subpath; ganti dengan `asset()`/import.
4. Hapus salinan aset yang tidak dipakai (lihat `docs/ASSETS.md`) bila disetujui, karena menghemat ±12 MB di `dist/`.
5. Tambahkan file audio berlisensi bila ada (lihat `docs/ASSETS.md`).
6. Opsional: tombol "← Stasiun" di `SceneFrame` setiap fitur. Saat ini kembali ke hub lewat brand/topbar.
7. QA visual fitur lanjutan pada 360/390/768/1440 + reduced motion.

## Deploy

`npm run build`, lalu deploy isi `dist/` sebagai website statis (`base: './'`). Situs belum dipublikasikan ke mana pun.
