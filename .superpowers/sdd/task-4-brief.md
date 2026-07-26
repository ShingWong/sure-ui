### Task 4: Auth CSS Classes in sure-ui Themes

**Files:**
- Modify: `/usr/local/devel/sure-ui/src/styles/nord.ts`
- Modify: `/usr/local/devel/sure-ui/src/styles/forest.ts`
- Modify: `/usr/local/devel/sure-ui/src/styles/dracula.ts`
- Modify: `/usr/local/devel/sure-ui/src/index.test.ts`

- [ ] **Step 1: Add auth CSS to each theme**

Append to the end of each theme file (before the closing backtick), using each theme's CSS custom properties:

```css
/* ── Auth ── */
.sure-auth__form { max-width: 400px; margin: 2rem auto; padding: 2rem; background: var(--surface); border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.sure-auth__header { text-align: center; margin-bottom: 1.5rem; }
.sure-auth__header h1 { font-size: 1.5rem; font-weight: 700; color: var(--text); }
.sure-auth__header p { font-size: 0.875rem; color: var(--muted); margin-top: 0.25rem; }
.sure-auth__field { margin-bottom: 1rem; }
.sure-auth__label { display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 0.375rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.03em; }
.sure-auth__input { width: 100%; padding: 0.625rem 0.75rem; border: 1px solid var(--border); border-radius: 6px; font-size: 0.9375rem; background: var(--bg); color: var(--text); outline: none; transition: border-color 0.15s; }
.sure-auth__input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
.sure-auth__input--error { border-color: var(--error); }
.sure-auth__input--error:focus { box-shadow: 0 0 0 3px color-mix(in srgb, var(--error) 20%, transparent); }
.sure-auth__error { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--error); }
.sure-auth__help { display: block; margin-top: 0.25rem; font-size: 0.8rem; color: var(--muted); }
.sure-auth__btn { width: 100%; padding: 0.75rem; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; background: var(--accent); color: #fff; cursor: pointer; transition: opacity 0.15s; }
.sure-auth__btn:hover { opacity: 0.85; }
.sure-auth__btn:disabled { opacity: 0.5; cursor: not-allowed; }
.sure-auth__btn--social { display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 0.625rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); color: var(--text); font-size: 0.875rem; cursor: pointer; }
.sure-auth__btn--social:hover { background: var(--highlight); }
.sure-auth__divider { display: flex; align-items: center; gap: 1rem; margin: 1.25rem 0; color: var(--muted); font-size: 0.8125rem; }
.sure-auth__divider::before, .sure-auth__divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.sure-auth__footer { text-align: center; margin-top: 1.25rem; font-size: 0.875rem; color: var(--muted); }
.sure-auth__footer a { color: var(--accent); text-decoration: none; font-weight: 600; }
.sure-auth__footer a:hover { text-decoration: underline; }
.sure-auth__alert { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; margin-bottom: 1rem; }
.sure-auth__alert--error { background: color-mix(in srgb, var(--error) 10%, transparent); color: var(--error); border: 1px solid color-mix(in srgb, var(--error) 30%, transparent); }
.sure-auth__alert--success { background: color-mix(in srgb, var(--success) 10%, transparent); color: var(--success); border: 1px solid color-mix(in srgb, var(--success) 30%, transparent); }
.sure-auth__alert--info { background: color-mix(in srgb, var(--accent) 10%, transparent); color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); }
```

**Note:** For the `color-mix()` function — if the theme doesn't define `--error`, `--success`, `--warn` CSS variables, you may need to use hardcoded colors instead. Check each theme's CSS variables at the top of the file. For nord: `--nord11` (error/red), `--nord14` (success/green). For forest: `--frst-error`, `--frst-success`. For dracula: `--drac-error`, `--drac-success`.

Create mapping at the top of each theme's auth section:
- nord: `--error: var(--nord11); --success: var(--nord14); --warn: var(--nord13);`
- forest: `--error: var(--frst-error); --success: var(--frst-success); --warn: var(--frst-warn);`
- dracula: `--error: var(--drac-error); --success: var(--drac-success); --warn: var(--drac-warn);`

- [ ] **Step 2: Update tests to verify auth classes**

Add to `src/index.test.ts`:

```ts
it('all themes include auth classes', () => {
  for (const theme of [nord, forest, dracula]) {
    expect(theme).toContain('sure-auth__form')
    expect(theme).toContain('sure-auth__input')
    expect(theme).toContain('sure-auth__btn')
    expect(theme).toContain('sure-auth__error')
    expect(theme).toContain('sure-auth__divider')
  }
})
```

- [ ] **Step 3: Build and run tests**

```bash
cd /usr/local/devel/sure-ui && npm run build && npm test
```
Expected: Build OK, tests pass.

- [ ] **Step 4: Commit**

```bash
cd /usr/local/devel/sure-ui && git add -A && git commit -m "feat: add auth CSS classes to nord, forest, dracula themes"
```

---

