// Inventarisasi aset sumber + buat salinan web aman di public/assets/.
// File sumber TIDAK pernah diubah, dipindah, atau dihapus — hanya dibaca.
// Jalankan: npm run assets
import { readdir, readFile, mkdir, copyFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public', 'assets');

// Potongan foto ditulis dalam koordinat "tampilan" (lebar referensi `refW`),
// lalu diskalakan ke resolusi asli. Fokus: wajah–bahu, sesuai tema ulang tahun.
const PHOTOS = [
  { match: /^DZ5RbIoGFXd\.jpg$/, out: 'pica-01-wink.webp', refW: 1440, crop: [250, 120, 900, 900] },
  { match: /^DZ5RbIoGFXd \(1\)\.jpg$/, out: 'pica-02-calm.webp', refW: 1440, crop: [200, 50, 900, 900] },
  { match: /^DZ5RbIoGFXd \(2\)\.jpg$/, out: 'pica-03-paw.webp', refW: 1502, crop: [380, 80, 1020, 1020] },
  { match: /^Gimme.*# \(1\)\.jpg$/, out: 'pica-cipher-01-hood.webp', refW: 1500, crop: [150, 100, 900, 900] },
  { match: /^Gimme.*# \(2\)\.jpg$/, out: 'pica-cipher-02-wink.webp', refW: 1500, crop: [200, 20, 780, 780] },
  { match: /^Gimme.*#\.jpg$/, out: 'pica-cipher-03-paw.webp', refW: 1500, crop: [300, 100, 1100, 1100] },
];

const STICKERS = {
  '0f76bc50-5f8f-48c0-82f6-2cb4e2a46b64.png': 'cipher-plead.webp',
  '395a9588-e508-4809-889c-e6357f969e4f.png': 'cipher-coin.webp',
  '4a3b911c-b1e1-4e85-8fbb-2017e4133c0a.png': 'cipher-tail.webp',
  'bded328e-f7b1-4ada-990b-909bf42a237e.png': 'cipher-laugh.webp',
};

const MEMES = {
  '#Ikan#meme.jpg': 'meme-dahsyat.webp',
  'download (7).jpg': 'meme-lumayan-senang.webp',
  'ingfo.jpg': 'meme-ingfokan.webp',
};

const VIDEOS = [{ match: /\.mp4$/i, out: 'cipher-cosplay.mp4' }];

// --- Parser MP4 minimal: durasi (mvhd), dimensi (tkhd), codec (stsd) ---
function readBoxes(buf, start, end, cb) {
  let p = start;
  while (p + 8 <= end) {
    let size = buf.readUInt32BE(p);
    const type = buf.toString('latin1', p + 4, p + 8);
    let header = 8;
    if (size === 1) { size = Number(buf.readBigUInt64BE(p + 8)); header = 16; }
    if (size === 0) size = end - p;
    if (size < header) break;
    cb(type, p + header, p + size);
    p += size;
  }
}

function probeMp4(buf) {
  const info = { durationSec: null, tracks: [] };
  const walk = (s, e, track) => readBoxes(buf, s, e, (type, bs, be) => {
    if (['moov', 'trak', 'mdia', 'minf', 'stbl'].includes(type)) {
      const t = type === 'trak' ? {} : track;
      if (type === 'trak') info.tracks.push(t);
      walk(bs, be, t);
    } else if (type === 'mvhd') {
      const v = buf[bs];
      const scale = v === 1 ? buf.readUInt32BE(bs + 20) : buf.readUInt32BE(bs + 12);
      const dur = v === 1 ? Number(buf.readBigUInt64BE(bs + 24)) : buf.readUInt32BE(bs + 16);
      info.durationSec = +(dur / scale).toFixed(2);
    } else if (type === 'tkhd' && track) {
      track.width = buf.readUInt32BE(be - 8) >> 16;
      track.height = buf.readUInt32BE(be - 4) >> 16;
    } else if (type === 'hdlr' && track) {
      track.handler = buf.toString('latin1', bs + 8, bs + 12);
    } else if (type === 'stsd' && track) {
      track.codec = buf.toString('latin1', bs + 12, bs + 16);
    }
  });
  walk(0, buf.length, null);
  info.tracks = info.tracks.filter((t) => t.handler === 'vide' || t.handler === 'soun');
  return info;
}

async function listDir(rel) {
  try { return (await readdir(path.join(ROOT, rel))).sort(); } catch { return []; }
}

const inventory = [];
const kb = (n) => Math.round(n / 1024);

async function main() {
  for (const d of ['photos', 'memories', 'stickers', 'memes', 'video']) await mkdir(path.join(OUT, d), { recursive: true });

  for (const f of await listDir('foto pica')) {
    const src = path.join(ROOT, 'foto pica', f);
    const meta = await sharp(src).metadata();
    const rule = PHOTOS.find((r) => r.match.test(f));
    const entry = { source: `foto pica/${f}`, format: meta.format, width: meta.width, height: meta.height, sizeKB: kb((await stat(src)).size) };
    if (rule) {
      const s = meta.width / rule.refW;
      const [x, y, w, h] = rule.crop.map((v) => Math.round(v * s));
      const dest = path.join(OUT, 'photos', rule.out);
      await sharp(src).rotate().extract({ left: x, top: y, width: Math.min(w, meta.width - x), height: Math.min(h, meta.height - y) })
        .resize(900, 900, { fit: 'cover' }).webp({ quality: 84 }).toFile(dest);
      entry.web = `public/assets/photos/${rule.out}`;
      entry.webSizeKB = kb((await stat(dest)).size);
    }
    inventory.push(entry);
  }

  for (const f of await listDir('stiker chiper')) {
    const src = path.join(ROOT, 'stiker chiper', f);
    const size = (await stat(src)).size;
    let meta = {};
    try { meta = await sharp(src, { limitInputPixels: false }).metadata(); } catch (e) { meta = { format: path.extname(f).slice(1), error: String(e.message) }; }
    const entry = { source: `stiker chiper/${f}`, format: meta.format, width: meta.width, height: meta.height, hasAlpha: meta.hasAlpha, sizeKB: kb(size) };
    if (STICKERS[f]) {
      const dest = path.join(OUT, 'stickers', STICKERS[f]);
      await sharp(src).resize(512, 512, { fit: 'inside' }).webp({ quality: 88, alphaQuality: 100 }).toFile(dest);
      entry.web = `public/assets/stickers/${STICKERS[f]}`;
      entry.webSizeKB = kb((await stat(dest)).size);
    }
    inventory.push(entry);
  }

  for (const f of await listDir('stiker meme')) {
    const src = path.join(ROOT, 'stiker meme', f);
    const meta = await sharp(src).metadata();
    const entry = { source: `stiker meme/${f}`, format: meta.format, width: meta.width, height: meta.height, sizeKB: kb((await stat(src)).size) };
    if (MEMES[f]) {
      const dest = path.join(OUT, 'memes', MEMES[f]);
      await sharp(src).resize(640, 640, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest);
      entry.web = `public/assets/memes/${MEMES[f]}`;
      entry.webSizeKB = kb((await stat(dest)).size);
    }
    inventory.push(entry);
  }

  for (const [index, f] of (await listDir('kenangan picuy')).entries()) {
    const src = path.join(ROOT, 'kenangan picuy', f);
    const meta = await sharp(src).metadata();
    const out = `memory-${String(index + 1).padStart(2, '0')}.webp`;
    const dest = path.join(OUT, 'memories', out);
    await sharp(src).rotate().resize(1200, 1600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, alphaQuality: 94 }).toFile(dest);
    inventory.push({
      source: `kenangan picuy/${f}`,
      format: meta.format,
      width: meta.width,
      height: meta.height,
      hasAlpha: meta.hasAlpha,
      sizeKB: kb((await stat(src)).size),
      web: `public/assets/memories/${out}`,
      webSizeKB: kb((await stat(dest)).size),
    });
  }

  for (const f of await listDir('video chiper picuy')) {
    const src = path.join(ROOT, 'video chiper picuy', f);
    const rule = VIDEOS.find((r) => r.match.test(f));
    const buf = await readFile(src);
    const entry = { source: `video chiper picuy/${f}`, format: path.extname(f).slice(1), sizeKB: kb(buf.length), ...(rule ? probeMp4(buf) : {}) };
    if (rule) {
      // Salinan apa adanya (tanpa transcode) — disajikan dari public/, tidak masuk bundle JS.
      await copyFile(src, path.join(OUT, 'video', rule.out));
      entry.web = `public/assets/video/${rule.out}`;
    }
    inventory.push(entry);
  }

  await mkdir(path.join(ROOT, 'docs'), { recursive: true });
  await writeFile(path.join(ROOT, 'docs', 'asset-inventory.json'), JSON.stringify(inventory, null, 2) + '\n');
  console.table(inventory.map(({ source, format, width, height, sizeKB, durationSec, web }) => ({ source: source.slice(0, 48), format, width, height, sizeKB, durationSec, web: web?.replace('public/assets/', '') })));
}

main().catch((e) => { console.error(e); process.exit(1); });
