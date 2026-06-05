# Blog Layout Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the blog page's invalid nested layout, make iframes and images responsive on mobile, and add consistent post styling with a black date badge.

**Architecture:** Three targeted edits across two files, plus deleting a boilerplate layout file. No new files or components. All media responsiveness handled via CSS; JSX changes limited to adding wrapper divs and removing stray `<br />` elements.

**Tech Stack:** Next.js 15 App Router, Tailwind (globals.css for site-wide styles), TypeScript/JSX

---

## File Map

| Action | File | What changes |
|--------|------|-------------|
| Delete | `app/blog/layout.tsx` | Removes invalid nested `<html><body>` wrapper |
| Modify | `app/globals.css` | Responsive iframe container, post badge styling, img max-width |
| Modify | `app/blog/page.tsx` | Wrap 4 iframes in `.embed-wrapper`, remove 12 standalone `<br />` elements |

---

### Task 1: Create the feature branch

**Files:** none

- [ ] **Step 1: Create and switch to branch**

```bash
git checkout -b blog-layout-fixes
```

Expected: `Switched to a new branch 'blog-layout-fixes'`

- [ ] **Step 2: Confirm clean state**

```bash
git status
```

Expected: `nothing to commit, working tree clean`

---

### Task 2: Delete the invalid blog layout

The file `app/blog/layout.tsx` is an unmodified Next.js boilerplate that wraps its children in a second `<html><body>`. Next.js App Router automatically inherits `app/layout.tsx` for any route without its own layout, so deleting this file is safe. The blog page already exports its own metadata title.

**Files:**
- Delete: `app/blog/layout.tsx`

- [ ] **Step 1: Start the dev server (keep it running throughout)**

```bash
npm run dev
```

Open http://localhost:3000/blog and note the current state: header, nav, and footer should all be visible.

- [ ] **Step 2: Delete the layout file**

```bash
rm app/blog/layout.tsx
```

- [ ] **Step 3: Verify /blog still works**

Reload http://localhost:3000/blog. Confirm:
- The Bonerbucks header image is visible
- The nav bar (TRACK / REPORT / MAKE etc.) is visible
- The footer is visible
- Post content renders normally

If anything is missing, restore the file with `git checkout app/blog/layout.tsx` and investigate before continuing.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Remove invalid nested blog layout"
```

---

### Task 3: Update globals.css — responsive media and post badge styling

Replace the existing `.post` rules in the `/* ── Blog ──*/` section of `app/globals.css` and add the `.embed-wrapper` responsive iframe container.

**Files:**
- Modify: `app/globals.css` (Blog section, currently lines 97–101)

- [ ] **Step 1: Replace the Blog section in globals.css**

Find the existing blog section:
```css
/* ── Blog ── */
.post { padding-bottom: 10px; }
.post .media { text-align: center; }
.post .media img { max-width: 600px; }
.post .media .source { font-size: 10pt; }
```

Replace it entirely with:
```css
/* ── Blog ── */
.post {
  padding-top: 4px;
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

.post .media { text-align: center; margin-top: 8px; }
.post .media img { max-width: 100%; height: auto; }
.post .media .source { font-size: 10pt; }

/* Responsive 16:9 iframe container */
.post .media .embed-wrapper {
  position: relative;
  padding-top: 56.25%;
  height: 0;
  overflow: hidden;
}
.post .media .embed-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
```

- [ ] **Step 2: Verify styling in browser**

Reload http://localhost:3000/blog. Check:
- Each post has a thin gray bottom border separating it from the next
- The date line shows as a small black pill badge (e.g. `MARCH 18 2014`)
- Images don't overflow on a narrow browser window (drag the window to ~320px wide to simulate mobile)
- The last post has no bottom border

The iframes will still be fixed-width at this point — that's fixed in Task 4.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "Add responsive media and post badge styling to blog"
```

---

### Task 4: Update blog/page.tsx — wrap iframes and remove stray br elements

**Files:**
- Modify: `app/blog/page.tsx`

There are 4 iframes and 12 standalone `<br />` elements between posts to fix. The inline `<br />` elements inside `<p>` tags within the gifting post (lines 125–133) are content breaks, not post separators — leave those alone.

- [ ] **Step 1: Wrap the Vimeo iframe (line 59)**

Find:
```tsx
<iframe src="//player.vimeo.com/video/79148964" width={500} height={281} allowFullScreen title="Mark Wagner - Money is Material" />
```

Replace with:
```tsx
<div className="embed-wrapper">
  <iframe src="//player.vimeo.com/video/79148964" allowFullScreen title="Mark Wagner - Money is Material" />
</div>
```

- [ ] **Step 2: Wrap the first YouTube iframe (line 142)**

Find:
```tsx
<iframe width={560} height={315} src="//www.youtube.com/embed/rr6LtOCFwVM" allowFullScreen title="Art as Money interviews" />
```

Replace with:
```tsx
<div className="embed-wrapper">
  <iframe src="//www.youtube.com/embed/rr6LtOCFwVM" allowFullScreen title="Art as Money interviews" />
</div>
```

- [ ] **Step 3: Wrap the second YouTube iframe (line 219)**

Find:
```tsx
<iframe width={560} height={315} src="http://www.youtube.com/embed/1Qs9w1XlJKE" allowFullScreen title="Rolling Jubilee" />
```

Replace with:
```tsx
<div className="embed-wrapper">
  <iframe src="http://www.youtube.com/embed/1Qs9w1XlJKE" allowFullScreen title="Rolling Jubilee" />
</div>
```

- [ ] **Step 4: Wrap the third YouTube iframe (line 228)**

Find:
```tsx
<iframe width={560} height={315} src="http://www.youtube.com/embed/8nif01WZ9aI" allowFullScreen title="What if money didn't matter?" />
```

Replace with:
```tsx
<div className="embed-wrapper">
  <iframe src="http://www.youtube.com/embed/8nif01WZ9aI" allowFullScreen title="What if money didn't matter?" />
</div>
```

- [ ] **Step 5: Remove standalone `<br />` elements between posts**

Remove these 12 standalone `<br />` lines (they appear at the top-level of the outer `<div>`, between `.post` divs). Do NOT remove the `<br />` elements that are inside `<p>` tags within the gifting post.

Lines to remove (by their position in the original file — find and delete each bare `<br />`):
- After the Nov 15 2013 post block
- After the Nov 8 2013 post block  
- After the Sep 27 2013 post block
- After the Aug 21 2013 post block
- After the Aug 12 2013 post block
- After the August 2 2013 post block
- After the July 30 2013 post block
- After the April 7 2013 post block
- After the Jan 13 2013 post block
- After the Jan 3 2013 post block
- After the Dec 23 2012 post block
- After the Dec 10 2012 post block

You can find them all with:
```bash
grep -n "^[[:space:]]*<br />" app/blog/page.tsx
```

Each result should be a line containing only `<br />` (with optional indentation). Delete each of those lines.

- [ ] **Step 6: Verify no TypeScript errors**

```bash
npm run build
```

Expected: Build completes with no type errors. (A few ESLint warnings about `dangerouslySetInnerHTML` are pre-existing and can be ignored.)

- [ ] **Step 7: Verify iframes in browser**

Reload http://localhost:3000/blog and check:
- All 4 embedded videos render at full width within the content column
- Drag the browser to ~375px wide — iframes should scale down, no horizontal scroll
- No extra gaps between posts (the `<br />` removal worked)

- [ ] **Step 8: Commit**

```bash
git add app/blog/page.tsx
git commit -m "Wrap iframes in responsive container, remove stray br elements"
```

---

### Task 5: Open the PR

**Files:** none

- [ ] **Step 1: Push the branch**

```bash
git push -u origin blog-layout-fixes
```

- [ ] **Step 2: Open the PR**

```bash
gh pr create \
  --title "Blog: fix layout, responsive media, post badge styling" \
  --body "$(cat <<'EOF'
## Summary
- Delete `app/blog/layout.tsx` — removes invalid nested `<html><body>` wrapper (boilerplate file that was never customised)
- Make all 4 embedded iframes responsive (16:9 aspect-ratio container) — no more horizontal overflow on mobile
- Fix `img` to `max-width: 100%; height: auto`
- Add black date badge to each post, consistent border separator between posts, remove stray `<br />` spacing elements

## Test plan
- [ ] Visit `/blog` on desktop — header, nav, footer, all posts visible
- [ ] Drag browser to ~375px — iframes scale, no horizontal scroll
- [ ] Dates render as small black uppercase badges
- [ ] Thin gray line between each post, last post has no bottom border
EOF
)"
```

---

## Done

All three spec items covered:
- ✅ Fix 1 (layout shell) — Task 2
- ✅ Fix 2 (responsive media) — Tasks 3 & 4
- ✅ Fix 3 (post badge styling) — Task 3
- ✅ Fix 4 (remove stray `<br />`) — Task 4
