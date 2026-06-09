# Serial OCR from Bill Photo — Design Spec

**Date:** 2026-06-09  
**Status:** Approved

## Summary

When a user picks an image file during record creation, the app automatically runs client-side OCR (Tesseract.js) on the image to detect the bill's serial number and pre-fill the serial field. The serial field remains editable so users can correct misreads.

## Approach

Client-side OCR via Tesseract.js, dynamically imported on demand. No server, no API key, no cost. Tesseract is only downloaded when the user actually selects a file — users who never use the image upload pay zero bundle cost.

## Architecture & Flow

All changes are confined to `components/RecordForm.tsx`.

1. User selects an image file via the existing file input.
2. Existing `onChange` handler sets `imageFile` and `previewUrl` as today.
3. A new `scanForSerial(file: File)` function is called immediately after.
4. `scanForSerial` dynamically imports Tesseract.js, sets `scanning: true`, runs recognition on the file.
5. Raw OCR text is regex-matched against `/[A-Z][0-9]{8}[A-Z]/g`.
6. If one or more matches: call `setSerial(matches[0])` and set `scanNote` to `"SERIAL FOUND — PLEASE VERIFY"`.
7. If no matches: leave serial field unchanged, set `scanNote` to `"COULDN'T FIND SERIAL IN IMAGE"`.
8. Set `scanning: false`.

## New State

```ts
const [scanning, setScanning] = useState(false);
const [scanNote, setScanNote] = useState<string | null>(null);
```

## UI Feedback

Below the file input, in the same area as the existing preview/filename line:

- While scanning: `SCANNING FOR SERIAL...` (muted, same style as `GEOCODING...`)
- Serial found: `SERIAL FOUND — PLEASE VERIFY` (green, same style as `✓ LOCATED`)
- Not found: `COULDN'T FIND SERIAL IN IMAGE` (muted)

`scanNote` and `scanning` are cleared when:
- The user picks a new image (resets and restarts scan)
- The user manually edits the serial field

## Edge Cases

| Scenario | Behaviour |
|---|---|
| New image picked while scan in progress | Cancel in-flight scan (abort ref), start fresh |
| Tesseract fails to load (network error) | Silently swallow error, no scan message |
| Serial field already has a value | Overwrite with scanned result if found |
| Edit mode (serial field disabled) | Scan runs but `setSerial` is a no-op; no visible feedback |
| Multiple serial-pattern matches in OCR output | Use first match |

## Cancellation

An `abortRef = useRef(false)` flag is set to `true` when a new file is chosen while a scan is running. The `scanForSerial` function checks this flag before calling `setSerial` or `setScanNote`.

## Dependencies

- `tesseract.js` npm package (dynamically imported, not in initial bundle)

## Out of Scope

- Server-side OCR
- Edit-mode serial scanning (field is disabled)
- Confidence thresholds / multiple candidate UI
