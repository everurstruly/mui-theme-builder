# ViewportSimulation: Viewport Iframe Preview System

This folder contains a system for previewing React components inside an isolated iframe with a fixed viewport size and custom theme injection.

## Quick Overview

**Entry Point:** `ViewportSimulation.tsx` — the component you import and use.

**Flow:**
```
ViewportSimulation.tsx (your UI, the component you use)
    ↓
ViewportFrameHost.tsx (parent-side manager, in main window)
    ↓ iframe.src = "/iframe-viewport.html"
    ↓
public/iframe-viewport.html (static HTML asset)
    ↓ loads module script
    ↓
ViewportFrameContent.tsx (iframe-side React app, runs inside iframe)
    ↓ postMessage ↔ postMessage
    ↓
protocol.ts (shared message types: IFRAME_READY, MOUNT_COMPONENT)
```

## Files and Their Roles

### `ViewportSimulation.tsx` (ENTRY POINT)
- The component you import and render in your app.
- Props: `width`, `height`, `component` (name), `componentProps`, `registry`, `className`, `style`, `bordered`.
- Usage:
  ```tsx
  <ViewportSimulation 
    width={375} 
    height={667} 
    component="DashboardExample" 
  />
  ```
- Internally uses `ViewportFrameHost` to manage the iframe.

### `ViewportFrameHost.tsx` (PARENT-SIDE MANAGER)
- Runs in the parent window (the main editor/app).
- Creates an `<iframe>` element and loads `public/iframe-viewport.html` into it.
- Waits for `IFRAME_READY` message from the content.
- Sends `MOUNT_COMPONENT` message to render a component inside the iframe.
- Serializes the MUI theme and registry metadata for safe cross-frame transfer.
- **Key line:** `iframe.src = "/iframe-viewport.html"` — triggers browser to load that HTML into the iframe.

### `public/iframe-viewport.html` (IFRAME HTML BOOTSTRAP)
- Static HTML asset that the browser loads when `iframe.src` is set to it.
- Contains a module script that imports and runs `ViewportFrameContent.tsx`.
- Provides an empty `<div id="root">` for React to mount into.
- Minimal CSS to ensure the iframe's `#root` fills its container.

### `ViewportFrameContent.tsx` (IFRAME-SIDE REACT APP)
- Runs inside the iframe (in the iframe's global context, not the parent's).
- Mounts a React app that:
  1. Posts `IFRAME_READY` to the parent when mounted.
  2. Listens for `MOUNT_COMPONENT` messages from the parent.
  3. Validates message origin (must be `window.location.origin`).
  4. Creates a MUI `ThemeProvider` with the serialized theme.
  5. Looks up the component from its local `samplesRegistry` and renders it.
- Has an `ErrorBoundary` for error handling and fallback UI.

### `protocol.ts` (SHARED MESSAGE CONTRACT)
- Defines message type constants: `MESSAGE_IFRAME_READY`, `MESSAGE_MOUNT_COMPONENT`.
- Defines TypeScript types: `IframeReadyMessage`, `MountComponentMessage`, `PreviewMessage`.
- Used by both `ViewportFrameHost.tsx` and `ViewportFrameContent.tsx` to ensure consistent message shapes.

## The Handshake (Data Flow)

### Step 1: Setup
```
1. ViewportSimulation renders ViewportFrameHost
2. ViewportFrameHost useEffect runs: sets iframe.src = "/iframe-viewport.html"
3. Browser loads public/iframe-viewport.html into the iframe
4. That HTML runs: <script type="module" src=".../ViewportFrameContent.tsx"></script>
5. ViewportFrameContent mounts its React app
```

### Step 2: Ready Signal
```
6. ViewportFrameContent.useEffect → posts window.parent.postMessage({ type: "IFRAME_READY" }, origin)
7. ViewportFrameHost window.addEventListener("message") → receives IFRAME_READY
8. ViewportFrameHost → setReady(true)
```

### Step 3: Mount Component
```
9. ViewportFrameHost.sendUpdate() → posts window.postMessage({ type: "MOUNT_COMPONENT", componentId, theme, props, ... }, origin)
10. ViewportFrameContent.handleMessage → receives MOUNT_COMPONENT
11. ViewportFrameContent → creates ThemeProvider, looks up component, renders it
```

## Why This Architecture?

### Isolation
- The iframe has its own window, DOM, CSS scope, and media queries.
- Prevents CSS from the parent from affecting the preview.
- Media queries inside the iframe use the iframe's viewport size (simulated), not the parent's.

### Safe Data Transfer
- Functions and React component objects can't be passed across frames.
- Parent serializes only plain data: theme (object), componentId (string), registry metadata (objects), props (plain data).
- Iframe builds its own ThemeProvider and looks up components from its local registry copy.

### Two Independent React Trees
- Parent has its own React tree (the editor UI).
- Iframe has its own React tree (the preview).
- Each tree has its own hooks, state, and ThemeProvider — they don't interfere.

### Reusable Preview Page
- The same `public/iframe-viewport.html` can be:
  - Embedded as an iframe inside the editor (current use).
  - Opened in a new tab (shareable preview) by passing `componentId` and `theme` in the URL.
  - Used in documentation or other preview contexts.

## Common Questions

### Q: Why not just render the component directly in the parent?
A: You would lose:
- Viewport isolation (media queries would use parent window, not fixed 375x667).
- CSS isolation (parent's global CSS could affect preview).
- True device simulation (can't test responsive behavior at fixed sizes).

### Q: Why does the iframe load an external HTML file instead of inline HTML?
A: Using a static HTML asset (loaded via `iframe.src`) is:
- Clearer for Vite's build system (separate entry point).
- HMR-friendly in dev.
- Standard practice and easier to reason about.

Alternatives:
- Could use `iframe.srcdoc` to inline HTML, but that complicates HMR.
- Could dynamically write to `iframe.contentDocument`, but harder to debug and less standard.

### Q: What if I want to add more features (zoom, fullscreen, export)?
A: All parent-side features can be added to `ViewportFrameHost.tsx` or `ViewportSimulation.tsx`.
If features need to affect the iframe rendering, add new message types to `protocol.ts`.

### Q: Can I customize the theme or registry?
A: Yes!
- `ViewportSimulation` accepts a `registry` prop and `componentProps`.
- The theme comes from `useTheme()` (MUI's `<ThemeProvider>` in the parent).
- Pass different values to render different components or with different props.

## Debugging Tips

1. **Check the console** (both parent and iframe): look for `[ViewportSimulationFrame]` and `[iframe]` log messages.
2. **Verify origin validation**: if messages aren't received, check the browser console for origin warnings.
3. **Check component registration**: if the component doesn't render, verify it's in `samplesRegistry` (available in both parent and iframe).
4. **Inspect the iframe**: in DevTools, find the iframe element in the DOM, right-click → Inspect → toggle to iframe's DevTools context.

## File Changes and Maintenance

If you:
- Add a new component: register it in `src/Editor/Samples/registry.ts` (used by both parent and iframe).
- Add a new message type: define it in `protocol.ts` and update both `ViewportFrameHost.tsx` and `ViewportFrameContent.tsx`.
- Change the serialization logic (theme, props): update the code in both files.
- Add iframe-side UI (error messages, placeholders): edit `ViewportFrameContent.tsx`.

---

**Last updated:** Oct 25, 2025  
**Key files:**
- Entry: `ViewportSimulation.tsx`
- Parent: `ViewportFrameHost.tsx`
- Content: `ViewportFrameContent.tsx`
- Protocol: `protocol.ts`
- Bootstrap: `public/iframe-viewport.html`
