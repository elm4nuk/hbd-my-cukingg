import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const debugPort = 9333
const baseUrl = process.argv[2] || 'http://127.0.0.1:4173/'
const outputDir = path.resolve('docs/screenshots/cartoon-pass')
const profile = await mkdtemp(path.join(os.tmpdir(), 'picuy-qa-'))
await mkdir(outputDir, { recursive: true })

const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' })

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let socket
let serial = 0
const pending = new Map()
const events = []

async function waitForChrome() {
  for (let i = 0; i < 60; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`)
      if (response.ok) return
    } catch {}
    await sleep(100)
  }
  throw new Error('Chrome debugging endpoint did not start')
}

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++serial
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function connect() {
  await waitForChrome()
  const created = await fetch(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' }).then(r => r.json())
  socket = new WebSocket(created.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })
  socket.onmessage = event => {
    const message = JSON.parse(event.data)
    if (message.id) {
      const call = pending.get(message.id)
      if (!call) return
      pending.delete(message.id)
      return message.error ? call.reject(new Error(message.error.message)) : call.resolve(message.result)
    }
    if (message.method === 'Runtime.exceptionThrown') events.push(message.params.exceptionDetails.text)
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') events.push(message.params.entry.text)
  }
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Log.enable')
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  return result.result.value
}

async function navigate(width, height, reducedMotion = false) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 700 })
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reducedMotion ? 'reduce' : 'no-preference' }] })
  await send('Page.navigate', { url: `${baseUrl}?qa=${width}-${height}-${reducedMotion}` })
  await sleep(1400)
  await evaluate('document.fonts.ready.then(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))')
}

async function screenshot(name, selector = null) {
  if (selector) {
    await evaluate(`(() => {
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({block:'start', behavior:'instant'});
      root.style.scrollBehavior = previous;
    })()`)
  }
  await sleep(700)
  await evaluate(`Promise.all([...document.querySelectorAll('img')].filter(img => {
    const r = img.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight;
  }).map(img => img.decode?.().catch(() => {}) ?? Promise.resolve()))`)
  const { data } = await send('Page.captureScreenshot', { format: 'png', fromSurface: true })
  await writeFile(path.join(outputDir, name), Buffer.from(data, 'base64'))
}

await connect()
const results = []
for (const [width, height] of [[360, 740], [390, 844], [768, 1024], [844, 390], [1440, 900]]) {
  await navigate(width, height)
  const metrics = await evaluate(`(() => ({
    width: innerWidth,
    docWidth: document.documentElement.scrollWidth,
    bodyHeight: document.body.scrollHeight,
    sectionIds: [...document.querySelectorAll('main section[id]')].map(el => el.id),
    letterVisible: (() => { const r = document.querySelector('.letter-panel')?.getBoundingClientRect(); return !!r && r.height > 200 })(),
    videoPaused: document.querySelector('video')?.paused,
    focusables: document.querySelectorAll('a[href],button:not([disabled]),video[controls]').length,
  }))()`)
  results.push({ viewport: `${width}x${height}`, ...metrics })
  await screenshot(`${width}-top.png`)
  if (width === 390) {
    await screenshot('390-gallery.png', '#memories')
    await screenshot('390-letter.png', '#letter')
    await screenshot('390-letter-body.png', '.letter-panel')
    await screenshot('390-finale.png', '#finale')
  }
  if (width === 1440) {
    await screenshot('1440-express.png', '#express')
    await screenshot('1440-cipher.png', '#cipher')
    await screenshot('1440-gallery.png', '#memories')
    await screenshot('1440-video.png', '#video')
    await screenshot('1440-letter.png', '#letter')
    await screenshot('1440-letter-body.png', '.letter-panel')
    await screenshot('1440-finale.png', '#finale')
  }
}

await navigate(390, 844, true)
const reduced = await evaluate(`(() => ({
  motion: matchMedia('(prefers-reduced-motion: reduce)').matches,
  envelopeTransform: getComputedStyle(document.querySelector('.envelope-flap')).transform,
  hiddenCards: [...document.querySelectorAll('.scrap-card')].filter(el => getComputedStyle(el).opacity === '0').length,
  videoPaused: document.querySelector('video')?.paused,
}))()`)
await screenshot('390-reduced-letter.png', '#letter')
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
const keyboard = await evaluate(`({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim(), href: document.activeElement?.getAttribute?.('href') })`)
await evaluate(`(() => { const video = document.querySelector('video'); video?.dispatchEvent(new Event('error', { bubbles: true })); })()`)
await sleep(100)
const failurePath = await evaluate(`({ videoFallback: !!document.querySelector('.video-fallback'), finaleReachable: !!document.querySelector('#finale') })`)

console.log(JSON.stringify({ results, reduced, keyboard, failurePath, errors: events }, null, 2))
socket.close()
chrome.kill()
await sleep(500)
await rm(profile, { recursive: true, force: true }).catch(() => {})
