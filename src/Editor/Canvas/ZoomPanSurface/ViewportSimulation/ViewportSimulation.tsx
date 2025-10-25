/**
 * ViewportSimulation.tsx
 *
 * ENTRY POINT for the viewport preview system.
 * This is the component you import and use in your app.
 *
 * ARCHITECTURE (follow the code):
 * ViewportSimulation (THIS FILE - entry point, clean re-export)
 *   ↓ re-exports
 * ViewportFrameHost (manages iframe, parent-side)
 *   ↓ sets iframe.src to
 * public/iframe-viewport.html (static HTML bootstrap)
 *   ↓ loads module script
 * ViewportFrameContent.tsx (React app inside iframe)
 *   ↓↑ communicate via postMessage
 * protocol.ts (shared message types)
 *
 * For the full flow diagram and explanation, see README.md in this folder.
 */

// This file simply re-exports ViewportFrameHost as the default export.
// ViewportFrameHost is the actual implementation (contains all the logic).
// See ViewportFrameHost.tsx for the full component code and documentation.

export { default } from "./ViewportFrameHost";
