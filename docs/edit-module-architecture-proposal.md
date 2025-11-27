# Edit Module Architecture Proposal

**Date:** November 27, 2025  
**Status:** Proposal for Review  
**Context:** Performance optimization work revealed architectural concerns about the Edit module's state management approach

---

## Executive Summary

The Edit module currently uses a monolithic zustand store for all theme state, with recent additions of a module-level `previewHub` for transient UI previews. This proposal evaluates three architectural approaches and recommends a path forward that balances performance, maintainability, and architectural clarity.

**Recommendation:** Adopt **Option 2B** (Store-based previews with dedicated slice + selective notification) as it provides the best balance of performance, testability, and architectural cohesion while avoiding the "bolt-on" feel of the current `previewHub`.

---

## Current State Analysis

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ useEdit Store (Zustand)                                      │
├─────────────────────────────────────────────────────────────┤
│ • currentSlice (domain model, history, code overrides)       │
│ • interfaceSlice (UI state: activeScheme, activePreview)     │
│ • historySlice (undo/redo for visual + code edits)          │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
            ┌──────────────────────────────┐
            │ Components & Hooks           │
            │ • useEditWithDesignerTool    │
            │ • useCreatedThemeOption      │
            │ • Color/Typography controls  │
            └──────────────────────────────┘
                           │
                           ↓ (recent addition)
            ┌──────────────────────────────┐
            │ previewHub (module-level)    │
            │ • Map<path, value>           │
            │ • rAF-coalesced notifications│
            └──────────────────────────────┘
```

### Pain Points Identified

1. **Architectural Inconsistency**
   - `previewHub` exists outside the store, creating a "dual source of truth" feel
   - Not inspectable via Redux DevTools or zustand middleware
   - Requires manual subscription management
   - Unclear lifetime and ownership semantics

2. **Performance Bottlenecks (Original Issue)**
   - Frequent writes to `currentSlice` trigger:
     - Wide re-renders (many components subscribe to large objects like `colorSchemes.light`)
     - Expensive theme recomputation on every edit
     - History/version increment spam during high-frequency interactions
   - `createTheme()` is synchronous and CPU-intensive (~5-15ms for complex themes)

3. **Narrow Selector Problem**
   - Many components subscribe to entire nested objects instead of specific paths
   - Example: `useEdit(s => s.colorSchemes.light)` re-renders on any change in that scheme
   - Difficult to audit and fix across large codebase

4. **Testing & Debugging**
   - `previewHub` is not easily testable (module-level mutable state)
   - Preview state not visible in DevTools
   - Hard to reproduce preview-related bugs without manual interaction

---

## Option 1: Keep `previewHub` (Module-Level)

### Description
Formalize the current `previewHub` as the official transient preview mechanism. Add tests, better documentation, and stricter lifecycle management.

### Implementation Details
```typescript
// Enhanced previewHub.ts
export class PreviewHub {
  private previewMap = new Map<string, any>();
  private listeners = new Set<Listener>();
  private rafHandle: number | null = null;

  setPreviewValue(path: string, value: any): void { /* ... */ }
  clearPreviewValue(path?: string): void { /* ... */ }
  getPreviewValue(path: string): any { /* ... */ }
  getAllPreviews(): Record<string, any> { /* ... */ }
  subscribe(fn: Listener): () => void { /* ... */ }
  
  // New: lifecycle management
  reset(): void { /* ... */ }
  
  // New: debug utilities
  getStats(): { size: number; listeners: number } { /* ... */ }
}

export const previewHub = new PreviewHub();
```

### Pros
- ✅ **Highest performance** — minimal overhead, no zustand subscription cost
- ✅ **Already implemented** — low refactor effort to formalize
- ✅ **rAF coalescing** — natural throttling built-in
- ✅ **Separation of concerns** — transient state clearly separated from persistent
- ✅ **No store pollution** — doesn't affect history, version counters, or serialization

### Cons
- ❌ **Not inspectable** — invisible to Redux DevTools, zustand middleware
- ❌ **Testing difficulty** — module-level state requires reset between tests
- ❌ **Architectural confusion** — "why is this not in the store?"
- ❌ **Manual subscription** — consumers must subscribe/unsubscribe (easy to leak)
- ❌ **Type safety** — `Map<string, any>` loses type information
- ❌ **Discoverability** — new developers won't find it via store inspection

### Risk Assessment
- **Low risk** technically (already working)
- **Medium risk** architecturally (tech debt, harder to maintain long-term)
- **Medium risk** team adoption (confusing for new contributors)

### When to Choose This
- Short-term solution only
- Team wants minimal refactor now, willing to revisit later
- Performance is critical and cannot tolerate any store overhead

---

## Option 2: Store-Based Previews

### 2A: Simple Preview Slice (Naive)

#### Description
Add a `previewSlice` to the zustand store with a simple `Record<string, any>`.

```typescript
// previewSlice.ts
export interface PreviewSlice {
  previews: Record<string, SerializableValue>;
  setPreview: (path: string, value: SerializableValue) => void;
  clearPreview: (path?: string) => void;
}

export const createPreviewSlice: StateCreator<PreviewSlice> = (set) => ({
  previews: {},
  setPreview: (path, value) =>
    set((state) => ({ previews: { ...state.previews, [path]: value } })),
  clearPreview: (path) =>
    set((state) => {
      if (!path) return { previews: {} };
      const { [path]: _, ...rest } = state.previews;
      return { previews: rest };
    }),
});
```

#### Pros
- ✅ **Single source of truth** — all state in one place
- ✅ **DevTools visibility** — inspectable and debuggable
- ✅ **Easy testing** — standard zustand testing patterns
- ✅ **Type safety** — fully typed
- ✅ **Consistent patterns** — uses existing store APIs

#### Cons
- ❌ **Store write overhead** — every preview change triggers zustand's notify cycle
- ❌ **Potential re-renders** — components subscribing to large slices still re-render
- ❌ **Version counter pollution** — need special handling to avoid incrementing `modificationVersion`
- ❌ **History pollution** — must explicitly exclude from undo/redo
- ❌ **No built-in throttling** — need to add rAF coalescing manually

### 2B: Preview Slice with Selective Notification (Recommended)

#### Description
Store-based previews with zustand's `subscribeWithSelector` to allow fine-grained subscriptions and manual notification batching.

```typescript
// previewSlice.ts
export interface PreviewSlice {
  previews: Record<string, SerializableValue>;
  previewVersion: number; // increment to notify subscribers
  
  setPreview: (path: string, value: SerializableValue) => void;
  clearPreview: (path?: string) => void;
  batchSetPreviews: (updates: Record<string, SerializableValue>) => void;
}

let pendingUpdates: Record<string, SerializableValue> | null = null;
let rafHandle: number | null = null;

export const createPreviewSlice: StateCreator<PreviewSlice> = (set) => ({
  previews: {},
  previewVersion: 0,
  
  setPreview: (path, value) => {
    // Accumulate updates in rAF window
    if (!pendingUpdates) pendingUpdates = {};
    pendingUpdates[path] = value;
    
    if (rafHandle == null) {
      rafHandle = requestAnimationFrame(() => {
        rafHandle = null;
        const updates = pendingUpdates!;
        pendingUpdates = null;
        
        set((state) => ({
          previews: { ...state.previews, ...updates },
          previewVersion: state.previewVersion + 1,
        }));
      });
    }
  },
  
  clearPreview: (path) => {
    if (rafHandle) {
      cancelAnimationFrame(rafHandle);
      rafHandle = null;
      pendingUpdates = null;
    }
    
    set((state) => {
      if (!path) return { previews: {}, previewVersion: state.previewVersion + 1 };
      const { [path]: _, ...rest } = state.previews;
      return { previews: rest, previewVersion: state.previewVersion + 1 };
    });
  },
  
  batchSetPreviews: (updates) => {
    set((state) => ({
      previews: { ...state.previews, ...updates },
      previewVersion: state.previewVersion + 1,
    }));
  },
});

// Consumer pattern:
const preview = useEdit((s) => s.previews[myPath]); // narrow selector
// or subscribe to version for full refresh:
const previewVersion = useEdit((s) => s.previewVersion);
```

#### Pros
- ✅ **Single source of truth** — unified store
- ✅ **DevTools visibility** — full inspection
- ✅ **rAF coalescing** — built into setPreview
- ✅ **Narrow subscriptions** — consumers can select single paths
- ✅ **Type safety** — fully typed
- ✅ **Testable** — standard zustand patterns
- ✅ **Clear semantics** — preview state is explicit
- ✅ **No history pollution** — separate from modification tracking

#### Cons
- ⚠️ **Moderate complexity** — batching logic in slice
- ⚠️ **Selector discipline required** — consumers must use narrow selectors (but this is already a problem)
- ⚠️ **Some store overhead** — still notifies zustand subscribers (but coalesced)

#### Implementation Effort
- Replace `previewHub.ts` with `previewSlice.ts` (~1-2 hours)
- Update consumers to use store selectors (~2-3 hours)
- Add tests (~1-2 hours)
- **Total: ~6 hours**

---

## Option 3: Worker-Based Theme Compilation

### Description
Move expensive `createTheme()` and theme transformation work to a Web Worker, keeping the main thread free for UI interactions.

```typescript
// themeWorker.ts (runs in worker thread)
self.onmessage = (e) => {
  const { type, payload } = e.data;
  
  if (type === 'CREATE_THEME') {
    const { baseTheme, visualEdits, codeOverrides, previews } = payload;
    
    // Heavy work here:
    const themeOptions = createThemeOptionsFromEdits({
      template: baseTheme,
      baseVisualToolEdits: visualEdits,
      colorSchemeVisualToolEdits: {},
      codeOverrides,
      previews, // merge previews
    });
    
    // Send back serializable result
    self.postMessage({ type: 'THEME_READY', themeOptions });
  }
};

// Main thread:
const themeWorker = new Worker(new URL('./themeWorker.ts', import.meta.url));

themeWorker.postMessage({
  type: 'CREATE_THEME',
  payload: { baseTheme, visualEdits, codeOverrides, previews }
});

themeWorker.onmessage = (e) => {
  if (e.data.type === 'THEME_READY') {
    // Apply theme to UI
    setCompiledTheme(e.data.themeOptions);
  }
};
```

### Pros
- ✅ **Main thread freed** — UI stays responsive during heavy computation
- ✅ **Scales better** — can parallelize multiple theme compilations
- ✅ **Future-proof** — prepares for more complex transformations
- ✅ **Works with any preview solution** — orthogonal to preview architecture

### Cons
- ❌ **High complexity** — serialization, worker lifecycle, error handling
- ❌ **Async delays** — theme updates are not synchronous (adds latency)
- ❌ **Bundle size** — worker code needs to be bundled separately
- ❌ **Debugging difficulty** — harder to debug worker code
- ❌ **MUI limitation** — `createTheme()` may have browser-only dependencies (need to check)
- ❌ **Large refactor** — significant investment (~2-3 weeks)

### Risk Assessment
- **High risk** — significant architectural change
- **High effort** — 2-3 weeks development + testing
- **Uncertain benefit** — need profiling data to confirm theme compilation is the bottleneck

### When to Choose This
- Theme compilation is proven bottleneck (>50ms per update)
- Team has capacity for large refactor
- Long-term performance is critical (e.g., enterprise customers, complex themes)
- After trying Options 1 or 2 and still seeing issues

---

## Comparative Analysis

| Criteria | previewHub | Store-Based (2A) | Store-Based (2B) | Worker-Based |
|----------|------------|------------------|------------------|--------------|
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Maintainability** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Testability** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **DevTools Support** | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Type Safety** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Implementation Effort** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Architectural Clarity** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Risk Level** | Low | Low | Low-Med | High |

---

## Recommendation: Option 2B (Store-Based with Selective Notification)

### Rationale

1. **Balances Performance and Architecture**
   - Maintains high performance via rAF coalescing
   - Integrates cleanly with existing store patterns
   - No "bolt-on" feeling

2. **Addresses Core Concerns**
   - Single source of truth (testable, inspectable)
   - Clear separation of transient vs persistent state
   - Works with existing DevTools and middleware

3. **Reasonable Effort**
   - ~6 hours implementation
   - Low risk (can roll back easily)
   - Familiar patterns for team

4. **Future-Proof**
   - Doesn't preclude moving to workers later
   - Makes narrow-selector refactoring easier to enforce
   - Sets good precedent for other transient UI state

### Implementation Plan

#### Phase 1: Create Preview Slice (2 hours)
1. Create `src/Editor/Design/Edit/useEdit/previewSlice.ts`
2. Integrate into store composition
3. Add basic tests

#### Phase 2: Update Consumers (3 hours)
1. Replace `previewHub` imports with store hooks
2. Update `useColorPickerEdit.tsx`
3. Update `FontStyleRangedOption.tsx`
4. Update `useCreatedThemeOption.ts` to select from store

#### Phase 3: Cleanup & Test (1 hour)
1. Remove `previewHub.ts`
2. Run full test suite
3. Manual smoke test of color picker and typography controls

#### Phase 4: Documentation (30 min)
1. Update `docs/preview-experience.md`
2. Add JSDoc comments to preview slice
3. Update `docs/edit-module-architecture-proposal.md` status

### Success Criteria
- [ ] Color picker feels smooth (no perceivable lag)
- [ ] Typography slider updates canvas live
- [ ] Preview state visible in Redux DevTools
- [ ] All tests passing
- [ ] No regression in other controls

---

## Alternative: Phased Approach

If unsure, consider this hybrid:

### Phase 1: Keep `previewHub` Short-Term
- Add tests and documentation
- Formalize lifecycle management
- Mark as "temporary implementation"

### Phase 2: Profile & Measure (1-2 weeks of production use)
- Collect real-world performance data
- Identify remaining bottlenecks
- Validate that theme creation is the issue (vs. component re-renders)

### Phase 3: Decide Next Step
- If theme creation is bottleneck: → Worker-based (Option 3)
- If preview API is the issue: → Store-based (Option 2B)
- If performance is acceptable: → Formalize `previewHub` (Option 1)

---

## Additional Recommendations (Orthogonal)

Regardless of preview architecture chosen:

### 1. Enforce Narrow Selectors
Create a linter rule or audit script:
```typescript
// Bad
const lightMode = useEdit(s => s.colorSchemes.light);

// Good
const visualEdits = useEdit(s => s.colorSchemes.light?.visualToolEdits);
const specificEdit = useEdit(s => s.colorSchemes.light?.visualToolEdits?.[path]);
```

**Effort:** 1-2 days to audit and fix existing code

### 2. Add Performance Monitoring
```typescript
// Add to useCreatedThemeOption
const startTime = performance.now();
const theme = createTheme(themeOptions);
const duration = performance.now() - startTime;

if (duration > 10) {
  console.warn(`Slow theme creation: ${duration}ms`);
}
```

**Effort:** 1 hour

### 3. Memoize Expensive Computations
```typescript
// Cache parsed base themes
const parsedBaseThemeCache = new Map<string, ThemeOptions>();

function parseThemeCode(code: string): ThemeOptions {
  if (parsedBaseThemeCache.has(code)) {
    return parsedBaseThemeCache.get(code)!;
  }
  const parsed = JSON.parse(code);
  parsedBaseThemeCache.set(code, parsed);
  return parsed;
}
```

**Effort:** 2-3 hours

### 4. Component-Level Optimizations
- Wrap expensive components with `React.memo`
- Use `useCallback` for event handlers passed to memoized children
- Virtualize long lists (if applicable)

**Effort:** 1-2 days

---

## Next Steps

1. **Review this proposal** with the team (30-60 min meeting)
2. **Decide on approach**:
   - **Go with 2B?** → I'll implement in ~6 hours
   - **Want more data?** → I'll add performance instrumentation first
   - **Prefer phased?** → I'll formalize `previewHub` temporarily
3. **Schedule follow-up** to review results and plan next iteration

---

## Appendix A: Performance Benchmarks Needed

Before making final decision, collect:

1. **Theme Creation Time**
   - Average time for `createTheme()` call
   - 95th percentile
   - Breakdown by theme complexity

2. **Re-render Counts**
   - Components re-rendering per preview change
   - Before/after narrow selectors

3. **Frame Times**
   - During color picker drag
   - During slider interaction
   - Target: <16ms (60fps)

4. **Memory Usage**
   - Preview state size
   - Store size over time

**Tools:** React Profiler, Chrome Performance tab, `performance.mark/measure`

---

## Appendix B: References

- [Zustand Best Practices](https://github.com/pmndrs/zustand#best-practices)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Web Workers for Heavy Computation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [MUI createTheme API](https://mui.com/material-ui/customization/theming/#createtheme-options-args-theme)

---

**Document Status:** Ready for Review  
**Author:** GitHub Copilot (Claude Sonnet 4.5)  
**Date:** November 27, 2025
