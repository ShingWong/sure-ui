#!/usr/bin/env python3
"""Computed-style snapshot of the sure-ui harness across every theme.
Paired with landing-snapshot.py: run before and after a compose() change,
diff to prove the change altered no computed value (or show exactly which).
Usage: python3 harness-snapshot.py <out.json>
"""
import json
import sys
from playwright.sync_api import sync_playwright

out_path = sys.argv[1]
URL = "http://127.0.0.1:8123/experiments/browser-qa/harness.html"
PROPS = ["color", "background-color", "font-family", "font-size", "font-weight",
         "padding", "margin", "border-color", "border-radius", "max-width",
         "width", "height", "display", "position", "text-decoration-line",
         "cursor", "line-height", "letter-spacing", "text-transform",
         "box-shadow", "animation-name", "z-index", "opacity", "visibility",
         "top", "right", "min-height", "flex-direction", "gap"]

snap = {}
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto(URL, wait_until="load")
    pg.wait_for_function("() => typeof window.__qa === 'object'")
    for theme in pg.evaluate("() => window.__qa.themes"):
        pg.evaluate("(t) => window.__qa.setTheme(t)", theme)
        snap[theme] = pg.evaluate("""(props) => {
          const out = []
          const els = [document.body, ...document.querySelectorAll('body *')]
          for (const el of els) {
            const cs = getComputedStyle(el)
            const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).join('.') : ''
            const idx = [...(el.parentElement?.children ?? [])].filter(c => c.tagName === el.tagName).indexOf(el)
            const rec = { id: el.tagName.toLowerCase() + cls + ':' + idx }
            for (const p of props) rec[p] = cs.getPropertyValue(p)
            out.push(rec)
          }
          return out
        }""", PROPS)
        print(f"  {theme}: {len(snap[theme])} elements", flush=True)
    b.close()

with open(out_path, "w") as f:
    json.dump(snap, f, indent=0)
print(f"-> {out_path}")
