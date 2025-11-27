# Preview experience (previewHub vs currentSlice)

This document explains the recent changes to improve color-picker responsiveness, why a module-level `previewHub` was introduced, how it differs from the existing `currentSlice` zustand store, and how to test and extend the solution.

---

## Summary

- **Goal:** Make live color-picker interactions (dragging) feel smooth while still allowing live canvas previews. Previously, debounced writes to the main `useEdit` store caused heavy recomputations and UI lag.
- **Solution chosen:** `previewHub` — a tiny module-level Map + rAF notification system to broadcast transient preview values at most once per animation frame.
- **Result:** The color picker writes transient previews to the hub during drags; the theme resolution subscribes to the hub and merges transient previews when notified. The main domain store is written only when the user commits (apply/ok).

---

## Key differences: `previewHub` vs `currentSlice`

- `currentSlice` (zustand store)
  - Authoritative domain model (persistent, serializable).
  - Mutations increment `modificationVersion`, may be persisted and are recorded in history/undo.
  - Good for durable edits and global state that should be saved.

- `previewHub` (module-level transient hub)
  - Ephemeral and in-memory only (Map of path -> preview value).
  - Not persisted, not part of undo/history.
  - Uses `requestAnimationFrame` to coalesce frequent updates and notify subscribers once per frame.
  - Purpose-built for high-frequency UI previews (dragging, scrubbing) where you want very low-latency UI updates without mutating the authoritative state.

Why separate? Because frequent writes to `currentSlice` caused many subscribers (including heavy theme creation code) to recompute and re-render. Keeping previews out of the main store prevents modification/version churn and removes preview steps from history.

---

## Implementation (what changed)

- New file: `src/Editor/Design/Edit/previewHub.ts`
  - API:
    - `setPreviewValue(path: string, value: any)` — set transient preview and schedule an rAF notification
    - `clearPreviewValue(path?: string)` — remove a preview or clear all
    - `getPreviewValue(path: string)` — read a preview value synchronously
    - `getAllPreviews()` — shallow clone of current previews
    - `subscribeToPreviews(fn: () => void)` — subscribe to rAF-coalesced notifications

- Updated: `src/Editor/Properties/Color/useColorPickerEdit.tsx`
  - During drag/debounced updates: call `setPreviewValue(path, color)` instead of writing to the main `useEdit` store.
  - On finalize/apply: call `setValue(...)` (real store write) and `clearPreviewValue(path)`.

- Updated: `src/Editor/Design/Edit/useCreatedThemeOption.ts`
  - Subscribes to `previewHub` notifications and merges `getAllPreviews()` into `createThemeOptionsFromEdits(...)` so the canvas/theme uses transient values for rendering previews.

- Reverted earlier preview-slice integration
  - `useEdit/index.ts` no longer includes a `previewSlice` (transient previews are not stored in zustand anymore).

---

## How it works (runtime)

1. User opens color picker and drags.
2. `useColorPickerEdit` updates local `tempColor` (picker UI) and calls `setPreviewValue(path, tempColor)`.
3. `previewHub` updates its Map and schedules a `requestAnimationFrame` notification.
4. When rAF fires, subscribers (e.g., `useCreatedThemeOption`) are invoked and merge preview values into theme computation once per frame.
5. The canvas re-renders with the merged theme (fast and coalesced).
6. When the user commits, `useColorPickerEdit` calls the real `setValue(...)` on the zustand store and clears the preview via `clearPreviewValue(path)`.

---

## How to test locally

1. Start dev server:

```powershell
pnpm dev
# or
npm run dev
```

2. In the editor app do the following:
  - Open a design and the color picker for any editable color path.
  - Drag the color selector continuously.
    - Expected: picker UI updates instantly; canvas updates for previews smoothly and without visible stutter.
  - Release (apply) the change.
    - Expected: the real edit is persisted to the theme store; preview is cleared.

3. Optional: toggle network/devtools and watch that modificationVersion does not increment while dragging (it should only increment on commit).

---

## Pros and cons

- Pros
  - Very high performance for interactive operations.
  - No spurious writes to authoritative state or history.
  - Easy to remove or replace if future requirements change.

- Cons
  - `previewHub` is not serializable and doesn't integrate with undo/history by design.
  - Adds a small, global API surface to reason about — documented here to avoid confusion.

---

## Recommendations & follow-ups

- Keep `previewHub` for high-frequency UI interactions (color drags, slider scrubs). It offers the best UX with minimal refactor.
- Audit other interactive controls (sliders, numeric drags, gradient editors) and switch them to the preview hub or rAF-throttled commits as appropriate.
- If you want dev-inspection of previews, add a debug-only UI that lists `getAllPreviews()` contents.
- If `createTheme()` proves to still be the bottleneck, consider moving heavy computations to a web worker or more aggressively memoizing theme transformations.

---

## Implementation notes for maintainers

- `previewHub` intentionally keeps a minimal API. Use it only for ephemeral previews that should not be persisted or recorded in history.
- If you ever need previews to be persisted, add a controlled path in `currentSlice` that explicit commit flows write to — but be careful to special-case history/serialization so the preview entries don't pollute saved state.

---

If you want, I can:
- Add a small dev UI toggle to switch between live-preview-on-drag and apply-only modes.
- Remove the unused `useEdit/useEdit/previewSlice.ts` file left earlier and run a dev-server smoke test.

File: `docs/preview-experience.md`
