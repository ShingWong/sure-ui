import { describe, it, expect } from 'vitest'
import { scanText, scanRepo } from '../scripts/security-check.mjs'

/**
 * These tests are the gate's own proof: a scanner that never fires is worse
 * than none. Each `detects` case is a realistic leak shape; each `allows` case
 * is a look-alike that must NOT fire (semver, scoped packages, CSS numbers,
 * reserved example domains) — false positives would train people to widen the
 * patterns until the gate is useless.
 */
describe('security check: detects leaks', () => {
  const cases: Array<[string, string]> = [
    ['AWS access key id', 'const k = "AKIAIOSFODNN7EXAMPLE"'],
    ['GitHub token', 'token: ghp_' + 'a'.repeat(36)],
    ['Slack token', 'slack = "xoxb-1234567890-abcdefghij"'],
    ['Google API key', 'key = "AIza' + 'b'.repeat(35) + '"'],
    ['OpenAI/Anthropic key', 'key = "sk-' + 'c'.repeat(32) + '"'],
    ['Stripe live key', 'stripe = "sk_live_' + 'd'.repeat(24) + '"'],
    ['JWT', 'auth = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"'],
    ['Private key block', '-----BEGIN RSA PRIVATE KEY-----'],
    ['Credentials in URL', 'const db = "postgres://admin:hunter2@db.internal/app"'],
    ['Hardcoded password', 'const cfg = { password: "s3cretPass" }'],
    ['SSN', 'patient 123-45-6789'],
    ['Card number', 'card 4111 1111 1111 1111'],
    ['Private IP address', 'host 10.20.30.40'],
    ['Internal filesystem path', 'open("/Users/swong/private/notes.md")'],
    ['Email address', 'contact alice@realcorp.example.co'],
    ['Committed environment file', 'not a text pattern'],
  ]

  for (const [label, line] of cases) {
    if (label === 'Committed environment file') continue // file-name rule, covered by scanRepo
    it(`flags ${label}`, () => {
      const findings = scanText(line, 'src/example.ts')
      expect(findings.map((f) => f.label)).toContain(label)
    })
  }

  it('does not print the full secret in the finding', () => {
    const secret = 'ghp_' + 'z'.repeat(36)
    const [finding] = scanText(`token: ${secret}`, 'src/example.ts')
    if (!finding) throw new Error('expected the gate to flag the token')
    expect(finding.hint).not.toContain(secret)
  })
})

describe('security check: allows look-alikes', () => {
  const cases: Array<[string, string]> = [
    ['semver', 'version 10.2.3 and 192.168.1 are fine'],
    ['scoped package', "import x from '@shing.wong/sure-ui'"],
    ['reserved example email', 'contact user@example.com'],
    ['git remote', 'git clone git@github.com:ShingWong/sure-ui.git'],
    ['non-Luhn long number', 'order 1234 5678 9012 3456'],
    ['CSS lengths', 'flex: 0 0 1920px; gap: 10px'],
    ['placeholder key', 'use YOUR_API_KEY_HERE'],
  ]

  for (const [name, line] of cases) {
    it(`ignores ${name}`, () => {
      expect(scanText(line, 'src/example.ts')).toEqual([])
    })
  }
})

describe('security check: allow-list is scoped', () => {
  it('passes the documented README placeholder', () => {
    const line = "createSimpleAuth({ password: 'StrongPass1!' })"
    expect(scanText(line, 'README.md')).toEqual([])
    // Same text elsewhere is still a finding: the exemption is file-scoped.
    expect(scanText(line, 'src/other.ts').length).toBeGreaterThan(0)
  })
})

describe('security check: this repository is clean', () => {
  it('finds nothing in tracked files', () => {
    expect(scanRepo()).toEqual([])
  })
})
