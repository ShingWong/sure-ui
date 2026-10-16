// Fidelity checks for the Gmail reference composition — measured, not
// eyeballed: launches Chromium (already a sure-ui devDependency, same
// browsers as experiments/browser-qa), asserts the Track-B fidelity targets
// against computed styles, verifies hover-only actions reveal, then writes
// docs/fidelity/gmail-list.png.
//
//   node experiments/mail-gmail/build.mjs && node experiments/mail-gmail/check-fidelity.mjs
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
const shotPath = join(here, '..', '..', 'docs', 'fidelity', 'gmail-list.png')

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
  const row = document.querySelector('.sure-mail-row')
  const unread = document.querySelector('.sure-mail-row--unread')
  return {
    bodyFont: css('body', 'fontFamily'),
    bodyBg: css('body', 'backgroundColor'),
    rowH: row ? Math.round(row.getBoundingClientRect().height) : 'no row',
    listBg: css('.sure-mail-list', 'backgroundColor'),
    railRadius: css('.sure-mail-tree__item', 'borderRadius'),
    unreadWeight: unread ? getComputedStyle(unread).fontWeight : 'no unread',
    unreadBg: unread ? getComputedStyle(unread).backgroundColor : 'no unread',
    chipBg: css('.sure-mail-search__chip.is-active', 'backgroundColor'),
    selectedBg: css('.sure-mail-row--selected', 'backgroundColor'),
    senderW: Math.round(parseFloat(css('.sure-mail-row__sender', 'width'))),
    layered: [...document.styleSheets].some((s) => {
      try { return (s.cssRules[0]?.cssText ?? '').startsWith('@layer sure.tokens,') } catch { return false }
    }),
  }
})

// Fidelity targets (sure-mail Track B spec)
check('Roboto-first font stack', probe.bodyFont.startsWith('Roboto,'), true)
check('grey page background (#f1f3f4)', probe.bodyBg, 'rgb(241, 243, 244)')
check('list rows ~40px', probe.rowH, 40)
check('white list card', probe.listBg, 'rgb(255, 255, 255)')
check('pill nav rail (999px)', probe.railRadius, '999px')
check('unread rows bold (700)', probe.unreadWeight, '700')
check('unread rows #f6fafe tint', probe.unreadBg, 'rgb(246, 250, 254)')
check('active filter chip #1a73e8', probe.chipBg, 'rgb(26, 115, 232)')
check('selected row #e8f0fe', probe.selectedBg, 'rgb(232, 240, 254)')
check('sender column 15rem (240px)', probe.senderW, 240)
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

check('no console errors', errors.length === 0, true)

await page.screenshot({ path: shotPath, fullPage: false })
await browser.close()
server.close()

let failed = 0
for (const c of checks) {
  if (!c.ok) failed++
  console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}  actual=${JSON.stringify(c.actual)}${c.ok ? '' : ` expected=${JSON.stringify(c.expected)}`}`)
}
console.log(`\n${checks.length - failed}/${checks.length} fidelity checks passed — screenshot: ${shotPath}`)
process.exit(failed === 0 ? 0 : 1)
