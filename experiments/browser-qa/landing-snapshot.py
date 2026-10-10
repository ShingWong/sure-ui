#!/usr/bin/env python3
"""Computed-style snapshot of the landing site: every element's load-bearing
properties, per page. Two runs (before/after a sure-ui change) diff to prove
the change altered nothing visible — or to show exactly what it altered.
Usage: python3 snapshot.py <out.json> [base_url]
"""
import json
import sys
from playwright.sync_api import sync_playwright

out_path = sys.argv[1]
base = sys.argv[2] if len(sys.argv) > 2 else "http://127.0.0.1:8080"
PAGES = ["/", "/projects/", "/sure/", "/license/"]
PROPS = ["color", "background-color", "font-family", "font-size", "font-weight",
         "padding", "margin", "border-color", "border-radius", "max-width",
         "width", "height", "display", "position", "text-decoration-line",
         "cursor", "line-height", "letter-spacing", "text-transform"]

snap = {}
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    for route in PAGES:
        pg.goto(base + route, wait_until="load")
        pg.wait_for_timeout(120)
        snap[route] = pg.evaluate("""(props) => {
          const out = []
          const els = [document.body, ...document.querySelectorAll('body *')]
          for (const el of els) {
            const cs = getComputedStyle(el)
            // stable identity: tag + classes + index among same-tag siblings
            const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).join('.') : ''
            const idx = [...(el.parentElement?.children ?? [])].filter(c => c.tagName === el.tagName).indexOf(el)
            const rec = { id: el.tagName.toLowerCase() + cls + ':' + idx }
            for (const p of props) rec[p] = cs.getPropertyValue(p)
            if (el.getAttribute('href')) rec.href = el.getAttribute('href')
            if (el.getAttribute('data-theme')) rec.dt = el.getAttribute('data-theme')
            out.push(rec)
          }
          return out
        }""", PROPS)
        print(f"  {route}: {len(snap[route])} elements", flush=True)
    b.close()

with open(out_path, "w") as f:
    json.dump(snap, f, indent=0)
print(f"-> {out_path}")
