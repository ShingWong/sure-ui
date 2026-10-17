/**
 * Types for scripts/security-check.mjs. The script is dependency-free plain
 * ESM (it runs under bare `node` in prepublishOnly), so its surface is
 * declared here for the vitest suite and `tsc --noEmit`.
 */
export interface SecurityFinding {
  /** Repo-relative path. */
  file: string
  /** 1-based line number. */
  line: number
  /** Pattern label, e.g. "GitHub token" or "SSN". */
  label: string
  /** Redacted match — never the full secret. */
  hint: string
}

export function scanText(text: string, file?: string): SecurityFinding[]
export function scanRepo(): SecurityFinding[]
