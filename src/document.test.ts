import { describe, it, expect } from 'vitest'
import { themes, compose, COMPONENTS } from './index.js'

/**
 * sure-document's two upstream blocks (plan Phase 1). The footer block is the
 * model: every theme must style every class the catalog can emit, every value
 * must come from a theme token, and the print behaviour must be present in the
 * shipped CSS rather than left to a consumer stylesheet.
 */
const DOC_MARK = '/* ── Document ──'
const FIG_MARK = '/* ── Figure ──'
const MOBILE_LAYER = '@layer sure.mobile {'
const MOBILE_MARK = '/* ── Mobile & touch'

const slice = (css: string, startMark: string, endMarks: string[]): string => {
  const start = css.indexOf(startMark)
  expect(start, `missing ${startMark}`).toBeGreaterThan(-1)
  let end = css.length
  for (const mark of endMarks) {
    const i = css.indexOf(mark, start + startMark.length)
    if (i > -1) end = Math.min(end, i)
  }
  return css.slice(start, end)
}
const documentCss = (css: string): string => slice(css, DOC_MARK, [FIG_MARK, MOBILE_LAYER, MOBILE_MARK])
const figureCss = (css: string): string => slice(css, FIG_MARK, [MOBILE_LAYER, MOBILE_MARK])
const printCss = (css: string): string => {
  const i = css.indexOf('@media print {')
  expect(i, 'no @media print rule').toBeGreaterThan(-1)
  return css.slice(i) // the print block is the last rule in each block
}
/** Comments describe the rules ("no animation"); only declarations count. */
const rulesOnly = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '')

const tokenOnly = (css: string): void => {
  expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i)
  expect(css).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/)
  expect(rulesOnly(css)).not.toMatch(/\b(color|background|fill|stroke|border(?:-[a-z]+)?)\s*:\s*(?:white|black|silver|gray|grey|red|green|blue)\b/i)
}

const DOCUMENT_CLASSES = [
  '.sure-document {', '.sure-document__sheet', '.sure-document__header',
  '.sure-document__footer', '.sure-document__zone', '.sure-document__page',
  '.sure-document__date', '.sure-document__section', '.sure-document__signature',
  '.sure-document__graphic', '.sure-document__watermark',
]
const FIGURE_CLASSES = [
  '.sure-figure {', '.sure-figure__plot', '.sure-figure__axis',
  '.sure-figure__bar', '.sure-figure__line', '.sure-figure__legend',
]

describe('document: the sheet is the paper', () => {
  for (const [name, css] of Object.entries(themes)) {
    it(`${name} styles every document class the catalog can emit`, () => {
      const block = documentCss(css)
      const missing = DOCUMENT_CLASSES.filter((c) => !block.includes(c))
      expect(missing, `${name} is missing: ${missing.join(', ')}`).toEqual([])
    })

    it(`${name} draws the sheet as paper on screen`, () => {
      const block = documentCss(css)
      expect(block).toContain('box-shadow:')
      expect(block).toContain('width: calc(var(--sure-sheet-w) * var(--sure-sheet-scale))')
      expect(block).toContain('padding: var(--sure-sheet-margin)')
      // watermark stays behind the body, inert, at the renderer-set opacity
      expect(block).toContain('z-index: 0')
      expect(block).toContain('pointer-events: none')
      expect(block).toContain('user-select: none')
      expect(block).toContain('opacity: var(--sure-watermark-opacity)')
      // every custom property the renderer can override is also declared
      const declared = new Set([...block.matchAll(/(--sure-[a-z-]+)\s*:/g)].map((m) => m[1]!))
      const used = [...block.matchAll(/var\((--sure-[a-z-]+)/g)].map((m) => m[1]!)
      expect([...new Set(used)].filter((v) => !declared.has(v))).toEqual([])
    })

    it(`${name} carries page-break helpers and keep-together`, () => {
      const block = documentCss(css)
      expect(block).toContain('break-after: page')
      expect(block).toContain('page-break-after: always')
      expect(block).toMatch(/\.sure-document__sheet:last-child/)
      expect(block).toContain('break-before: page')
      expect(block).toContain('.sure-document__section {')
      expect(block).toContain('break-inside: avoid')
      expect(block).toContain('.sure-document__signature')
    })

    it(`${name} repeats furniture and prints the watermark, deferring size to @page`, () => {
      const block = documentCss(css)
      const print = printCss(block)
      expect(block).toContain('@page owns size and margins')
      // print drops the screen pretence; it never declares a paper size
      expect(print).toContain('width: auto; min-height: 0;')
      expect(print).toContain('margin: 0; padding: 0;')
      expect(print).toContain('border: 0; box-shadow: none;')
      expect(print).not.toMatch(/\bsize\s*:/)
      expect(print).not.toMatch(/\d+pt/)
      // header/footer are sheet furniture (unlike the site footer, which is
      // print-hidden), and a watermark must survive the print stylesheet
      expect(print).toContain('.sure-document__header,')
      expect(print).toContain('.sure-document__footer { display: grid; }')
      expect(print).toContain('.sure-document__header--no-print')
      expect(print).toContain('.sure-document__watermark--print { display: flex; }')
      expect(print).toContain('print-color-adjust: exact')
    })

    it(`${name} draws the document block from theme tokens only`, () => {
      const block = documentCss(css)
      tokenOnly(block)
      for (const token of ['--border', '--muted', '--text', '--surface', '--bg', '--font-body']) {
        expect(block, `${name} does not use ${token}`).toContain(`var(${token})`)
      }
    })
  }
})

describe('figure: grayscale-safe, silent, with a print-hidden fallback', () => {
  for (const [name, css] of Object.entries(themes)) {
    it(`${name} styles every figure class the catalog can emit`, () => {
      const block = figureCss(css)
      const missing = FIGURE_CLASSES.filter((c) => !block.includes(c))
      expect(missing, `${name} is missing: ${missing.join(', ')}`).toEqual([])
    })

    it(`${name} keeps series apart in grayscale without animation`, () => {
      const block = figureCss(css)
      expect(block).toContain('stroke-dasharray')
      expect(block).toContain('border-style: dashed')
      expect(block).toContain('fill: none')
      expect(rulesOnly(block)).not.toMatch(/animation|@keyframes|transition/i)
      expect(rulesOnly(block)).not.toMatch(/\bcanvas\b/i)
    })

    it(`${name} hides the data-table fallback in print by default`, () => {
      const print = printCss(figureCss(css))
      expect(print).toContain('.sure-figure table { display: none; }')
      expect(print).toContain('.sure-figure--show-data table { display: table; }')
    })

    it(`${name} draws the figure block from theme tokens only`, () => {
      const block = figureCss(css)
      tokenOnly(block)
      for (const token of ['--text', '--muted', '--border', '--accent']) {
        expect(block, `${name} does not use ${token}`).toContain(`var(${token})`)
      }
    })
  }
})

describe('document + figure: selectable, shared families', () => {
  it('both are named families, so sure-factor\'s registry can declare them', () => {
    expect(COMPONENTS).toContain('document')
    expect(COMPONENTS).toContain('figure')
  })

  it('one family composes without the other', () => {
    const doc = compose({ theme: 'nord', components: ['document'] })
    expect(doc).toContain('.sure-document__sheet')
    expect(doc).not.toContain('.sure-figure')
    const fig = compose({ theme: 'nord', components: ['figure'] })
    expect(fig).toContain('.sure-figure__plot')
    expect(fig).not.toContain('.sure-document__sheet')
  })

  it('the same block bytes reach every theme', () => {
    const doc = documentCss(compose({ theme: 'nord', components: ['document'] }))
    const fig = figureCss(compose({ theme: 'nord', components: ['figure'] }))
    for (const theme of Object.keys(themes)) {
      expect(documentCss(compose({ theme, components: ['document'] })), `${theme} document drift`).toBe(doc)
      expect(figureCss(compose({ theme, components: ['figure'] })), `${theme} figure drift`).toBe(fig)
    }
  })
})
