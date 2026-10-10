#!/usr/bin/env python3
"""Interactive passes the static run cannot make: hover states (playwright
pointer, real :hover matching) and the mobile layer at a phone viewport.

Writes its results back into raw.json under `interactions` / `mobile` so
record.mjs folds them into metrics/report/verdict.
"""
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
LABEL = sys.argv[1] if len(sys.argv) > 1 else "0.2.0b-unification"
URL = "http://127.0.0.1:8123/experiments/browser-qa/harness.html"
RAW = HERE / "runs" / LABEL / "raw.json"
raw = json.loads(RAW.read_text())

interactions, mobile = [], []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # --- hover pass, desktop ------------------------------------------------
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(URL, wait_until="load")
    page.wait_for_function("() => typeof window.__qa === 'object'")
    for theme in page.evaluate("() => window.__qa.themes"):
        page.evaluate("(t) => window.__qa.setTheme(t)", theme)
        tok = lambda n: page.evaluate(
            "(n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim()", n)

        def norm(v):
            # normalise a token value (var()/hex) to computed rgb() via a probe
            return page.evaluate(
                """(v) => { let s = document.getElementById('probe');
                     if (!s) { s = Object.assign(document.createElement('span'), {id: 'probe'}); document.body.appendChild(s) }
                     s.style.color = ''; s.style.color = v; return getComputedStyle(s).color }""",
                v)

        # primary button hover -> --primary-hover
        btn = page.locator(".btn-primary").first
        before = btn.evaluate("el => getComputedStyle(el).backgroundColor")
        btn.hover()
        after = btn.evaluate("el => getComputedStyle(el).backgroundColor")
        want = norm(tok("--primary-hover"))
        interactions.append({
            "theme": theme, "check": "btn-primary:hover",
            "before": before, "after": after, "want": want,
            "ok": after == want and before != after,
        })

        # table row hover -> --table-hover on cells
        cell = page.locator(".sure-table tbody tr").first.locator(".sure-table__cell").first
        before = cell.evaluate("el => getComputedStyle(el).backgroundColor")
        cell.hover()
        after = cell.evaluate("el => getComputedStyle(el).backgroundColor")
        want = norm(tok("--table-hover"))
        interactions.append({
            "theme": theme, "check": "table row:hover",
            "before": before, "after": after, "want": want,
            "ok": after == want,
        })

        # focus ring: form input gains a real box-shadow
        page.locator(".sure-form input").first.focus()
        shadow = page.locator(".sure-form input").first.evaluate(
            "el => getComputedStyle(el).boxShadow")
        interactions.append({
            "theme": theme, "check": "input:focus ring",
            "shadow": shadow, "ok": shadow not in ("none", ""),
        })
    page.close()

    # --- mobile layer, phone viewport --------------------------------------
    page = browser.new_page(viewport={"width": 375, "height": 812})
    page.goto(URL, wait_until="load")
    page.wait_for_function("() => typeof window.__qa === 'object'")
    for theme in page.evaluate("() => window.__qa.themes"):
        page.evaluate("(t) => window.__qa.setTheme(t)", theme)
        m = page.evaluate("""() => {
          const r = (s) => { const el = document.querySelector(s); return el ? el.getBoundingClientRect() : null }
          const cs = (s, p) => { const el = document.querySelector(s); return el ? getComputedStyle(el).getPropertyValue(p) : null }
          return {
            vw: innerWidth,
            formWidth: r('.sure-form')?.width,
            formMax: cs('.sure-form', 'max-width'),
            authWidth: r('.sure-auth__form')?.width,
            dialogW: r('.sure-dialog')?.width,
            toastMax: cs('.toast', 'max-width'),
            sidepanelW: r('.side-panel')?.width,
          }
        }""")
        mobile.append({
            "theme": theme,
            **m,
            "ok": (m["formWidth"] is not None and m["formWidth"] <= m["vw"]
                   and m["dialogW"] is not None and m["dialogW"] <= m["vw"]
                   and m["sidepanelW"] is not None and m["sidepanelW"] <= m["vw"]),
        })
    browser.close()

raw["interactions"] = interactions
raw["mobile"] = mobile
RAW.write_text(json.dumps(raw, indent=1) + "\n")

bad_i = [i for i in interactions if not i["ok"]]
bad_m = [m for m in mobile if not m["ok"]]
print(f"interactions: {len(interactions) - len(bad_i)}/{len(interactions)} ok")
for i in bad_i:
    print("  FAIL", i)
print(f"mobile: {len(mobile) - len(bad_m)}/{len(mobile)} ok")
for m in bad_m:
    print("  FAIL", json.dumps(m))
sys.exit(1 if (bad_i or bad_m) else 0)
