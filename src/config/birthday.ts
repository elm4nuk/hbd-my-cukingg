// Semua konten personal terpusat di sini. Jangan mengarang fakta:
// isi yang belum diketahui ditulis sebagai placeholder [DALAM KURUNG SIKU].
import { asset } from '../lib/assets'

export type SceneId = 'opening' | 'hub' | 'gallery' | 'quest' | 'video' | 'gift' | 'finale'

/** Nama efek suara yang dikenal audio service. */
export type SfxName = 'click' | 'ticket' | 'whistle' | 'reveal'

export const birthdayConfig = {
  recipient: 'Pica',
  nickname: 'Picuy',
  sender: 'Firaz',
  title: "PICUY'S BIRTHDAY EXPRESS",
  subtitle: 'A Cipher Side Quest',
  /**
   * Tanggal ulang tahun, format 'YYYY-MM-DD' (tahun tidak dipakai untuk menghitung umur).
   * Biarkan null bila belum pasti — countdown otomatis disembunyikan.
   */
  birthDate: null as string | null,
  letter: {
    greeting: 'Untuk Pica,',
    paragraphs: [
      '[TULIS PESAN PERSONAL FIRAZ DI SINI]',
      'Semoga hari ulang tahunmu dipenuhi hal-hal yang bikin kamu senyum, dan perjalanan berikutnya membawa banyak kejutan baik.',
      'Terima kasih sudah menjadi Pica yang seru dan unik. Selamat ulang tahun, Picuy!',
    ],
    signoff: 'Dari Firaz',
  },
  /** Dialog pendek bergaya Cipher. Bukan kutipan resmi game. */
  dialogue: {
    boarding: 'Psst… ada satu tiket atas nama Picuy. Nggak boleh dijual, ya. Aku sudah cek.',
    ticket: 'Penumpang terverifikasi. Kursi paling nyaman sudah kuamankan. Gratis. Kali ini saja.',
    arrival: 'Sampai! Stasiun Ulang Tahun. Semua gerbong di sini isinya buat kamu.',
    hub: 'Pilih gerbong mana pun. Tenang, nggak ada yang dikunci… kecuali hadiahnya, sedikit.',
    hubDone: 'Semua gerbong sudah kamu jelajahi. Mau ke peron terakhir?',
    /** Section "Cipher & Picuy" (scroll-story). */
    duo: 'Hoodie kucing, ekor, cakar… lengkap. Oke, kuakui: versi Picuy saingan berat. Jangan bilang siapa-siapa.',
  },
  assets: {
    heroPhoto: asset('assets/photos/pica-cipher-01-hood.webp'),
    heroPhotoAlt: 'Pica dalam cosplay Cipher',
    /** object-position agar wajah tidak terpotong di bingkai non-persegi (wajah di kanan-bawah crop). */
    heroPhotoPosition: '60% 66%',
    hubPhoto: asset('assets/photos/pica-cipher-02-wink.webp'),
    hubPhotoAlt: 'Pica mengedipkan mata dalam cosplay Cipher',
    hubPhotoPosition: '50% 38%',
    /** Foto kedua section Cipher & Picuy (ada inset chibi Cipher di kanan atas foto sumber). */
    duoPhoto: asset('assets/photos/pica-cipher-03-paw.webp'),
    duoPhotoAlt: 'Pica berpose cakar kucing dalam cosplay Cipher',
    duoPhotoPosition: '50% 32%',
    stickers: {
      plead: asset('assets/stickers/cipher-plead.webp'),
      coin: asset('assets/stickers/cipher-coin.webp'),
      tail: asset('assets/stickers/cipher-tail.webp'),
      laugh: asset('assets/stickers/cipher-laugh.webp'),
    },
  },
  /**
   * Audio lokal. Array kosong = belum ada file → audio service memakai nada sintetis
   * yang dibuat di browser. Taruh file di public/assets/audio/ lalu isi path-nya di sini.
   */
  audio: {
    // Potongan reff pertama "Shape of My Heart" (sumber: audio/…). File berisi 48.5–71.5 s lagu asli;
    // yang diputar berulang hanya reff 0:49.83–1:09.83 (32 ketukan @95 BPM → loop mulus).
    bgm: ['assets/audio/shape-of-my-heart-reff.mp3'] as string[],
    /** Rentang loop di dalam file bgm (detik). null = putar & ulang seluruh file. */
    bgmLoop: { start: 1.326, end: 21.321 } as { start: number; end: number } | null,
    sfx: { click: [], ticket: [], whistle: [], reveal: [] } as Record<SfxName, string[]>,
  },
  // `src` = foto utuh (modal), `thumb` = potongan wajah–bahu 900×900 WebP (kartu kecil/hub).
  gallery: [
    { src: asset('assets/photos/pica-4.jpg'), thumb: asset('assets/photos/pica-cipher-01-hood.webp'), alt: 'Pica mengenakan cosplay Cipher', caption: 'Cipher mode: activated ✦', featured: true },
    { src: asset('assets/photos/pica-5.jpg'), thumb: asset('assets/photos/pica-cipher-02-wink.webp'), alt: 'Pica dalam cosplay Cipher', caption: 'Side quest, but make it stylish.', featured: true },
    { src: asset('assets/photos/pica-6.jpg'), thumb: asset('assets/photos/pica-cipher-03-paw.webp'), alt: 'Pica mengenakan kostum Cipher', caption: 'The Express found its star passenger.', featured: true },
    { src: asset('assets/photos/pica-1.jpg'), thumb: asset('assets/photos/pica-02-calm.webp'), alt: 'Potret Pica', caption: 'A little pause between adventures.', featured: false },
    { src: asset('assets/photos/pica-2.jpg'), thumb: asset('assets/photos/pica-03-paw.webp'), alt: 'Potret Pica', caption: 'Main character energy, as usual.', featured: false },
    { src: asset('assets/photos/pica-3.jpg'), thumb: asset('assets/photos/pica-01-wink.webp'), alt: 'Potret Pica', caption: 'One more snapshot for the archives.', featured: false },
  ],
  memories: [
    { id: 'memory-01', src: asset('assets/memories/memory-01.webp'), alt: 'Cuplikan kenangan Picuy 1', caption: 'Arsip Picuy / 01', aspect: '943 / 1676' },
    { id: 'memory-02', src: asset('assets/memories/memory-02.webp'), alt: 'Cuplikan kenangan Picuy 2', caption: 'Arsip Picuy / 02', aspect: '1080 / 359' },
    { id: 'memory-03', src: asset('assets/memories/memory-03.webp'), alt: 'Cuplikan kenangan Picuy 3', caption: 'Arsip Picuy / 03', aspect: '485 / 771' },
    { id: 'memory-04', src: asset('assets/memories/memory-04.webp'), alt: 'Cuplikan kenangan Picuy 4', caption: 'Arsip Picuy / 04', aspect: '1063 / 1079' },
    { id: 'memory-05', src: asset('assets/memories/memory-05.webp'), alt: 'Cuplikan kenangan Picuy 5', caption: 'Arsip Picuy / 05', aspect: '1080 / 1350' },
    { id: 'memory-06', src: asset('assets/memories/memory-06.webp'), alt: 'Cuplikan kenangan Picuy 6', caption: 'Arsip Picuy / 06', aspect: '1261 / 1247' },
  ],
  memes: [
    { id: 'meme-dahsyat', src: asset('assets/memes/meme-dahsyat.webp'), alt: 'Meme Dahsyat' },
    { id: 'meme-lumayan', src: asset('assets/memes/meme-lumayan-senang.webp'), alt: 'Meme Lumayan Senang' },
    { id: 'meme-ingfokan', src: asset('assets/memes/meme-ingfokan.webp'), alt: 'Meme Ingfokan' },
  ],
  video: {
    src: asset('assets/video/cipher-cosplay.mp4'),
    title: 'Cipher transmission: nya nya nya~',
  },
  questItems: [
    { id: 'ticket', label: 'Tiket Express', icon: '▰', reveal: asset('assets/photos/pica-02-calm.webp'), revealAlt: 'Foto Pica terbuka dari tiket' },
    { id: 'gift', label: 'Kado Pixel', icon: '◆', reveal: asset('assets/stickers/cipher-coin.webp'), revealAlt: 'Stiker Cipher terbuka dari kado' },
    { id: 'cake', label: 'Kue Bintang', icon: '♜', reveal: asset('assets/memes/meme-lumayan-senang.webp'), revealAlt: 'Meme kejutan terbuka dari kue' },
  ],
  finaleMeme: asset('assets/memes/meme-ingfokan.webp'),
} as const

export const scenes: { id: SceneId; short: string; label: string }[] = [
  { id: 'opening', short: '00', label: 'Boarding' },
  { id: 'hub', short: 'ST', label: 'Stasiun' },
  { id: 'gallery', short: '01', label: 'Kenangan' },
  { id: 'quest', short: '02', label: 'Misi' },
  { id: 'video', short: '03', label: 'Bioskop' },
  { id: 'gift', short: '04', label: 'Hadiah' },
  { id: 'finale', short: '05', label: 'Finale' },
]
