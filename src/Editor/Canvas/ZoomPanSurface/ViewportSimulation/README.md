# ViewportSimulation: How It Works

A simple system to preview React components in an iframe with custom viewport sizes and themes.

---

## 🎯 The Big Picture

You use `<ViewportSimulation>` like any React component. Behind the scenes, it creates an iframe and loads your component inside it with the theme you specify.

```tsx
// In your app
<ViewportSimulation 
  width={375}        // iPhone width
  height={667}       // iPhone height
  component="ContactForm"  // Component name
/>
```

The component renders in the iframe at exactly 375×667px, and media queries work correctly!

---

## 📂 Files and What They Do

### **1. `index.tsx`** - What You Import
```tsx
export { default } from "./ViewportFrameHost";
```
- Just a clean entry point
- You import: `import ViewportSimulation from './ViewportSimulation'`
- It gives you: `ViewportFrameHost` component

---

### **2. `ViewportFrameHost.tsx`** - The Parent (Main Window)
**Role:** Creates the iframe and sends it instructions

**What it does:**
1. Creates an `<iframe>` element in your page
2. Sets `iframe.src = "/src/Editor/ViewportSimulation/iframe.html"`
3. Waits for iframe to say "I'm ready!"
4. Sends message: "Please render component X with theme Y"
5. Shows loading spinner while waiting

**Key code:**
```tsx
// Create iframe
<iframe src="/src/Editor/ViewportSimulation/iframe.html" />

// Send message to iframe
iframe.contentWindow.postMessage({
  type: "MOUNT_COMPONENT",
  componentId: "ContactForm",
  theme: { palette: { ... }, typography: { ... } }
}, window.location.origin);
```

---

### **3. `iframe.html`** - The Bridge
**Role:** Static HTML that loads inside the iframe

**What it contains:**
```html
<div id="root"></div>
<script type="module" src="/src/Editor/ViewportSimulation/ViewportFrameContent.tsx"></script>
```

**What it does:**
1. Provides a `<div id="root">` for React to mount into
2. Loads `ViewportFrameContent.tsx` as a JavaScript module
3. That's it! It's just a simple bootstrap file

---

### **4. `ViewportFrameContent.tsx`** - The Child (Inside Iframe)
**Role:** React app running inside the iframe

**What it does:**
1. Mounts a React app inside the iframe
2. Sends message to parent: "I'm ready!"
3. Listens for "MOUNT_COMPONENT" messages from parent
4. When message arrives:
   - Creates MUI theme from the theme data
   - Looks up the component (e.g., "ContactForm")
   - Renders: `<ThemeProvider theme={theme}><ContactForm /></ThemeProvider>`

**Key code:**
```tsx
// Send ready signal
window.parent.postMessage({ type: "IFRAME_READY" });

// Listen for component instructions
window.addEventListener("message", (event) => {
  if (event.data.type === "MOUNT_COMPONENT") {
    const { componentId, theme } = event.data;
    // Create theme and render component
  }
});
```

---

### **5. `protocol.ts`** - The Dictionary
**Role:** Defines message types so both files speak the same language

**What it contains:**
```tsx
export const MESSAGE_IFRAME_READY = "IFRAME_READY";
export const MESSAGE_MOUNT_COMPONENT = "MOUNT_COMPONENT";

export type MountComponentMessage = {
  type: "MOUNT_COMPONENT";
  componentId: string;
  theme: Record<string, unknown>;
  props: Record<string, unknown>;
};
```

Both `ViewportFrameHost.tsx` and `ViewportFrameContent.tsx` import these constants and types.

---

## 🔄 The Complete Flow (Step by Step)

```
┌─────────────────────────────────────────────────────────────┐
│ YOUR APP (Main Window)                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  <ViewportSimulation width={375} component="ContactForm"/> │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────┐               │
│  │ ViewportFrameHost.tsx                   │               │
│  │ - Creates <iframe>                      │               │
│  │ - Sets src to "iframe.html"             │               │
│  └─────────────────────────────────────────┘               │
│                           │                                 │
│                           │ Loads HTML file                 │
│                           ▼                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
┌───────────────────────────┼─────────────────────────────────┐
│ IFRAME (Separate Window)  │                                 │
├────────────────────────────┼─────────────────────────────────┤
│                            ▼                                 │
│  ┌─────────────────────────────────────────┐               │
│  │ iframe.html                             │               │
│  │ <div id="root"></div>                   │               │
│  │ <script src="ViewportFrameContent.tsx"> │               │
│  └─────────────────────────────────────────┘               │
│                           │                                 │
│                           │ Imports & runs                  │
│                           ▼                                 │
│  ┌─────────────────────────────────────────┐               │
│  │ ViewportFrameContent.tsx                │               │
│  │ 1. Mounts React app                     │               │
│  │ 2. Posts "IFRAME_READY" ──────────┐     │               │
│  └─────────────────────────────────────────┘               │
│                                           │                 │
└───────────────────────────────────────────┼─────────────────┘
                                            │
                                            │ postMessage
                                            ▼
┌─────────────────────────────────────────────────────────────┐
│ YOUR APP (Main Window)                                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐               │
│  │ ViewportFrameHost.tsx                   │               │
│  │ 3. Receives "IFRAME_READY"              │               │
│  │ 4. Sends "MOUNT_COMPONENT" ──────────┐  │               │
│  └─────────────────────────────────────────┘               │
│                                           │                 │
└───────────────────────────────────────────┼─────────────────┘
                                            │
                                            │ postMessage
                                            ▼
┌─────────────────────────────────────────────────────────────┐
│ IFRAME (Separate Window)                                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐               │
│  │ ViewportFrameContent.tsx                │               │
│  │ 5. Receives "MOUNT_COMPONENT"           │               │
│  │ 6. Creates theme from data              │               │
│  │ 7. Renders:                             │               │
│  │    <ThemeProvider>                      │               │
│  │      <ContactForm />                    │               │
│  │    </ThemeProvider>                     │               │
│  └─────────────────────────────────────────┘               │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────┐               │
│  │ ✅ User sees ContactForm rendered       │               │
│  │    at 375×667px with custom theme      │               │
│  └─────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤔 Why This Architecture?

**Q: Why use an iframe instead of just rendering the component directly?**

A: The iframe has its own `window` object with its own dimensions (375×667). When you use `useMediaQuery(theme.breakpoints.down("sm"))`, it checks the iframe's window, not your browser window. This gives you **true device simulation**.

**Q: Why the postMessage dance?**

A: You can't pass React components or functions between windows. You can only send plain data (strings, numbers, objects). So we:
- **Parent sends:** Component name ("ContactForm") and serialized theme (plain object)
- **Iframe receives:** Looks up component from its own registry, creates theme with `createTheme()`

**Q: Can't I just JSON.stringify the component?**

A: No! React components are functions with closures. They can't be serialized. Each window needs its own copy of the component code.

---

## 🎓 Key Concepts

### 1. Two React Trees
- **Parent window**: Has its own React tree (the editor UI)
- **Iframe window**: Has its own React tree (the preview)
- They don't share state or context - completely isolated

### 2. postMessage Communication
- Only way to communicate between windows
- Can only send serializable data (no functions!)
- Must validate message origin for security

### 3. Registry Pattern
- Both windows have access to `samplesRegistry`
- Parent sends component ID: `"ContactForm"`
- Iframe looks up: `samplesRegistry["ContactForm"]`
- Both get the same component, but from their own code

---

## 🔍 Debugging Tips

**See all messages:**
```tsx
// In browser console
localStorage.setItem('debug', '*');
```

**Check iframe console:**
1. Right-click iframe → Inspect
2. Switch to iframe context in DevTools
3. Look for `[iframe]` prefixed logs

**Common issues:**
- **"Waiting for component..."** → Host hasn't sent MOUNT_COMPONENT yet
- **"Component not found"** → Check component is in `samplesRegistry`
- **Blank iframe** → Check browser console for errors in iframe context

---

## 📝 Summary

**File Relationships:**
```
index.tsx  
  └─ exports ViewportFrameHost

ViewportFrameHost.tsx  
  └─ loads iframe.html  
      └─ runs ViewportFrameContent.tsx  
          └─ uses protocol.ts types

Both ViewportFrameHost and ViewportFrameContent use protocol.ts
```

**That's it!** Simple parent-child relationship with message passing. 🎉

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

## File Modifications and Maintenance

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
