// Static server for the browser QA harness: serves the sure-ui repo root so
// harness.html can import /dist/compose.js (browser-safe ESM, verified no
// node: imports). Zero dependencies.
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname, normalize, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const port = Number(process.argv[2] || 8123)
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.map': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2' }

createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (p.endsWith('/')) p += 'index.html'
  let f = normalize(join(root, p))
  if (!f.startsWith(root) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); return res.end('not found') }
  res.writeHead(200, { 'content-type': types[extname(f)] ?? 'application/octet-stream', 'cache-control': 'no-store' })
  res.end(readFileSync(f))
}).listen(port, () => console.log(`harness server: http://127.0.0.1:${port}/experiments/browser-qa/harness.html`))
