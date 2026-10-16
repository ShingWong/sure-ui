// Fidelity checks for the macOS Mail reference composition — measured, not
// eyeballed: launches Chromium (already a sure-ui devDependency, same
// browsers as experiments/browser-qa), asserts the Track-B3 fidelity targets
// against computed styles, proves the sidebar's solid fallback is wired
// outside @supports (headless Chromium may not composite the blur), verifies
// the slim single-line row geometry and the hover-only actions reveal, then
// writes docs/fidelity/macmail-list.png and docs/fidelity/macmail-thread.png.
//
//   node experiments/mail-macmail/build.mjs && node experiments/mail-macmail/check-fidelity.mjs
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
const shotList = join(here, '..', '..', 'docs', 'fidelity', 'macmail-list.png')
const shotThread = join(here, '..', '..', 'docs', 'fidelity', 'macmail-thread.png')

// Serve over http://127.0.0.1 — file:// makes LINKED stylesheets opaque
// (cssRules throws), which would blind the layer + @supports checks below.
// Same zero-dep idea as experiments/browser-qa/serve.mjs, but on a random
// free port.
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
  const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const row = document.querySelector('.sure-mail-row')
  const unread = document.querySelector('.sure-mail-row--unread')
  const list = document.querySelector('.sure-mail-list')
  const head = rect('.app-list-head')
  const search = rect('.sure-mail-search__input')
  const sender = row.querySelector('.sure-mail-row__sender').getBoundingClientRect()
  const main = row.querySelector('.sure-mail-row__main').getBoundingClientRect()
  const time = row.querySelector('.sure-mail-row__time').getBoundingClientRect()
  // Shell rules: the sidebar fallback must live outside @supports, with the
  // blur upgrade inside it — otherwise "solid fallback" is just a token no
  // browser ever paints.
  const shell = { fallbackOutsideSupports: false, supportsBlursSidebar: false }
  for (const sheet of document.styleSheets) {
    let rules
    try { rules = sheet.cssRules } catch { continue }
    for (const r of rules) {
      if (r.selectorText === '.app-sidebar' && (r.style?.background ?? '').includes('mail-sidebar-fallback')) {
        shell.fallbackOutsideSupports = true
      }
      if (r.conditionText && r.cssRules) {
        for (const inner of r.cssRules) {
          if ((inner.selectorText ?? '').includes('.app-sidebar') && (inner.cssText ?? '').includes('backdrop-filter')) {
            shell.supportsBlursSidebar = true
          }
        }
      }
    }
  }
  return {
    bodyFont: css('body', 'fontFamily'),
    bodySize: css('body', 'fontSize'),
    sendBg: css('.app-compose-dock .btn-primary', 'backgroundColor'),
    titleSize: css('.app-title', 'fontSize'),
    titleWeight: css('.app-title', 'fontWeight'),
    lightClose: css('.app-light--close', 'backgroundColor'),
    lightMin: css('.app-light--min', 'backgroundColor'),
    lightMax: css('.app-light--max', 'backgroundColor'),
    sidebarBg: css('.app-sidebar', 'backgroundColor'),
    sidebarBackdrop: css('.app-sidebar', 'backdropFilter'),
    sidebarFallbackToken: token('--mail-sidebar-fallback'),
    sidebarDivider: css('.app-sidebar', 'borderRightColor'),
    sections: [...document.querySelectorAll('.app-side-section')].map((n) => n.textContent).join(' '),
    favoritesItems: document.querySelectorAll('.sure-mail-tree')[0]?.querySelectorAll('li').length ?? 'none',
    treeSelectedBg: css('.sure-mail-tree__item.is-selected', 'backgroundColor'),
    countBg: css('.sure-mail-tree__count', 'backgroundColor'),
    countInk: css('.sure-mail-tree__count', 'color'),
    toolbarHairline: css('.app-toolbar', 'borderBottomColor'),
    searchBg: css('.sure-mail-search__input', 'backgroundColor'),
    searchRadius: css('.sure-mail-search__input', 'borderRadius'),
    searchRightGap: head && search ? Math.round(head.right - search.right) : 'no search',
    searchRightHalf: head && search ? search.left > head.left + head.width * 0.4 : 'no search',
    listRadius: css('.sure-mail-list', 'borderRadius'),
    listBorderWidth: css('.sure-mail-list', 'borderTopWidth'),
    listShadow: css('.sure-mail-list', 'boxShadow'),
    radiusToken: token('--mail-radius'),
    rowBorderBottom: css('.sure-mail-row', 'borderBottomColor'),
    rowH: row ? Math.round(row.getBoundingClientRect().height) : 'no row',
    rowLines: list ? getComputedStyle(list).getPropertyValue('--mail-list-lines').trim() : 'no list',
    singleLine: main.top < sender.bottom - 1 && time.top < sender.bottom,
    unreadWeight: unread ? getComputedStyle(unread).fontWeight : 'no unread',
    unreadBg: unread ? getComputedStyle(unread).backgroundColor : 'no unread',
    unreadDotBg: css('.sure-mail-row--unread .app-unread-dot', 'backgroundColor'),
    unreadDotRadius: css('.sure-mail-row--unread .app-unread-dot', 'borderRadius'),
    selectedBg: css('.sure-mail-row--selected', 'backgroundColor'),
    flagInk: css('.sure-mail-row--flagged .sure-mail-row__flag', 'color'),
    flaggedFlagAtRest: css('.sure-mail-row--flagged .sure-mail-row__flag', 'opacity'),
    readToolbarAboveHeader: (() => {
      const bar = rect('.app-read-toolbar')
      const head = rect('.sure-mail-thread__header')
      return bar && head ? bar.bottom <= head.top : 'missing'
    })(),
    actionRadius: css('.app-read-toolbar .sure-mail-action', 'borderRadius'),
    layered: [...document.styleSheets].some((s) => {
      try { return (s.cssRules[0]?.cssText ?? '').startsWith('@layer sure.tokens,') } catch { return false }
    }),
    supportsBlur: CSS.supports('backdrop-filter', 'blur(1px)'),
    shell,
  }
})

// Fidelity targets (sure-mail Track B3 spec)
// (Chromium serializes computed font-family with quotes: '"SF Pro Text", …')
check('SF Pro/system-first font stack', probe.bodyFont.replaceAll('"', '').startsWith('-apple-system, BlinkMacSystemFont,'), true)
check('13px list/body text', probe.bodySize, '13px')
check('system blue accent on Send #0a84ff', probe.sendBg, 'rgb(10, 132, 255)')
check('window title 13px semibold', probe.titleSize === '13px' && probe.titleWeight === '600', true)
check('traffic-light dots use the status aliases',
  probe.lightClose === 'rgb(255, 95, 87)' && probe.lightMin === 'rgb(254, 188, 46)' && probe.lightMax === 'rgb(40, 200, 64)', true)

// Sidebar: vibrancy with a solid fallback that is genuinely wired.
check('sidebar vibrancy (blur + saturate over translucent bg)',
  probe.supportsBlur
    ? (probe.sidebarBackdrop.includes('blur(') && probe.sidebarBackdrop.includes('saturate(') && probe.sidebarBg.startsWith('rgba('))
    : probe.sidebarBg, probe.supportsBlur ? true : 'rgb(242, 242, 247)')
check('sidebar solid fallback token #f2f2f7', probe.sidebarFallbackToken, '#f2f2f7')
check('fallback painted outside @supports', probe.shell.fallbackOutsideSupports, true)
check('@supports upgrades the sidebar to blur', probe.shell.supportsBlursSidebar, true)
check('sections: Favorites · Mailboxes', probe.sections, 'Favorites Mailboxes')
check('Favorites holds 5 items (Inbox ★ … Trash)', probe.favoritesItems, 5)
check('selected sidebar item #d6e7fb', probe.treeSelectedBg, 'rgb(214, 231, 251)')
check('mailbox counts plain (transparent bg)', probe.countBg, 'rgba(0, 0, 0, 0)')
check('mailbox counts grey #8e8e93', probe.countInk, 'rgb(142, 142, 147)')

// Hairlines, not cards.
check('sidebar pane hairline #e5e5ea', probe.sidebarDivider, 'rgb(229, 229, 234)')
check('toolbar hairline #e5e5ea', probe.toolbarHairline, 'rgb(229, 229, 234)')
check('row hairlines a half-step lighter #ececef', probe.rowBorderBottom, 'rgb(236, 236, 239)')
check('list card radius flat (0px)', probe.listRadius, '0px')
check('--mail-radius token near-flat', probe.radiusToken, '0px')
check('list flush: no border (structural reset)', probe.listBorderWidth, '0px')
check('list has no card shadow', probe.listShadow, 'none')

// Slim single-line rows (the Mac middle ground: 40 Gmail / 44 Mac / 56 Outlook).
check('slim rows 44px', probe.rowH, 44)
check('single-line list (no stacked modifier)', probe.rowLines, '1')
check('sender · subject/preview · time share one line', probe.singleLine, true)
check('unread rows bold (700)', probe.unreadWeight, '700')
check('unread rows un-tinted (bold + dot, not a wash)', probe.unreadBg, 'rgb(255, 255, 255)')
check('blue unread dot #0a84ff', probe.unreadDotBg, 'rgb(10, 132, 255)')
check('unread dot is round', probe.unreadDotRadius, '50%')
check('selected row light blue #d6e7fb', probe.selectedBg, 'rgb(214, 231, 251)')
check('flagged rows macOS orange #ff9500', probe.flagInk, 'rgb(255, 149, 0)')
check('flagged rows keep their flag at rest', probe.flaggedFlagAtRest, '1')

// List header + toolbar.
check('pill search #e9e9ec', probe.searchBg, 'rgb(233, 233, 236)')
check('search pill radius 999px', probe.searchRadius, '999px')
check('search sits at the right of the list header', probe.searchRightHalf === true && probe.searchRightGap <= 16, true)
check('icon toolbar strip above the reading pane', probe.readToolbarAboveHeader, true)
check('toolbar icon buttons 5px hover radius', probe.actionRadius, '5px')

// Hover-only actions: hidden at rest, revealed on the right of the row.
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

// New message hover: the shared hover tint (no transition on the shell
// button, so the probe is immediate).
await page.hover('.app-new')
const hoverBtn = await page.evaluate(() =>
  getComputedStyle(document.querySelector('.app-new')).backgroundColor)
check('New message hover #f2f2f7', hoverBtn, 'rgb(242, 242, 247)')
await page.mouse.move(800, 880)

// The shared + mail mobile layers ride along verbatim (mobile: true default).
const generated = readFileSync(join(here, 'mail-macmail.css'), 'utf8')
check('shared + mail mobile layers shipped',
  generated.includes('/* ── Mobile & touch') && generated.includes('/* ── Mail: mobile & touch'), true)
check('stylesheet is layered', probe.layered, true)
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
