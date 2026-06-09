# Serial OCR Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When a user selects an image file during record creation, automatically run client-side OCR to detect a serial number matching `[A-Z][0-9]{8}[A-Z]` and pre-fill the serial field.

**Architecture:** Tesseract.js is dynamically imported inside `RecordForm.tsx` only when the user picks a file (zero bundle cost for users who don't upload). An `abortRef` flag cancels stale scans if the user picks a new image while one is running. All changes are confined to `components/RecordForm.tsx` and `package.json`.

**Tech Stack:** Tesseract.js (client-side OCR, dynamic import), React `useRef`/`useState`, existing Next.js 15 App Router + TypeScript project.

---

### Task 1: Install tesseract.js

**Files:**
- Modify: `package.json`

No test suite exists for this project. Manual verification after each task.

- [ ] **Step 1: Install the dependency**

```bash
npm install tesseract.js
```

Expected output includes `added N packages` with no errors.

- [ ] **Step 2: Verify types are available**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors (tesseract.js ships its own types).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add tesseract.js dependency for client-side OCR"
```

---

### Task 2: Add scanning state and abortRef to RecordForm

**Files:**
- Modify: `components/RecordForm.tsx` (lines 29–35, state declarations)

- [ ] **Step 1: Add two new state variables and an abort ref after the existing state declarations**

In `components/RecordForm.tsx`, the existing state block ends around line 35 with `const [geocoding, setGeocoding] = useState(false);`. Add immediately after it:

```tsx
const [scanning, setScanning] = useState(false);
const [scanNote, setScanNote] = useState<string | null>(null);
const abortRef = useRef(false);
```

The `useRef` import is not yet in the file — update the React import at line 3:

```tsx
import { useState, useRef } from "react";
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/RecordForm.tsx
git commit -m "Add scanning state and abortRef to RecordForm"
```

---

### Task 3: Implement scanForSerial function

**Files:**
- Modify: `components/RecordForm.tsx` (add function after `geocodeLocation`)

- [ ] **Step 1: Add the `scanForSerial` function inside the component, after the `geocodeLocation` function (around line 59)**

```tsx
async function scanForSerial(file: File) {
  abortRef.current = false;
  setScanning(true);
  setScanNote(null);
  try {
    const { recognize } = await import("tesseract.js");
    const { data: { text } } = await recognize(file, "eng");
    if (abortRef.current) return;
    const matches = text.match(/[A-Z][0-9]{8}[A-Z]/g);
    if (matches && matches.length > 0) {
      setSerial(matches[0]);
      setScanNote("SERIAL FOUND — PLEASE VERIFY");
    } else {
      setScanNote("COULDN'T FIND SERIAL IN IMAGE");
    }
  } catch {
    // Tesseract failed to load or crashed — fail silently
  } finally {
    if (!abortRef.current) setScanning(false);
  }
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/RecordForm.tsx
git commit -m "Implement scanForSerial with Tesseract.js dynamic import"
```

---

### Task 4: Wire scanForSerial into the image file input onChange

**Files:**
- Modify: `components/RecordForm.tsx` (the file input `onChange` handler, around line 182)

- [ ] **Step 1: Update the file input `onChange` handler to call `scanForSerial`**

Find the existing `onChange` handler:

```tsx
onChange={(e) => {
  const file = e.target.files?.[0] ?? null;
  setImageFile(file);
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  setPreviewUrl(file ? URL.createObjectURL(file) : null);
}}
```

Replace it with:

```tsx
onChange={(e) => {
  const file = e.target.files?.[0] ?? null;
  abortRef.current = true;
  setScanning(false);
  setScanNote(null);
  setImageFile(file);
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  setPreviewUrl(file ? URL.createObjectURL(file) : null);
  if (file) scanForSerial(file);
}}
```

Setting `abortRef.current = true` before starting the new scan cancels any in-flight scan from a previously selected file.

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/RecordForm.tsx
git commit -m "Wire image file onChange to trigger serial OCR scan"
```

---

### Task 5: Add scan feedback UI below the file input

**Files:**
- Modify: `components/RecordForm.tsx` (JSX section inside the IMAGE field-row div)

- [ ] **Step 1: Add scanning indicator and scanNote display**

Find the block that renders the preview image (around line 189). It currently reads:

```tsx
{previewUrl && (
  <div style={{ marginTop: 4 }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={previewUrl} alt="Preview" style={{ maxWidth: 105, maxHeight: 45, display: "block" }} />
    <p style={{ fontSize: 11, color: imageFile && imageFile.size > MAX_IMAGE_BYTES ? "red" : "#777", marginTop: 2 }}>
      {imageFile?.name} ({(imageFile!.size / (1024 * 1024)).toFixed(2)} MB)
      {imageFile && imageFile.size > MAX_IMAGE_BYTES ? " — TOO LARGE" : ""}
    </p>
  </div>
)}
```

After the closing `)}` of that block (and before the `{record?.image_path && ...}` block), add:

```tsx
{scanning && (
  <span style={{ fontSize: 11, color: "#777", display: "block", marginTop: 4 }}>SCANNING FOR SERIAL...</span>
)}
{!scanning && scanNote && (
  <span style={{ fontSize: 11, color: scanNote.startsWith("SERIAL") ? "green" : "#aaa", display: "block", marginTop: 4 }}>
    {scanNote}
  </span>
)}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Lint**

```bash
npm run lint 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add components/RecordForm.tsx
git commit -m "Add scanning status feedback UI to RecordForm image section"
```

---

### Task 6: Clear scanNote when user manually edits the serial field

**Files:**
- Modify: `components/RecordForm.tsx` (serial input `onChange`, around line 139)

- [ ] **Step 1: Update the serial input `onChange` to clear `scanNote`**

Find the existing serial input `onChange`:

```tsx
onChange={(e) => setSerial(e.target.value)}
```

Replace with:

```tsx
onChange={(e) => { setSerial(e.target.value); setScanNote(null); }}
```

- [ ] **Step 2: Type-check and lint**

```bash
npx tsc --noEmit 2>&1 | head -20 && npm run lint 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/RecordForm.tsx
git commit -m "Clear scanNote when user manually edits serial field"
```

---

### Task 7: Manual end-to-end verification

**Files:** none (testing only)

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Open http://localhost:3000/boners/new

- [ ] **Step 2: Test — serial found**

Take a photo of a dollar bill (or use any image with text containing a pattern like `B12345678C`). Upload it via the IMAGE field. Expected:
- `SCANNING FOR SERIAL...` appears while Tesseract loads/runs
- Serial field is populated with the detected value (e.g. `B12345678C`)
- `SERIAL FOUND — PLEASE VERIFY` appears in green
- Serial field is editable — type over the value to confirm it changes; scanNote disappears

- [ ] **Step 3: Test — serial not found**

Upload an image that contains no serial-shaped text (e.g. a landscape photo). Expected:
- `SCANNING FOR SERIAL...` appears briefly
- `COULDN'T FIND SERIAL IN IMAGE` appears in muted colour
- Serial field is unchanged

- [ ] **Step 4: Test — image swap while scanning**

Pick one image, then immediately pick a different image before scanning finishes. Expected:
- No stale serial from the first image appears
- Scan runs for the second image only

- [ ] **Step 5: Build check**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds with no errors.
