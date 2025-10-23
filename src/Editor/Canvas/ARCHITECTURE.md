# Zoom & Pan Architecture Design

## Overview

This project uses a pragmatic three-layer architecture for the Zoom & Pan feature:

Store (zoomPanSurfaceStore) → Pure Logic (zoomPanLogic) → Hook (useCanvasZoomPanSurface) → Components

The goal is clear separation of concerns: state is centralized and simple, complex math lives in pure functions, the hook coordinates DOM interactions and side effects, and components handle rendering.

## Architecture Layers

### 1. State Layer: `zoomPanSurfaceStore.ts`

Purpose: global state and simple actions.

Responsibilities:

- Hold canonical application state: `zoom`, `position` (absolute visual position), and `alignment` mode (`"pan" | "center" | "start"`).
- Provide small, predictable actions: `setZoom`, `zoomIn`, `zoomOut`, `zoomBy`, `setPosition`, `positionBy`, `alignTo` (mode), `toggleAlignment`, `resetPosition`, `resetView`.

Design notes:

- The store is intentionally a thin data container. Actions in the store are mostly simple convenience helpers (clamping zoom, incrementing/decrementing). Heavy behavior that depends on DOM measurements or lifecycle is kept out of the store.
- The store is public: UI controls and other components may read from or call simple store actions directly. This keeps small components simple and avoids unnecessary boilerplate.

### 2. Pure Logic: `zoomPanLogic.ts`

Purpose: pure, testable math and helpers.

Responsibilities:

- Perform deterministic calculations with no side-effects: `computeAlignedPosition`, `computeTranslatePosition`, `computeDragPosition`, `clampZoom`, `getNextZoomPreset`, `getNextAlignment`.
- Be fully unit-testable without React or DOM.

Design notes:

- Extracting math to this module makes the behavior easy to verify and reuse (hook or store can call these helpers).

### 3. Behavior Layer: `useCanvasZoomPanSurface.ts`

Purpose: DOM interactions, lifecycle, and orchestration.

Responsibilities:

- Connect to the store and to `zoomPanLogic` helpers.
- Handle browser events and APIs: pointer events for dragging, wheel for zoom, `ResizeObserver` for container changes.
- Manage UI-only transient state such as `isDragging` and `dragStart` (captured via refs).
- Compute derived rendering values (`translatePosition`, `scale`) and apply aligned positions when `alignment` changes or container resizes.
- Expose refs and event handlers for components to bind.

Design notes:

- The hook orchestrates logic that requires DOM measurements; it does not duplicate store behavior. It uses pure functions for calculations and updates the store via simple setters when appropriate.

### 4. Component Layer (e.g., `CanvasBodyZoomPan.tsx`, `ZoomPanSurfaceControls.tsx`)

Purpose: rendering and presentation.

Responsibilities:

- `CanvasBodyZoomPan` consumes the hook, binds event handlers and applies the computed CSS transform to the content.
- `ZoomPanSurfaceControls` (and similar UI elements) read simple state and call store actions directly for small interactions (zoom buttons, alignment toggles).

Design notes:

- Controls are intentionally allowed to access the store directly for simple actions. Complex DOM-dependent behaviors remain inside the hook.

## Why this split?

- Single source of truth: `position` in the store is the canonical visual state, simplifying reasoning and avoiding cyclic conversions between `pan` + `alignment`.
- Testability: pure math functions are easy to unit test. The hook can be tested with a mock store. Store logic is small and verifiable.
- Predictability: behavior that depends on DOM measurements lives in the hook (React lifecycle), while the store remains synchronous and simple.

## Usage Examples

Canvas (uses hook):

```tsx
function CanvasWithZoomPan() {
  const {
    ref,
    translatePosition,
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    scale,
  } = useCanvasZoomPanSurface();

  return (
    <div
      ref={ref}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        transform: `translate(${translatePosition.x}px, ${translatePosition.y}px) scale(${scale})`,
      }}
    >
      {/* Canvas content */}
    </div>
  );
}
```

Controls (use store directly for simple actions):

```tsx
function ZoomControls() {
  const zoom = useZoomPanSurfaceStore((s) => s.zoom);
  const zoomIn = useZoomPanSurfaceStore((s) => s.zoomIn);
  const zoomOut = useZoomPanSurfaceStore((s) => s.zoomOut);

  return (
    <div>
      <button onClick={zoomOut}>-</button>
      <span>{zoom}%</span>
      <button onClick={zoomIn}>+</button>
    </div>
  );
}
```

## Refinement Opportunities / Next Steps

1. Unit tests for `zoomPanLogic.ts` (high priority).
2. Integration tests for `useCanvasZoomPanSurface` (mock store + DOM events).
3. Small naming cleanup: consider `setAlignment` vs `alignTo` consistency.
4. Performance: consider throttling or requestAnimationFrame for very high-frequency updates during drag.
5. Add a lightweight `<ZoomPanContainer>` wrapper that wires the hook and reduces repetitive boilerplate in consumers.

## Conclusion

This structure keeps the store as a simple, shared state container while centralizing DOM-dependent behavior in a reusable hook and extracting math into pure, testable functions. It balances simplicity for small components with robustness for complex interactions.
