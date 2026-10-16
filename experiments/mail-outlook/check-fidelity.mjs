// Fidelity checks for the Outlook Online reference composition — measured,
// not eyeballed: launches Chromium (already a sure-ui devDependency, same
// browsers as experiments/browser-qa), asserts the Track-B2 fidelity targets
// against computed styles, verifies the two-line row geometry and the
// hover-only actions reveal, then writes docs/fidelity/outlook-list.png and
// docs/fidelity/outlook-thread.png.
//
//   node experiments/mail-outlook/build.mjs && node experiments/mail-outlook/check-fidelity.mjs
//
// Not part of `npm test`: CI installs no browser for this repo (see
// .github/workflows/ci.yml), so it stays a manual/runbook gate — the unit
// gates in src/mail.test.ts own the CSS itself.
import { chromium } from '@playwright/test'
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname, normalize } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const shotList = join(here, '..', '..', 'docs', 'fidelity', 'outlook-list.png')
const shotThread = join(here, '..', '..', 'docs', 'fidelity', 'outlook-thread.png')

// Serve over http://127.0.0.1 — file:// makes LINKED stylesheets opaque
// (cssRules throws), which would blind the layer check below. Same zero-dep
// idea as experiments/browser-qa/serve.mjs, but on a random free port.
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' }
const server = createServer((req, res) => {
  const p = new URL(req.url, 'http://x').pathname
  const f = normalize(join(here, p === '/' ? 'index.html' : p))
  if (!f.startsWith(here) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); return res.end('not found') }
  res.writeHead(200, { 'content-type': types[extname(f)] ?? 'application/octet-stream', 'cache-control': 'no-store' })
  res.end(readFileSync(f))
}).listen(0)
await new Promise((r) => server.once('listening', r))
const url = `http://127.0.0.1:${server.address().port}/`

const checks = []
const check = (name, actual, expected) => {
  const ok = actual === expected
  checks.push({ name, actual, expected, ok })
  return ok
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push(String(e)))
await page.goto(url)
await page.waitForLoadState('load')

const probe = await page.evaluate(() => {
  const css = (sel, prop) => {
    const el = document.querySelector(sel)
    return el ? getComputedStyle(el)[prop] : `MISSING ${sel}`
  }
  const rect = (sel) => {
    const el = document.querySelector(sel)
    return el ? el.getBoundingClientRect() : null
  }
  const row = document.querySelector('.sure-mail-row')
  const unread = document.querySelector('.sure-mail-row--unread')
  const list = document.querySelector('.sure-mail-list')
  const search = rect('.sure-mail-search__input')
  return {
    bodyFont: css('body', 'fontFamily'),
    bodySize: css('body', 'fontSize'),
    topbarBg: css('.app-topbar', 'backgroundColor'),
    searchBg: css('.sure-mail-search__input', 'backgroundColor'),
    searchRadius: css('.sure-mail-search__input', 'borderRadius'),
    searchCentered: search ? Math.round(search.left + search.width / 2 - window.innerWidth / 2) : 'no search',
    primaryBg: css('.app-rail .btn-primary', 'backgroundColor'),
    primaryRadius: css('.app-rail .btn-primary', 'borderRadius'),
    cardRadius: css('.app-main', 'borderRadius'),
    actionRadius: css('.app-read-toolbar .sure-mail-action', 'borderRadius'),
    stackedLines: list ? getComputedStyle(list).getPropertyValue('--mail-list-lines').trim() : 'no list',
    rowH: row ? Math.round(row.getBoundingClientRect().height) : 'no row',
    rowFlows: row && row.querySelector('.sure-mail-row__main').getBoundingClientRect().top
      > row.querySelector('.sure-mail-row__sender').getBoundingClientRect().bottom - 1,
    timeOnLine1: row && row.querySelector('.sure-mail-row__time').getBoundingClientRect().bottom
      <= row.querySelector('.sure-mail-row__main').getBoundingClientRect().top,
    timeRightEdge: row && Math.round(row.getBoundingClientRect().right
      - row.querySelector('.sure-mail-row__time').getBoundingClientRect().right),
    unreadWeight: unread ? getComputedStyle(unread).fontWeight : 'no unread',
    unreadDotBg: css('.sure-mail-row--unread .app-unread-dot', 'backgroundColor'),
    dotRadius: css('.sure-mail-row--unread .app-unread-dot', 'borderRadius'),
    selectedBg: css('.sure-mail-row--selected', 'backgroundColor'),
    tabUnderline: css('.app-tabs .sure-mail-search__chip.is-active', 'borderBottomColor'),
    tabBg: css('.app-tabs .sure-mail-search__chip.is-active', 'backgroundColor'),
    folderSelectedBg: css('.sure-mail-tree__item.is-selected', 'backgroundColor'),
    countBg: css('.sure-mail-tree__count', 'backgroundColor'),
    countInk: css('.sure-mail-tree__count', 'color'),
    toolbarAboveHeader: (() => {
      const bar = rect('.app-read-toolbar')
      const head = rect('.sure-mail-thread__header')
      return bar && head ? bar.bottom <= head.top : 'missing'
    })(),
    layered: [...document.styleSheets].some((s) => {
      try { return (s.cssRules[0]?.cssText ?? '').startsWith('@layer sure.tokens,') } catch { return false }
    }),
  }
})

// Fidelity targets (sure-mail Track B2 spec)
// (Chromium serializes computed font-family with quotes: '"Segoe UI", …')
check('Segoe UI-first font stack', probe.bodyFont.replaceAll('"', '').startsWith('Segoe UI,'), true)
check('14px body text', probe.bodySize, '14px')
check('white top app bar', probe.topbarBg, 'rgb(255, 255, 255)')
check('centered pill search #f0f0f0', probe.searchBg, 'rgb(240, 240, 240)')
check('search pill radius 999px', probe.searchRadius, '999px')
check('search centered on the bar', probe.searchCentered, 0)
check('New mail button #0078d4', probe.primaryBg, 'rgb(0, 120, 212)')
check('New mail radius 4px (Fluent)', probe.primaryRadius, '4px')
check('card radius 8px (Fluent)', probe.cardRadius, '8px')
check('toolbar icon buttons 4px (Fluent)', probe.actionRadius, '4px')
check('stacked list declares 2 lines', probe.stackedLines, '2')
check('two-line rows 56px', probe.rowH, 56)
check('line 2 flows below line 1', probe.rowFlows, true)
check('time top-right on line 1', probe.timeOnLine1, true)
check('time hugs the right edge', probe.timeRightEdge <= 24, true)
check('unread rows bold (700)', probe.unreadWeight, '700')
check('blue unread dot #0078d4', probe.unreadDotBg, 'rgb(0, 120, 212)')
check('unread dot is round', probe.dotRadius, '50%')
check('selected row pale blue #eff6fc', probe.selectedBg, 'rgb(239, 246, 252)')
check('Focused tab underlined in accent', probe.tabUnderline, 'rgb(0, 120, 212)')
check('Focused tab not filled', probe.tabBg, 'rgba(0, 0, 0, 0)')
check('selected folder grey #f3f2f1', probe.folderSelectedBg, 'rgb(243, 242, 241)')
check('folder counts plain (transparent bg)', probe.countBg, 'rgba(0, 0, 0, 0)')
check('folder counts #605e5c ink', probe.countInk, 'rgb(96, 94, 92)')
check('icon toolbar above header card', probe.toolbarAboveHeader, true)
check('stylesheet is layered', probe.layered, true)

// Hover-only actions: hidden at rest, revealed on the right of the row
const rest = await page.evaluate(() => ({
  actions: getComputedStyle(document.querySelector('.sure-mail-row .sure-mail-row__actions')).display,
  time: getComputedStyle(document.querySelector('.sure-mail-row .sure-mail-row__time')).display,
}))
check('row actions hidden at rest', rest.actions, 'none')
await page.hover('.sure-mail-row')
const hover = await page.evaluate(() => ({
  actions: getComputedStyle(document.querySelector('.sure-mail-row .sure-mail-row__actions')).display,
  time: getComputedStyle(document.querySelector('.sure-mail-row .sure-mail-row__time')).display,
}))
check('row actions revealed on hover', hover.actions, 'flex')
check('time swapped out on hover', hover.time, 'none')
await page.mouse.move(800, 880) // move off the row

// New mail hover: Fluent accent darkening (#0078d4 → #106ebe). The buttons
// family transitions background over 0.15s — wait it out, else the probe
// samples the tween.
await page.hover('.app-rail .btn-primary')
await page.waitForTimeout(250)
const hoverBtn = await page.evaluate(() =>
  getComputedStyle(document.querySelector('.app-rail .btn-primary')).backgroundColor)
check('New mail hover #106ebe', hoverBtn, 'rgb(16, 110, 190)')
await page.mouse.move(800, 880)

check('no console errors', errors.length === 0, true)

await page.screenshot({ path: shotList, fullPage: false })
await page.locator('.app-read').screenshot({ path: shotThread })
await browser.close()
server.close()

let failed = 0
for (const c of checks) {
  if (!c.ok) failed++
  console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}  actual=${JSON.stringify(c.actual)}${c.ok ? '' : ` expected=${JSON.stringify(c.expected)}`}`)
}
console.log(`\n${checks.length - failed}/${checks.length} fidelity checks passed — screenshots: ${shotList}, ${shotThread}`)
process.exit(failed === 0 ? 0 : 1)
