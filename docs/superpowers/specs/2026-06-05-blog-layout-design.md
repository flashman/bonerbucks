# Blog Layout — Consistency & Mobile Design

**Date:** 2026-06-05  
**Status:** Approved

## Problem

The `/blog` route has three issues:

1. `app/blog/layout.tsx` is an unmodified Next.js boilerplate file. It wraps its children in a second `<html><body>`, creating invalid nested HTML inside the root layout. Browsers discard the inner tags silently, so the page looks correct, but the HTML is malformed.

2. Embedded media (YouTube, Vimeo iframes) has hardcoded `width={560}` / `width={500}` attributes. On narrow screens the iframes overflow their container horizontally.

3. Posts have no visual separation — no border, no consistent spacing — making the archive hard to scan.

## Scope

- **In scope:** `app/blog/layout.tsx`, `app/blog/page.tsx`, `app/globals.css`
- **Out of scope:** `app/boners/layout.tsx` (same boilerplate issue exists but /boners is not reported broken), blog content, admin post management, database

## Design

### Fix 1 — Remove invalid nested layout

Delete `app/blog/layout.tsx` entirely. Next.js App Router automatically inherits `app/layout.tsx` for any route that has no layout file. The blog page already exports its own `metadata` title (`"Blog — Bonerbucks"`), so nothing is lost.

**Safety:** The visible output is identical before and after — the invalid `<html><body>` wrapper that browsers discard is simply gone. Verify locally (`npm run dev`, visit `/blog`) before opening the PR.

### Fix 2 — Responsive iframes

Add an `.embed-wrapper` CSS class to `globals.css` that uses the padding-top aspect-ratio trick (works in all browsers, including older Safari):

```css
.post .media .embed-wrapper {
  position: relative;
  padding-top: 56.25%; /* 16:9 */
  height: 0;
}
.post .media .embed-wrapper iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  border: 0;
}
```

In `app/blog/page.tsx`, wrap every `<iframe>` in `<div className="embed-wrapper">`. Remove the hardcoded `width` and `height` props from the iframes.

Also update the existing image rule to be fully mobile-safe:

```css
.post .media img { max-width: 100%; height: auto; }
```

### Fix 3 — Post date badge styling

Replace the bare `<h5><a>` date treatment in `.post` with a black badge style that matches the site's existing black header/nav aesthetic. CSS-only change in `globals.css`; no JSX structure changes needed for styling.

```css
.post {
  padding-bottom: 18px;
  margin-bottom: 2px;
  border-bottom: 1px solid #e8e8e8;
}
.post:last-child { border-bottom: none; }

.post h5 {
  margin-bottom: 8px;
}
.post h5 a {
  display: inline-block;
  background: black;
  color: white;
  font-family: "futura", "univers", "helvetica", sans-serif;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 7px;
}
.post h5 a:hover {
  background: #333;
  color: white;
}
```

### Fix 4 — Remove stray `<br />` elements

`app/blog/page.tsx` has several bare `<br />` elements between hardcoded posts. With the new `border-bottom` + padding on `.post`, these create inconsistent extra gaps — some post pairs would have more space than others. Remove all `<br />` elements that appear between `.post` divs; the CSS spacing handles separation uniformly.

## Files Changed

| File | Change |
|------|--------|
| `app/blog/layout.tsx` | **Delete** |
| `app/globals.css` | Add `.embed-wrapper`, update `.post` badge styling, fix img `max-width` |
| `app/blog/page.tsx` | Wrap each `<iframe>` in `<div className="embed-wrapper">`, remove hardcoded width/height, remove stray `<br />` elements between posts |

## Delivery

- Work on a new branch (e.g. `blog-layout-fixes`)
- Test locally at `npm run dev` before opening PR
- PR to `main`
