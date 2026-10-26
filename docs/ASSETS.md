# Asset manifest

Folder sumber (`foto pica`, `stiker chiper`, `stiker meme`, `video chiper picuy`) **tidak pernah diubah, dipindah, atau dihapus**. Semua media web adalah salinan di `public/assets/`, disajikan sebagai file statis dan tidak masuk bundle JavaScript.

- Inventaris mentah (dimensi, ukuran, durasi): `docs/asset-inventory.json`
- Script pembuat salinan WebP dan inventaris: `npm run assets` (`scripts/prepare-assets.mjs`, memakai `sharp`; hanya membaca file sumber)
- Path di kode selalu lewat `asset()` (`src/lib/assets.ts`) agar tetap benar saat deploy di subpath.

## Inventaris sumber

| Sumber | Format | Dimensi | Ukuran | Isi (hasil dilihat) |
| --- | --- | --- | --- | --- |
| `foto pica/DZ5RbIoGFXd.jpg` | JPEG | 1440×1917 | 178 KB | Selfie Pica, kedip, filter kuping kucing |
| `foto pica/DZ5RbIoGFXd (1).jpg` | JPEG | 1440×1917 | 189 KB | Selfie Pica, melirik ke bawah |
| `foto pica/DZ5RbIoGFXd (2).jpg` | JPEG | 2160×2876 | 344 KB | Selfie Pica, pose "paw" |
| `foto pica/Gimme your money…# (1).jpg` | JPEG | 2160×2880 | 526 KB | Cosplay Cipher (hood), ada inset ilustrasi Cipher kanan atas |
| `foto pica/Gimme your money…# (2).jpg` | JPEG | 2304×3072 | 516 KB | Cosplay Cipher berdiri, kedip, inset ilustrasi kanan bawah |
| `foto pica/Gimme your money…#.jpg` | JPEG | 2160×2880 | 439 KB | Cosplay Cipher pose cakar, inset chibi kanan atas |
| `stiker chiper/0f76bc50-….png` | PNG + alpha | 1254×1254 | 1,3 MB | Chibi Cipher memelas |
| `stiker chiper/395a9588-….png` | PNG + alpha | 1254×1254 | 1,5 MB | Chibi Cipher + koin |
| `stiker chiper/4a3b911c-….png` | PNG + alpha | 1254×1254 | 1,1 MB | Chibi Cipher menggigit ekor |
| `stiker chiper/bded328e-….png` | PNG + alpha | 1254×1254 | 1,3 MB | Chibi Cipher tertawa (gaya flat) |
| `stiker chiper/cipher-01…04.svg` | SVG | 1200×1200 | 0,8–1,5 MB | Hasil auto-trace (VTracer) — berat, tidak dipakai |
| `stiker meme/#Ikan#meme.jpg` | JPEG | 735×697 | 70 KB | Meme "DAHSYAT" |
| `stiker meme/download (7).jpg` | JPEG | 536×572 | 29 KB | Meme "LUMAYAN SENANG" |
| `stiker meme/ingfo.jpg` | JPEG | 720×699 | 70 KB | Meme "INGFOKAN" |
| `video chiper picuy/Nya nya nya~#cipher….mp4` | MP4 (H.264 `avc1` + AAC `mp4a`) | 720×1280 (9:16) | 2,6 MB | 11,19 detik |

Stiker Cipher adalah ilustrasi chibi halus, **bukan** pixel art → tidak diberi `image-rendering: pixelated`. Foto Pica juga tidak dipixelate.

## Salinan web dan pemakaiannya

| Aset web | Sumber | Dipakai di |
| --- | --- | --- |
| `photos/pica-cipher-01-hood.webp` (900², 48 KB) | `Gimme…# (1).jpg`, crop wajah–bahu | Boarding hero (`assets.heroPhoto`), `gallery[0].thumb` |
| `photos/pica-cipher-02-wink.webp` | `Gimme…# (2).jpg`, crop | `gallery[1].thumb` |
| `photos/pica-cipher-03-paw.webp` | `Gimme…#.jpg`, crop (inset chibi ikut terlihat) | `gallery[2].thumb`, poster tombol play Video Room (CSS) |
| `photos/pica-01-wink.webp`, `pica-02-calm.webp`, `pica-03-paw.webp` | `DZ5RbIoGFXd*.jpg`, crop | `gallery[3–5].thumb`, reveal quest "Tiket Express" (`pica-02-calm`) |
| `photos/pica-1.jpg`…`pica-6.jpg` | salinan utuh JPG (dibuat agen lain) | `gallery[].src` — kartu carousel + modal foto penuh |
| `stickers/cipher-coin.webp` | `395a9588….png` | Boarding hero, reveal quest "Kado Pixel" |
| `stickers/cipher-laugh.webp` | `bded328e….png` | Opening (stasiun), Hub |
| `stickers/cipher-plead.webp` | `0f76bc50….png` | Potret DialogueBox di opening |
| `stickers/cipher-tail.webp` | `4a3b911c….png` | Potret DialogueBox di hub, kartu Gift Reveal |
| `memes/meme-lumayan-senang.webp` | `download (7).jpg` | Reveal quest "Kue Bintang" |
| `memes/meme-ingfokan.webp` | `ingfo.jpg` | Bonus meme di Finale |
| `memes/meme-dahsyat.webp` | `#Ikan#meme.jpg` | Belum dipakai — tersedia untuk fitur lanjutan |
| `video/cipher-cosplay.mp4` | MP4 sumber, tanpa transcode | Video Room (`video.src`) |

Crop foto web sengaja dibuat di sekitar wajah–bahu, supaya fokus ke ekspresi dan kostum. Foto utuh tetap tersedia di modal galeri lewat JPG.

## Salinan yang tidak dipakai (kandidat pembersihan)

Salinan ini dibuat lebih awal oleh agen lain dan tidak lagi direferensikan kode. Semuanya masuk ke `dist/` (±12 MB). Belum dihapus karena bukan buatan Claude; hapus jika sudah disetujui:

- `public/assets/stickers/cipher-1.png`…`cipher-4.png` (±5,3 MB, digantikan WebP)
- `public/assets/stickers/cipher-line-1.svg`…`cipher-line-4.svg` (±4,2 MB)
- `public/assets/memes/meme-1.jpg`…`meme-3.jpg` (digantikan WebP)

## Audio

**Musik latar (26 Okt 2026):** sumber `audio/Backstreet Boys - Shape Of My Heart (Official HD Video) - BackstreetBoysVEVO.mp3` (9,2 MB, 3:49, 48 kHz 320 kbps; tidak diubah).

- **Salinan web:** `public/assets/audio/shape-of-my-heart-reff.mp3`, berukuran 0,9 MB dan berdurasi 23 dtk. File ini dipotong per-frame dari detik 48,5–71,5 lagu asli tanpa re-encode.
- **Bagian yang diputar:** hanya reff pertama, yaitu 0:49.83–1:09.83 lagu asli (32 ketukan pada 95 BPM). Di dalam file potongan, rentangnya `birthdayConfig.audio.bgmLoop = { start: 1.326, end: 21.321 }`.
- **Cara loop:** loop dijalankan sebagai sprite Howler lewat Web Audio, jadi sambungannya presisi ke sampel dan tanpa jeda. Musik masuk dengan fade-in 0,9 dtk.
- **Kapan berbunyi:** musik hanya mulai setelah tombol "Putar musik" ditekan.
- **Hak cipta:** lagu ini komersial, jadi aman untuk link pribadi ke Pica. Jangan dipublikasikan terbuka.

SFX belum ada file aslinya, jadi audio service memakai nada sintetis yang dibuat di browser. Untuk memakai SFX asli, taruh file berlisensi di `public/assets/audio/` lalu isi `birthdayConfig.audio`:

| Kunci | Kebutuhan | Saran |
| --- | --- | --- |
| `audio.bgm` | Musik latar loop, lembut, ±60–120 detik | `bgm.mp3` + `bgm.ogg` (≤1,5 MB) |
| `audio.sfx.click` | Klik tombol | ≤0,2 dtk |
| `audio.sfx.ticket` | Stempel tiket | ≤0,4 dtk |
| `audio.sfx.whistle` | Peluit kereta | ≤1 dtk |
| `audio.sfx.reveal` | Kilau / reveal | ≤1 dtk |

Jangan memakai OST Honkai: Star Rail tanpa izin; gunakan musik bebas lisensi atau buatan sendiri.

## `kenangan picuy/` (ditambahkan user 19:43–19:45)

Semua sudah dilihat. Sejak integrasi scroll-story 25 Oktober 2026, keenam file dipakai sebagai kartu arsip di galeri dan disalin oleh `npm run assets` ke `public/assets/memories/memory-01.webp`…`memory-06.webp`. Sumber asli tetap tidak diubah. Caption UI sengaja netral (`Arsip Picuy / 01` dst.) agar tidak mengarang peristiwa atau tanggal.

| Sumber | Format | Dimensi | Ukuran | Isi |
| --- | --- | --- | --- | --- |
| `content.png` | PNG | 1261×1247 | 2,4 MB | Rak plat nama "Washington", dengan plat "Pica Skibidi" dan caption meme "Who the hell is named James?" |
| `Group_12.png` | PNG + alpha | 943×1676 | 1,4 MB | Screenshot chat WhatsApp: foto Pica berhoodie kucing, diikuti lelucon "Kamu sodaraan ama hitler yah" |
| `Group_25_2.png` | PNG | 1080×359 | 93 KB | Komentar Facebook akun "Picaa Skibidi" berbahasa Ibrani |
| `Group_29.png` | PNG | 485×771 | 328 KB | Screenshot TikTok Pica berhelm, teks "OTW Yerusalem", peta Israel/Yerusalem, wajah meme |
| `Project_Name_15.png` | PNG | 1063×1079 | 338 KB | DM Instagram dari orang lain yang menanyakan photopack Pica (cosplay gaun biru); foto profil pengirim terlihat |
| `Project_Name_24.png` | PNG + alpha | 1080×1350 | 639 KB | Tiruan DM akun "MBG" (logo Badan Gizi Nasional) meminta nomor Pica + teks "TAIK GUE HARUS BALES APA CUK DAH LAH" |

⚠️ **Tinjau bersama Firaz sebelum ditampilkan.** Beberapa file memuat:

- lelucon sensitif (Hitler, geopolitik Israel/Yerusalem);
- umpatan;
- logo lembaga pemerintah pada DM tiruan;
- wajah dan nama orang ketiga di screenshot chat/DM.

Hanya pakai file yang memang disetujui sebagai inside joke yang aman untuk Pica. Pertimbangkan juga untuk mengaburkan wajah/nama orang lain.

Aturan visual bila dipakai: tampilkan utuh (`object-fit: contain`) dalam kartu scrapbook, tanpa pixelate, dengan caption di luar gambar. Ukuran file besar (sampai 2,4 MB), jadi buat salinan WebP ≤1200px lewat `scripts/prepare-assets.mjs`.
