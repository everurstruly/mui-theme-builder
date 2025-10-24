# ViewportSimulationFrame

Renders components in an iframe with simulated viewport dimensions for accurate responsive testing.

## Overview

This component provides an isolated rendering environment for testing responsive UI components. Each component renders in its own React instance with independent theme context, ensuring hooks work correctly and components don't interfere with the parent application.

## Basic Usage

```tsx
import ViewportSimulationFrame from "./Frame";

<ViewportSimulationFrame width={375} height={667} component="MyComponent" />;
```

## With Custom Registry

Support multiple component registries:

```tsx
import ViewportSimulationFrame from "./Frame";
import { samplesRegistry } from "./registries/samples";
import { customRegistry } from "./registries/custom";

// Use default registry
<ViewportSimulationFrame
  width={375}
  height={667}
  component="Component1"
/>

// Use custom registry
<ViewportSimulationFrame
  width={375}
  height={667}
  component="Component2"
  registry={customRegistry}
/>
```

## Props

### Required

- **`width`** `number` - Viewport width in pixels
- **`height`** `number` - Viewport height in pixels
- **`component`** `string` - Component ID to render (must exist in registry)

### Optional

- **`componentProps`** `Record<string, unknown>` - Props to pass to the component
- **`registry`** `Record<string, { id, label, component }>` - Custom registry (defaults to samplesRegistry)
- **`className`** `string` - CSS class for the container
- **`style`** `CSSProperties` - Inline styles for the container

## Registry Format

Each registry is a flat mapping of component IDs to metadata:

```tsx
export const myRegistry = {
  ComponentA: {
    id: "ComponentA",
    label: "Component A",
    description: "A test component",
    path: "examples/components", // For tree organization
    component: ComponentA,
  },
  ComponentB: {
    id: "ComponentB",
    label: "Component B",
    path: "examples/components",
    component: ComponentB,
  },
};
```

## How It Works

1. **Parent Layer:** Resolves component from registry and validates it exists
2. **Serialization:** Sends component ID + registry metadata to iframe via postMessage
3. **Iframe Layer:** Receives registry info and looks up component in its local copy
4. **Rendering:** Each React instance independently manages its component tree
5. **Theme Isolation:** Each instance wraps components in its own ThemeProvider

This design ensures:

- ✅ Hooks work correctly (independent React contexts)
- ✅ Multiple registries supported
- ✅ Components fully isolated
- ✅ No shared state pollution
- ✅ Accurate responsive testing

## Error Handling

The component displays user-friendly errors for:

- Component not found in registry
- Registry metadata missing
- Component rendering failure (caught by ErrorBoundary)

## Viewport Dimensions

The iframe receives viewport dimensions as props:

- `__viewportWidth` - Simulated viewport width
- `__viewportHeight` - Simulated viewport height

Use these props if your component needs to know the simulated dimensions.
