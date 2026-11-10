// Screenshot and sanity-check the hub page in headless Chrome.
//
//   npm run build && npm run preview -- --port 4173 --strictPort &
//   node tools/check-page.mjs http://localhost:4173/games/ shots
//
// Writes desktop (1280×800) and phone (390×844) screenshots, plus hover and
// keyboard-focus states, into the output folder. Exits with 1 if a check
// fails: horizontal scroll, nested links, a broken cover image, a card that
// doesn't open its game when clicked, or a Source link covered by the card.
// Uses Chrome's DevTools protocol directly (Node 22+, no dependencies).
// Set CHROME to the browser binary if `google-chrome` isn't on PATH.
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [url = 'http://localhost:4173/games/', outDir = 'shots'] = process.argv.slice(2)
mkdirSync(outDir, { recursive: true })
const profile = mkdtempSync(join(tmpdir(), 'games-hub-chrome-'))
const chrome = spawn(process.env.CHROME || 'google-chrome', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--hide-scrollbars', `--user-data-dir=${profile}`, '--remote-debugging-port=0', 'about:blank',
], { stdio: 'ignore' })

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const failures = []
const check = (ok, message) => { if (!ok) failures.push(message) }

let ws
try {
  let port
  for (let i = 0; i < 100 && !port; i++) {
    await sleep(100)
    const file = join(profile, 'DevToolsActivePort')
    if (existsSync(file)) port = readFileSync(file, 'utf8').split('\n')[0]
  }
  if (!port) throw new Error('Chrome did not start')
  const target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page')
  ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve) => ws.addEventListener('open', resolve))
  let nextId = 0
  const pending = new Map()
  const errors = []
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data)
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
    else if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.text)
    else if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') errors.push(msg.params.entry.text)
  })
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = ++nextId
    pending.set(id, resolve)
    ws.send(JSON.stringify({ id, method, params }))
  })
  const evaluate = async (expression) => {
    const { result } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
    if (result.exceptionDetails) {
      throw new Error(`in page at ${url}: ${result.exceptionDetails.exception?.description?.split('\n')[0] ?? result.exceptionDetails.text}`)
    }
    return result.result.value
  }
  const screenshot = async (name, fullPage = false) => {
    const params = { format: 'png' }
    if (fullPage) {
      const size = await evaluate('[innerWidth, document.documentElement.scrollHeight]')
      Object.assign(params, { captureBeyondViewport: true, clip: { x: 0, y: 0, width: size[0], height: size[1], scale: 1 } })
    }
    const shot = await send('Page.captureScreenshot', params)
    writeFileSync(join(outDir, `${name}.png`), Buffer.from(shot.result.data, 'base64'))
  }
  const load = async () => {
    await send('Page.navigate', { url })
    await sleep(500)
    await evaluate('document.fonts.ready.then(() => Promise.all([...document.images].map((i) => i.decode().catch(() => null))))')
    await sleep(300)
  }
  const pressTab = async () => {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
  }

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Log.enable')

  for (const [name, width, height, scale, mobile] of [['desktop', 1280, 800, 1, false], ['phone', 390, 844, 3, true]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile })
    await send('Emulation.setTouchEmulationEnabled', { enabled: mobile })
    await load()
    // Scroll each card into view before hit-testing, since elementFromPoint
    // only sees the viewport.
    const report = await evaluate(`(async () => {
      const linkAt = (x, y) => { const el = document.elementFromPoint(x, y); const a = el && el.closest('a'); return a ? a.getAttribute('href') : null }
      const cards = []
      for (const card of document.querySelectorAll('.game-card')) {
        card.scrollIntoView({ block: 'center' })
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
        const box = (sel) => card.querySelector(sel).getBoundingClientRect()
        const mid = (r) => [r.left + r.width / 2, r.top + r.height / 2]
        const cover = box('.game-cover'), pitch = box('.game-pitch'), source = box('.game-source'), play = box('.game-play')
        const img = card.querySelector('img')
        cards.push({
          title: card.querySelector('.game-title').textContent,
          size: Math.round(card.getBoundingClientRect().width) + 'x' + Math.round(card.getBoundingClientRect().height),
          play: card.querySelector('.game-play').getAttribute('href'),
          source: card.querySelector('.game-source').getAttribute('href'),
          coverHit: linkAt(...mid(cover)), pitchHit: linkAt(pitch.left + 4, pitch.top + 4), sourceHit: linkAt(...mid(source)),
          image: img.naturalWidth + 'x' + img.naturalHeight + ' shown ' + Math.round(cover.width) + 'x' + Math.round(cover.height),
          targets: Math.round(play.height) + '/' + Math.round(source.height),
        })
      }
      window.scrollTo(0, 0)
      const firstPlay = document.querySelector('.game-play').getBoundingClientRect()
      const page = document.querySelector('.page').getBoundingClientRect()
      return {
        scrollWidth: document.documentElement.scrollWidth, innerWidth, pageHeight: document.documentElement.scrollHeight,
        gutters: [Math.round(page.left), Math.round(innerWidth - page.right)],
        nestedLinks: document.querySelectorAll('a a').length,
        firstPlayBottom: Math.round(firstPlay.bottom),
        backLink: document.querySelector('.back-link').getAttribute('href'),
        cards,
      }
    })()`)
    console.log(`${name} ${width}x${height}: page ${report.innerWidth}x${report.pageHeight}, gutters ${report.gutters.join('/')}, first Play button bottom at y=${report.firstPlayBottom}`)
    check(report.scrollWidth <= report.innerWidth, `${name}: horizontal scroll (${report.scrollWidth} > ${report.innerWidth})`)
    check(report.nestedLinks === 0, `${name}: nested links`)
    check(report.backLink === 'https://andre-larsson.github.io/', `${name}: back link is ${report.backLink}`)
    check(report.cards.length > 0, `${name}: no game cards`)
    for (const card of report.cards) {
      console.log(`  ${card.title}: card ${card.size}, cover ${card.image}, Play/Source height ${card.targets}`)
      check(!card.image.startsWith('0x'), `${name}: ${card.title} cover did not load`)
      check(card.coverHit === card.play, `${name}: ${card.title} cover opens ${card.coverHit}, not ${card.play}`)
      check(card.pitchHit === card.play, `${name}: ${card.title} pitch opens ${card.pitchHit}, not ${card.play}`)
      check(card.sourceHit === card.source, `${name}: ${card.title} Source opens ${card.sourceHit}, not ${card.source}`)
    }
    await screenshot(`${name}-viewport`)
    await screenshot(`${name}-full`, true)
  }

  // Desktop hover and keyboard focus (Tab: back link, then the first Play).
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false })
  await send('Emulation.setTouchEmulationEnabled', { enabled: false })
  await load()
  const point = await evaluate(`(() => { const r = document.querySelector('.game-cover').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } })()`)
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: point.x, y: point.y })
  await sleep(500)
  await screenshot('desktop-hover')
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 2, y: 2 })
  await pressTab()
  await pressTab()
  await sleep(400)
  const focused = await evaluate('document.activeElement.className')
  check(focused === 'game-play', `second Tab focuses "${focused}", expected the first Play link`)
  await screenshot('desktop-focus')

  check(errors.length === 0, `console errors: ${errors.join(' | ')}`)
} catch (error) {
  failures.push(String(error))
} finally {
  ws?.close()
  chrome.kill('SIGTERM')
  await sleep(300)
  rmSync(profile, { recursive: true, force: true })
}

console.log(failures.length ? `FAIL\n- ${failures.join('\n- ')}` : `OK, screenshots in ${outDir}/`)
process.exit(failures.length ? 1 : 0)
