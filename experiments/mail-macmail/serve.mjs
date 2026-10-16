// Static server for the mail-macmail demo: serves the sure-ui repo root so
// index.html can load mail-macmail.css and macmail-skin.css.
// Zero dependencies (same shape as experiments/browser-qa/serve.mjs).
//   node serve.mjs [port]      → http://127.0.0.1:8127/experiments/mail-macmail/
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname, normalize, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const port = Number(process.argv[2] || 8127)
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' }

createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  const rel = p.endsWith('/') ? `${p}index.html` : p
  const f = normalize(join(root, rel))
  if (!f.startsWith(root) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); return res.end('not found') }
  res.writeHead(200, { 'content-type': types[extname(f)] ?? 'application/octet-stream', 'cache-control': 'no-store' })
  res.end(readFileSync(f))
}).listen(port, () => console.log(`mail-macmail demo: http://127.0.0.1:${port}/experiments/mail-macmail/`))
