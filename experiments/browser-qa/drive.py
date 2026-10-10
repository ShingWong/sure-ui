#!/usr/bin/env python3
"""Browser QA driver for the sure-ui 0.2.0b unification.

Loads experiments/browser-qa/harness.html, runs window.__qa.run() for every
theme plus the compile-time-subset proofs, captures screenshots, and writes
the raw JSON that record.mjs turns into meta/metrics/report.

Sanctioned use of raw playwright: browser-level geometry and contrast
measurement (per operator, 2026-10-09 session). No page mutation beyond what
the harness itself exposes.
"""
import json
import socket
import sys
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
LABEL = sys.argv[1] if len(sys.argv) > 1 else "0.2.0b-unification"
URL = "http://127.0.0.1:8123/experiments/browser-qa/harness.html"
OUT = HERE / "runs" / LABEL
OUT.mkdir(parents=True, exist_ok=True)
SHOTS = OUT / "screenshots"
SHOTS.mkdir(exist_ok=True)

SUBSETS = [["form"], ["buttons", "form"], ["table", "status"], ["form", "table", "toast"]]
BASELINE = HERE / "baseline-0.1.9.json"

started = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
results, subsets, shots, console_errors = [], [], [], []
baseline = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.on("console", lambda m: console_errors.append(f"{m.type}: {m.text}") if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append(f"pageerror: {e}"))
    page.goto(URL, wait_until="load")
    page.wait_for_function("() => typeof window.__qa === 'object'")

    for theme in page.evaluate("() => window.__qa.themes"):
        page.evaluate("(t) => window.__qa.setTheme(t)", theme)
        page.evaluate("() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))")
        out = page.evaluate("() => window.__qa.run()")
        results.append(out)
        print(f"  {theme:18s} {out['struct']['cssBytes']:6d}B  "
              f"{sum(1 for c in out['contrasts'] if not c.get('error'))} pairs", flush=True)
        if theme in ("nord", "vision-atkinson", "dark"):
            page.evaluate("(t) => document.documentElement.classList.remove('qa-clean')", theme)
            page.screenshot(path=str(SHOTS / f"harness-{theme}.png"), full_page=True)
            page.evaluate("() => document.documentElement.classList.add('qa-clean')")
            shots.append(f"screenshots/harness-{theme}.png")
        else:
            page.evaluate("(t) => document.documentElement.classList.add('qa-clean')", theme)

    # one clean in-page shot per remaining theme at viewport size (cheap)
    for theme in ("forest", "dracula", "positronic", "vision-system"):
        page.evaluate("(t) => window.__qa.setTheme(t)", theme)
        page.evaluate("() => document.documentElement.classList.add('qa-clean')")
        page.screenshot(path=str(SHOTS / f"viewport-{theme}.png"))
        shots.append(f"screenshots/viewport-{theme}.png")

    # compile-time inclusion proofs
    for want in SUBSETS:
        got = page.evaluate("(c) => window.__qa.subset(c)", want)
        subsets.append({"want": want, "got": got})
        print(f"  subset {','.join(want):24s} {got['bytes']:6d}B  "
              f"form={got['hasForm']} table={got['hasTable']} toast={got['hasToast']}", flush=True)

    # baseline A/B: identical measurements against the ORIGINAL 0.1.9 strings
    if BASELINE.exists():
        orig = json.loads(BASELINE.read_text())
        for theme, css in orig.items():
            page.evaluate("([n, c]) => window.__qa.setThemeRaw(n, c)", [theme, css])
            page.evaluate("() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))")
            out = page.evaluate("() => window.__qa.run()")
            out["theme"] = theme  # tag as baseline (run() already tags -0.1.9)
            baseline.append(out)
            print(f"  baseline {theme:18s} {out['struct']['cssBytes']:6d}B", flush=True)

    browser.close()

raw = {
    "started": started,
    "host": socket.gethostname(),
    "browser": "playwright-chromium",
    "results": results,
    "subsets": subsets,
    "screenshots": shots,
    "baseline": baseline,
    "notes": "console errors: " + ("none" if not console_errors else "; ".join(console_errors[:10])),
}
(OUT / "raw.json").write_text(json.dumps(raw, indent=1) + "\n")
print(f"raw.json written ({len(results)} themes, {len(baseline)} baseline, {len(subsets)} subsets, "
      f"{len(shots)} shots, console: {len(console_errors)} errors)")
