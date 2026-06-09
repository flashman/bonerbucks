# Crop Tool Design

**Date:** 2026-06-09  
**Status:** Approved

## Overview

Add a simple click-and-drag crop tool to the image preview in `RecordForm.tsx`, alongside the existing rotate/flip transform buttons.

## Behaviour

A `✂` button is added to the hover toolbar (the row of 26×26px dark overlay buttons at the top-left of the preview image). It is disabled when `scanning` is true.

Clicking `✂` sets a `cropping` boolean state to `true`. While cropping:

- A transparent `<div>` overlay (`position: absolute, inset: 0`) sits over the image and captures pointer events.
- `pointerdown` → `pointermove` → `pointerup` track a drag rect stored as `cropRect: { x, y, w, h }` — values are fractions (0–1) relative to the rendered image dimensions.
- A visible selection rectangle is rendered over the overlay to show the current region.
- Two buttons appear below the image: `✓ APPLY` and `✗ CANCEL`, styled to match the existing form buttons.
- The overlay has `pointer-events: none` when `scanning` is true.

## Confirm (applyCrop)

1. Read `imageFile` and draw it to a canvas.
2. Clip to the `cropRect` region (converting fractions to pixel coordinates on the natural image dimensions).
3. Call `canvas.toBlob(jpeg, 0.88)` — same quality as `applyTransform`.
4. Update `imageFile`, `previewUrl`, and set `imageChangedRef.current = true`.
5. Re-trigger `scanForSerial(newFile)` if not in edit mode (same as `applyTransform`).
6. Reset `cropping` to `false` and clear `cropRect`.

## Cancel

Reset `cropping` to `false` and clear `cropRect`. No image changes.

## Constraints

- No new dependencies — pure React state + Canvas API, same pattern as `applyTransform`.
- Minimum crop size: 10×10px (rendered). If `pointerup` produces a rect smaller than this, the drag is silently discarded (equivalent to cancel — `cropping` stays true so the user can try again).
- The `✂` button is only enabled when an image is loaded (`imageFile` is non-null). It does not require `imageChangedRef.current` to be true (unlike rotate/flip, which only make sense after the user has picked an image this session — crop is useful on the pre-loaded edit image too).

## Files Changed

- `components/RecordForm.tsx` — all changes contained here.
