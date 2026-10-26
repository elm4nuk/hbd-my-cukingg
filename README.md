# Picuy's Birthday Express — A Cipher Side Quest

Website ulang tahun interaktif untuk Pica (Picuy) dari Firaz, dengan tema pixel art, Honkai: Star Rail, dan Cipher.

Stack: React 18 · Vite 6 · TypeScript 5.6 · Tailwind CSS 3 · Anime.js 3 · Canvas Confetti · Howler.js · Embla Carousel.

## Menjalankan

```bash
npm install
npm run dev          # buka http://localhost:5173
```

Pemeriksaan sebelum deploy:

```bash
npm run typecheck
npm run test
npm run build        # hasil di dist/
npm run preview      # cek hasil build
```

`dist/` bisa di-host di static hosting mana pun. Vite memakai `base: './'`.

## Mengganti isi personal

Semua konten ada di `src/config/birthday.ts`:

- `letter.paragraphs`: ganti `[TULIS PESAN PERSONAL FIRAZ DI SINI]` sebelum situs diberikan ke Pica.
- `birthDate`: isi `'MM-DD'` atau `'YYYY-MM-DD'` agar countdown muncul di hub. Biarkan `null` untuk menyembunyikannya. Umur tidak pernah ditampilkan.
- `dialogue`, `gallery[].caption`, `questItems`: teks dan aset.
- `audio`: path musik/SFX lokal (opsional; tanpa file, situs memakai nada sintetis).

## Alur

Boarding ("Mulai perjalanan") → animasi perjalanan (tiket → kereta → stasiun, bisa dilewati, statis untuk reduced motion) → **Stasiun / BirthdayHub** → Kenangan · Misi · Bioskop · Hadiah → Finale.

Progress dan preferensi suara disimpan di `localStorage` jika tersedia. Reset ada di hub dan finale.

## Aset

Folder sumber tidak diubah. Salinan web ada di `public/assets/`; daftar lengkapnya di `docs/ASSETS.md`. Untuk membuat ulang salinan WebP, jalankan `npm run assets`.

## Untuk developer

Kontrak state, props, audio API, dan sisa pekerjaan: `docs/HANDOFF.md`.
