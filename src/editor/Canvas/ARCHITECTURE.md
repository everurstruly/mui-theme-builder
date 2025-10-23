# Zoom & Pan Architecture Design

## Overview

The zoom and pan functionality follows a three-layer architecture pattern that separates concerns while maintaining flexibility and reusability:

```
Store (zoomPanStore) → Hook (useZoomPan) → Components
```

This document explains the reasoning behind this architecture and the responsibilities of each layer.

## Architecture Layers

### 1. State Layer: `zoomPanStore.ts`

**Purpose**: Global state management and persistence.

**Responsibilities**:

- Store zoom level, pan position, and alignment preferences
- Provide actions to modify state (setZoom, setPan, zoomIn, zoomOut, alignTo)
- Ensure state consistency across the application
- Make state available to any component that needs it

**Justification**:

- Zoom and pan state often needs to be shared between multiple components (canvas, controls, toolbars)
- State persistence between component remounts prevents jarring UX
- Centralizing state logic reduces duplication and potential for inconsistency

### 2. Behavior Layer: `useZoomPan.ts`

**Purpose**: DOM interaction and behavior coordination.

**Responsibilities**:

- Connect to global state via the store
- Handle DOM events (wheel, pointer, resize)
- Manage UI-specific state (dragging status)
- Calculate derived values (translatePosition, scale)
- Coordinate with ResizeObserver and other browser APIs
- Provide refs and event handlers for components

**Justification**:

- Decouples UI interaction logic from both state management and rendering
- Creates a reusable behavior that can be applied to any container component
- Allows testing of zoom/pan logic independently from specific components
- Centralizes complex event handling and browser API interactions

### 3. Component Layer: (e.g., `CanvasBodyZoomPan.tsx`)

**Purpose**: Rendering and user interface.

**Responsibilities**:

- Consume the hook to get handlers and state
- Render appropriate DOM elements with proper event bindings
- Apply the calculated transforms to content
- Handle component-specific UI concerns

**Justification**:

- Components stay focused on rendering and presentation
- Multiple components can reuse the same zoom/pan behavior
- Components remain relatively simple and easier to test

## Benefits of This Architecture

1. **Separation of Concerns**:

   - State management is isolated from UI behavior
   - DOM interaction is isolated from rendering
   - Each layer has a clear, focused responsibility

2. **Reusability**:

   - The hook can be used by any component needing zoom/pan
   - Multiple canvases can share the same state if needed
   - Components using the hook don't need to know state implementation details

3. **Testability**:

   - Each layer can be tested independently
   - Store logic can be tested without DOM
   - Hook behavior can be tested with a mock store
   - Components can be tested with a mock hook

4. **Maintainability**:
   - Changes to state logic don't affect UI components
   - Browser API interactions are centralized in the hook
   - Components stay lean and focused

## Alternative Approaches Considered

### Alternative 1: Combined Hook + State

Combining state and behavior in a single custom hook:

```typescript
function useZoomPan() {
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  // Event handlers and other logic here
}
```

**Rejected because**:

- State wouldn't persist between component unmounts
- Multiple components would have independent states (couldn't synchronize)
- Would require prop-drilling or context to share state

### Alternative 2: Component with Internal Logic

Putting all zoom/pan logic directly in a component:

```typescript
function ZoomPanCanvas() {
  // All state, handlers, and rendering in one place
}
```

**Rejected because**:

- Not reusable across different components
- Tightly couples rendering with behavior
- Harder to test individual aspects
- Component becomes overly complex

## Usage Example

```tsx
// In a component:
function CanvasWithZoomPan() {
  const {
    ref,
    translatePosition,
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useZoomPan();

  return (
    <div
      ref={ref}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        transform: `translate(${translatePosition.x}px, ${translatePosition.y}px)`,
      }}
    >
      {/* Canvas content */}
    </div>
  );
}
```

## Refinement Opportunities

1. **Pure Utility Functions**:

   - Extract pure calculations into a separate utils file
   - Improves testability of math operations
   - Example: `calcScale`, `clampZoom`, `computeTranslate`

2. **Component Abstraction**:

   - Create a dedicated `<ZoomPanContainer>` component that internally uses the hook
   - Simplifies usage in simple cases
   - Example: `<ZoomPanContainer>{children}</ZoomPanContainer>`

3. **Performance Optimization**:
   - Memoize handlers with useCallback
   - Use refs for values needed in handlers to avoid re-renders
   - Consider throttling rapid updates (e.g., during dragging)

## Conclusion

The three-layer architecture (Store → Hook → Component) provides a clean separation of concerns while maintaining flexibility and reusability. This approach scales well as application complexity grows and supports a wide range of zoom/pan use cases.
