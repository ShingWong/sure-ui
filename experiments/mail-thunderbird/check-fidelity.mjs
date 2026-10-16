// Fidelity checks for the Thunderbird 115 Supernova reference composition —
// measured, not eyeballed: launches Chromium (already a sure-ui devDependency,
// same browsers as experiments/browser-qa), asserts the Track-B4 fidelity
// targets against computed styles, proves the tab-bar geometry (rounded-top
// tabs, 2px accent line at the top, 33px height), Thunderbird's card-view
// rows (white 3px cards on #fafafa, accent tints), the coloured folder icons,
// the warm flag and the GREEN unread dot, then writes
// docs/fidelity/thunderbird-list.png and docs/fidelity/thunderbird-thread.png.
//
//   node experiments/mail-thunderbird/build.mjs && node experiments/mail-thunderbird/check-fidelity.mjs
//
// Not part of `npm test`: CI installs no browser for this repo (see
// .github/workflows/ci.yml), so it stays a manual/runbook gate — the unit
// gates in src/mail.test.ts own the CSS itself.
//
// Every hex committed in thunderbird-skin.css appears below as a measured
// expectation; colours sampled at rest are read BEFORE any page.hover()
// (the shell reveals unflagged flags on hover only).
import { chromium } from '@playwright/test'
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname, normalize } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const shotList = join(here, '..', '..', 'docs', 'fidelity', 'thunderbird-list.png')
const shotThread = join(here, '..', '..', 'docs', 'fidelity', 'thunderbird-thread.png')

// Serve over http://127.0.0.1 — file:// makes LINKED stylesheets opaque
// (cssRules throws), which would blind the layer checks below. Same zero-dep
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
  const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const row = document.querySelector('.sure-mail-row')
  const unread = document.querySelector('.sure-mail-row--unread')
  const list = document.querySelector('.sure-mail-list')
  const tabbar = rect('.app-tabbar')
  const toolbar = rect('.app-toolbar')
  const search = rect('.app-toolbar .sure-mail-search__input')
  const tab = rect('.app-tab.is-active')
  const line = rect('.app-tab.is-active .app-tab-line')
  const sender = row.querySelector('.sure-mail-row__sender').getBoundingClientRect()
  const main = row.querySelector('.sure-mail-row__main').getBoundingClientRect()
  const time = row.querySelector('.sure-mail-row__time').getBoundingClientRect()
  const bar = rect('.app-read-toolbar')
  const head = rect('.sure-mail-thread__header')
  return {
    bodyFont: css('body', 'fontFamily'),
    bodySize: css('body', 'fontSize'),
    // Tab bar (tabmail.css geometry)
    tabbarBg: css('.app-tabbar', 'backgroundColor'),
    sidebarBg: css('.app-sidebar', 'backgroundColor'),
    tabRadius: css('.app-tab.is-active', 'borderRadius'),
    tabBg: css('.app-tab.is-active', 'backgroundColor'),
    tabMinH: css('.app-tab.is-active', 'minHeight'),
    tabLabelSize: css('.app-tab.is-active .app-tab-label', 'fontSize'),
    tabLineH: css('.app-tab.is-active .app-tab-line', 'height'),
    tabLineColor: css('.app-tab.is-active .app-tab-line', 'backgroundColor'),
    tabLineTopOffset: line && tab ? Math.round(line.top - tab.top) : 'no line',
    closeCount: document.querySelectorAll('.app-tab .app-tab-close').length,
    activeHasClose: !!document.querySelector('.app-tab.is-active .app-tab-close'),
    tabbarBottom: tabbar ? tabbar.bottom : null,
    toolbarTop: toolbar ? toolbar.top : null,
    // Toolbar
    toolbarBorder: css('.app-toolbar', 'borderBottomColor'),
    btnBg: css('.app-toolbar .btn-primary', 'backgroundColor'),
    btnRadius: css('.app-toolbar .btn-primary', 'borderRadius'),
    actionW: rect('.app-toolbar .sure-mail-action')?.width ?? 'no action',
    actionIconW: rect('.app-toolbar .sure-mail-action svg')?.width ?? 'no icon',
    actionRadius: css('.app-toolbar .sure-mail-action', 'borderRadius'),
    searchBg: css('.app-toolbar .sure-mail-search__input', 'backgroundColor'),
    searchRadius: css('.app-toolbar .sure-mail-search__input', 'borderRadius'),
    searchRightGap: toolbar && search ? Math.round(toolbar.right - search.right) : 'no search',
    searchRightHalf: toolbar && search ? search.left > toolbar.left + toolbar.width * 0.5 : 'no search',
    // Folder pane
    selectedFolderBg: css('.sure-mail-tree__item.is-selected', 'backgroundColor'),
    selectedFolderInk: css('.sure-mail-tree__item.is-selected', 'color'),
    countBg: css('.sure-mail-tree__count', 'backgroundColor'),
    countInk: css('.sure-mail-tree__count', 'color'),
    iconDraft: css('.sure-mail-tree__item[data-folder="draft"] .sure-mail-tree__icon', 'color'),
    iconSent: css('.sure-mail-tree__item[data-folder="sent"] .sure-mail-tree__icon', 'color'),
    iconJunk: css('.sure-mail-tree__item[data-folder="junk"] .sure-mail-tree__icon', 'color'),
    iconArchive: css('.sure-mail-tree__item[data-folder="archive"] .sure-mail-tree__icon', 'color'),
    iconTrash: css('.sure-mail-tree__item[data-folder="trash"] .sure-mail-tree__icon', 'color'),
    sections: [...document.querySelectorAll('.app-side-section')].map((n) => n.textContent).join(' '),
    // Card-view message list
    listBg: css('.sure-mail-list', 'backgroundColor'),
    listBorderWidth: css('.sure-mail-list', 'borderTopWidth'),
    rowBg: css('.sure-mail-row', 'backgroundColor'),
    rowBorder: css('.sure-mail-row', 'borderTopColor'),
    rowRadius: css('.sure-mail-row', 'borderRadius'),
    rowH: row ? Math.round(row.getBoundingClientRect().height) : 'no row',
    rowLines: list ? getComputedStyle(list).getPropertyValue('--mail-list-lines').trim() : 'no list',
    singleLine: main.top < sender.bottom - 1 && time.top < sender.bottom,
    senderInk: css('.sure-mail-row__sender', 'color'),
    previewInk: css('.sure-mail-row__preview', 'color'),
    unreadWeight: unread ? getComputedStyle(unread).fontWeight : 'no unread',
    unreadBg: unread ? getComputedStyle(unread).backgroundColor : 'no unread',
    dotBg: css('.sure-mail-row--unread .app-unread-dot', 'backgroundColor'),
    dotRadius: css('.sure-mail-row--unread .app-unread-dot', 'borderRadius'),
    selectedRowBg: css('.sure-mail-row--selected', 'backgroundColor'),
    flagInk: css('.sure-mail-row--flagged .sure-mail-row__flag', 'color'),
    flaggedFlagAtRest: css('.sure-mail-row--flagged .sure-mail-row__flag', 'opacity'),
    // Reading pane
    toolbarAboveHeader: bar && head ? bar.bottom <= head.top + 1 : 'missing',
    readActionW: rect('.app-read-toolbar .sure-mail-action')?.width ?? 'no action',
    quoteToggleBg: css('.sure-mail-thread__quote-toggle', 'backgroundColor'),
    attachmentBg: css('.sure-mail-thread__attachment', 'backgroundColor'),
    attachmentBorder: css('.sure-mail-thread__attachment', 'borderTopColor'),
    // Status bar + compose + chrome
    statusMinH: css('.app-status', 'minHeight'),
    statusBg: css('.app-status', 'backgroundColor'),
    statusBorder: css('.app-status', 'borderTopColor'),
    chipBg: css('.app-compose-dock .sure-mail-compose__chip', 'backgroundColor'),
    sendRadius: css('.app-compose-dock .btn-primary', 'borderRadius'),
    layered: [...document.styleSheets].some((s) => {
      try { return (s.cssRules[0]?.cssText ?? '').startsWith('@layer sure.tokens,') } catch { return false }
    }),
    accentToken: token('--accent'),
  }
})

// Typography (system UI stack, ~14px)
check('system UI font stack', probe.bodyFont.replaceAll('"', '').startsWith('system-ui, -apple-system,'), true)
check('14px body/root text', probe.bodySize, '14px')

// Tab bar above the panes (tabmail.css: radius 4px 4px 0 0, --tab-min-height
// 33px, 2px .tab-line in the selection accent, strip = layout-background-2,
// active tab = toolbar-background-color, close buttons on every tab but the first).
check('tab strip + folder pane chrome grey #f4f4f5',
  probe.tabbarBg === 'rgb(244, 244, 245)' && probe.sidebarBg === 'rgb(244, 244, 245)', true)
check('active tab: 4px top corners', probe.tabRadius, '4px 4px 0px 0px')
check('active tab painted with the toolbar grey #fafafa', probe.tabBg, 'rgb(250, 250, 250)')
check('tabs 33px tall (--tab-min-height)', probe.tabMinH, '33px')
check('tab text 16px', probe.tabLabelSize, '16px')
check('2px accent tab line, 3px below the tab top',
  probe.tabLineH === '2px' && probe.tabLineColor === 'rgb(19, 115, 217)' && probe.tabLineTopOffset === 3, true)
check('close ✕ on the three inactive tabs only',
  probe.closeCount === 3 && probe.activeHasClose === false, true)

// Unified toolbar under the tabs.
check('toolbar sits under the tab bar', probe.toolbarTop >= probe.tabbarBottom - 0.5, true)
check('toolbar separator #d4d4d8', probe.toolbarBorder, 'rgb(212, 212, 216)')
check('New Message primary blue #1373d9', probe.btnBg, 'rgb(19, 115, 217)')
check('New Message 3px control radius', probe.btnRadius, '3px')
check('icon strip: 32px buttons, 16px glyphs, 3px radius',
  probe.actionW === 32 && probe.actionIconW === 16 && probe.actionRadius === '3px', true)
check('search field #f7f7f8, 3px rounded',
  probe.searchBg === 'rgb(247, 247, 248)' && probe.searchRadius === '3px', true)
check('search sits at the toolbar’s right end',
  probe.searchRightHalf === true && probe.searchRightGap <= 16, true)

// Folder pane: solid accent on the open folder, grey count pills, coloured
// special-folder icons (folderColors.css), account + Local Folders groups.
check('open folder solid accent #1373d9', probe.selectedFolderBg, 'rgb(19, 115, 217)')
check('open folder label ink white', probe.selectedFolderInk, 'rgb(255, 255, 255)')
check('unread count pills grey #71717a on white',
  probe.countBg === 'rgb(113, 113, 122)' && probe.countInk === 'rgb(255, 255, 255)', true)
check('Drafts icon purple #ae55f7', probe.iconDraft, 'rgb(174, 85, 247)')
check('Sent icon green #1d783b', probe.iconSent, 'rgb(29, 120, 59)')
check('Junk icon red #b91c1c', probe.iconJunk, 'rgb(185, 28, 28)')
check('Archive icon #713f12', probe.iconArchive, 'rgb(113, 63, 18)')
check('Trash icon secondary grey #52525b', probe.iconTrash, 'rgb(82, 82, 91)')
check('groups: account · Local Folders', probe.sections, 'me@example.com Local Folders')

// Card view: white 3px cards with hairlines on the grey pane, no list frame.
check('list is one grey surface, frameless (structural reset)',
  probe.listBg === 'rgb(250, 250, 250)' && probe.listBorderWidth === '0px', true)
check('rows are white cards with #d9d9de hairlines',
  probe.rowBg === 'rgb(255, 255, 255)' && probe.rowBorder === 'rgb(217, 217, 222)', true)
check('cards round 3px (--listbox-border-radius)', probe.rowRadius, '3px')
check('rows 46px, single line', probe.rowH === 46 && probe.rowLines === '1', true)
check('sender · subject — preview · time share one line', probe.singleLine, true)
check('sender ink #18181b', probe.senderInk, 'rgb(24, 24, 27)')
check('preview muted #71717a', probe.previewInk, 'rgb(113, 113, 122)')
check('unread rows bold (700)', probe.unreadWeight, '700')
check('unread rows un-tinted white (bold + dot, not a wash)', probe.unreadBg, 'rgb(255, 255, 255)')
check('unread dot GREEN #16a34a, round',
  probe.dotBg === 'rgb(22, 163, 74)' && probe.dotRadius === '50%', true)
check('selected row accent tint #dceaf9', probe.selectedRowBg, 'rgb(220, 234, 249)')
check('flagged rows warm orange #ea580c', probe.flagInk, 'rgb(234, 88, 12)')
check('flagged rows keep their flag at rest', probe.flaggedFlagAtRest, '1')

// Reading pane: horizontal toolbar above the header card, quote + chips.
check('action toolbar above the reading pane header', probe.toolbarAboveHeader, true)
check('reading-pane toolbar: 32px icon buttons', probe.readActionW, 32)
check('quote affordance surface-subtle #efeff1', probe.quoteToggleBg, 'rgb(239, 239, 241)')
check('attachment chips #f7f7f8 on the #d9d9de hairline',
  probe.attachmentBg === 'rgb(247, 247, 248)' && probe.attachmentBorder === 'rgb(217, 217, 222)', true)

// Status bar + compose window.
check('status bar: 22px footer in #fafafa',
  probe.statusMinH === '22px' && probe.statusBg === 'rgb(250, 250, 250)', true)
check('status bar top hairline #d9d9de', probe.statusBorder, 'rgb(217, 217, 222)')
check('compose chips surface-subtle #efeff1', probe.chipBg, 'rgb(239, 239, 241)')
check('compose Send takes the 3px control radius', probe.sendRadius, '3px')

// ── Hover states (sampled after everything above, at rest) ──
await page.hover('.sure-mail-tree__item[data-folder="draft"]')
const folderHover = await page.evaluate(() =>
  getComputedStyle(document.querySelector('.sure-mail-tree__item[data-folder="draft"]')).backgroundColor)
check('folder row hover #e4e4e7', folderHover, 'rgb(228, 228, 231)')
await page.mouse.move(800, 880)

await page.hover('.app-toolbar .btn-primary')
await page.waitForTimeout(250) // .btn-primary transitions background 0.15s
const btnHover = await page.evaluate(() =>
  getComputedStyle(document.querySelector('.app-toolbar .btn-primary')).backgroundColor)
check('New Message hover #175fb6', btnHover, 'rgb(23, 95, 182)')
await page.mouse.move(800, 880)

// A read, unselected row (row 6): hover tint = accent 10% over white, the
// shared action reveal (time swaps out) still holds.
await page.hover('.sure-mail-list .sure-mail-row:nth-child(6)')
const rowHover = await page.evaluate(() => ({
  bg: getComputedStyle(document.querySelector('.sure-mail-list .sure-mail-row:nth-child(6)')).backgroundColor,
  actions: getComputedStyle(document.querySelector('.sure-mail-list .sure-mail-row:nth-child(6) .sure-mail-row__actions')).display,
  time: getComputedStyle(document.querySelector('.sure-mail-list .sure-mail-row:nth-child(6) .sure-mail-row__time')).display,
}))
check('row hover tint #e7f1fb (accent 10% over white)', rowHover.bg, 'rgb(231, 241, 251)')
check('row actions revealed on hover', rowHover.actions, 'flex')
check('time swapped out on hover', rowHover.time, 'none')
await page.mouse.move(800, 880)

// The shared + mail mobile layers ride along verbatim (mobile: true default).
const generated = readFileSync(join(here, 'mail-thunderbird.css'), 'utf8')
check('shared + mail mobile layers shipped',
  generated.includes('/* ── Mobile & touch') && generated.includes('/* ── Mail: mobile & touch'), true)
check('stylesheet is layered', probe.layered, true)
check('accent token resolves to Thunderbird primary #1373d9', probe.accentToken, '#1373d9')
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
