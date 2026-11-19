import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { SURE_TYPOGRAPHY, type TypographyKind, type TypographyStyle } from './index.js'
import { themes } from './index.js'
import { tokens } from './generated/themes.js'

/**
 * Document typography lives here now. sure-document imports SURE_TYPOGRAPHY
 * for the physical metrics and points its `css` at variables every sure-ui
 * theme declares. These tests are the cross-package contract: a missing var
 * would make a renderer emit `font-family: var(--sure-font-h1)` with no value.
 */

const VARS = ['--sure-font-h1', '--sure-font-h2', '--sure-font-body', '--sure-font-caption', '--sure-font-mono'] as const

const fixture = JSON.parse(
  readFileSync(join(process.cwd(), 'src/__fixtures__/themes-0.1.9.json'), 'utf8'),
) as Record<string, string>

/** The exact six-line block appended after `--line-height` in 0.3.7. */
const addedBlock = (css: string): string => {
  const body = /--font-body:\s*([^;]+);/.exec(css)?.[1]?.trim()
  const mono = /--font-mono:\s*([^;]+);/.exec(css)?.[1]?.trim()
  if (!body || !mono) throw new Error('theme has no --font-body/--font-mono stack')
  return '  /* Document typography stacks — print metrics live in SURE_TYPOGRAPHY (TS). */\n'
    + `  --sure-font-h1: ${body};\n`
    + `  --sure-font-h2: ${body};\n`
    + `  --sure-font-body: ${body};\n`
    + `  --sure-font-caption: ${body};\n`
    + `  --sure-font-mono: ${mono};\n`
}

describe('document typography: theme declarations', () => {
  for (const [name, css] of Object.entries(tokens)) {
    it(`${name} declares all five --sure-font-* variables`, () => {
      const missing = VARS.filter((v) => !css.includes(`${v}:`))
      expect(missing, `${name} is missing ${missing.join(', ')}`).toEqual([])
      // Generated tokens reach the shipped theme byte-for-byte.
      for (const v of VARS) {
        expect(themes[name as keyof typeof themes], `${name} lost ${v} in compose()`).toContain(`${v}:`)
      }
    })

    it(`${name} declares them exactly once, inside :root`, () => {
      for (const v of VARS) {
        expect(css.split(`${v}:`).length - 1, `${name} declares ${v} more than once`).toBe(1)
        const at = css.indexOf(`${v}:`)
        const depth = (css.slice(0, at).match(/{/g) ?? []).length - (css.slice(0, at).match(/}/g) ?? []).length
        expect(depth, `${name} declares ${v} outside a selector`).toBeGreaterThan(0)
      }
    })

    it(`${name} uses its own font stacks, and carries no new weight rule`, () => {
      const block = addedBlock(css)
      expect(css, `${name} typography block is not additive`).toContain(block)
      // Weights come from SURE_TYPOGRAPHY; the theme adds no font-weight rules.
      expect(block).not.toMatch(/font-weight\s*:/)
      // The four text styles follow this theme's body stack; only mono differs.
      const body = /--font-body:\s*([^;]+);/.exec(css)?.[1]?.trim()
      const mono = /--font-mono:\s*([^;]+);/.exec(css)?.[1]?.trim()
      for (const v of VARS.slice(0, 4)) {
        expect(new RegExp(`${v}:\\s*([^;]+);`).exec(css)?.[1]?.trim(), `${name} ${v}`).toBe(body)
      }
      expect(new RegExp('--sure-font-mono:\\s*([^;]+);').exec(css)?.[1]?.trim()).toBe(mono)
    })

    it(`${name} declares every CSS variable SURE_TYPOGRAPHY points at`, () => {
      for (const style of Object.values(SURE_TYPOGRAPHY)) {
        const v = /var\((--[a-z0-9-]+)\)/.exec(style.css)?.[1]
        expect(v, `no var() in ${style.css}`).toBeTruthy()
        expect(css, `${name} does not declare ${v}`).toContain(`${v}:`)
      }
    })
  }
})

describe('document typography: SURE_TYPOGRAPHY contract', () => {
  const EXPECTED = {
    heading1: { css: 'var(--sure-font-h1)', ptSize: 18, linePt: 22, weight: 700 },
    heading2: { css: 'var(--sure-font-h2)', ptSize: 14, linePt: 18, weight: 600 },
    body: { css: 'var(--sure-font-body)', ptSize: 10, linePt: 14, weight: 400 },
    caption: { css: 'var(--sure-font-caption)', ptSize: 8, linePt: 11, weight: 400 },
    mono: { css: 'var(--sure-font-mono)', ptSize: 9, linePt: 12, weight: 400 },
  } as const

  it('has exactly the five contracted keys', () => {
    expect(Object.keys(SURE_TYPOGRAPHY)).toEqual(Object.keys(EXPECTED))
  })

  it('matches the declared physical print metrics', () => {
    expect(SURE_TYPOGRAPHY).toEqual(EXPECTED)
  })

  it('is typed as literals, not widened number/string', () => {
    // Compile-time proof: `as const` keeps these assignable to literal types.
    const h1: { css: 'var(--sure-font-h1)'; ptSize: 18; linePt: 22; weight: 700 } = SURE_TYPOGRAPHY.heading1
    const kind: TypographyKind = 'caption'
    const style: TypographyStyle = SURE_TYPOGRAPHY[kind]
    expect([h1.ptSize, style.ptSize]).toEqual([18, 8])
  })

  it('is importable from the package root', async () => {
    const pkg = await import('./index.js')
    expect(pkg).toHaveProperty('SURE_TYPOGRAPHY')
    expect(pkg.SURE_TYPOGRAPHY).toBe(SURE_TYPOGRAPHY)
  })
})

/**
 * The 0.1.9 fixture is frozen: 0.3.7 may add the six-line typography block and
 * nothing else. These hashes are the SHA-256 of each theme's 0.1.9 string at
 * HEAD *before* that block; removing the block from today's fixture must
 * reproduce them exactly. A deleted or rewritten byte fails the hash.
 */
const FROZEN_0_1_9_SHA256: Record<string, string> = {
  nord: 'e85b02401d9823c9f20e2f6a60543eacd14320f13e2183df7189b5d17d56521c',
  forest: 'ff57a7b97fd87480530c4a2fc5de2a6d380ffd9577b7b9bd93a75ac126c3aedd',
  dracula: '9ad243245db354f58d335f67f688c61d4007f742d00e1d7172fcb60aafd5261b',
  dark: '996dc7e1c36538fac051ed214de669328263ab5b9d0754525433494bec851be1',
  positronic: 'eed065e058f4b6545affda187ffc4dc79319fb8feba4557d0373c4e00d3aa434',
  'vision-system': '90d92615a8981e797bef30e9a06186b7fc822dff2b1cfe75a74d9b2b26fe75ca',
  'vision-atkinson': 'a04fde5b539945a6b65368872efbeaaf03f2d140039a1c9b2ced9087d4b10546',
}

describe('document typography: frozen fixture is additive-only', () => {
  for (const [name, hash] of Object.entries(FROZEN_0_1_9_SHA256)) {
    it(`${name}: removing the typography block restores the 0.1.9 bytes`, () => {
      const css = fixture[name]!
      expect(css, `fixture lost theme ${name}`).toBeTruthy()
      const block = addedBlock(css)
      expect(css.split(block).length - 1, `${name} typography block is not exactly additive`).toBe(1)
      const restored = css.replace(block, '')
      expect(restored).not.toContain('--sure-font-')
      expect(restored).not.toContain('Document typography stacks')
      expect(createHash('sha256').update(restored).digest('hex')).toBe(hash)
    })
  }

  it('the fixture still covers exactly the seven themed tokens', () => {
    // compose(all) asserts the byte identity in index.test.ts; this pins the
    // theme set so a one-sided edit cannot hide behind the additive proof.
    expect(Object.keys(fixture).sort()).toEqual(Object.keys(tokens).sort())
    expect(Object.keys(FROZEN_0_1_9_SHA256).sort()).toEqual(Object.keys(tokens).sort())
  })
})
