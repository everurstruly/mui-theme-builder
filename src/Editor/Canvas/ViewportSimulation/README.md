# ViewportSimulationFrame

Renders components in an iframe with simulated viewport dimensions for accurate responsive testing.

## Quick Start

```tsx
import ViewportSimulationFrame from "./Viewport/ViewportSimulationFrame";
import useViewportStore from "./Viewport/viewportStore";

const { width, height } = useViewportStore();

<ViewportSimulationFrame
  width={width}
  height={height}
  component="DashboardExample"
/>;
```

## Global Store

```tsx
import useViewportStore, { viewportPresets } from "./Viewport/viewportStore";

// State
const { width, height, preset, scale } = useViewportStore();

// Actions
setPreset("tablet"); // 768x1024
setSize(1200, 800); // Custom
rotateViewport(); // Swap dimensions
```

## Presets

- `phone`: 375×667
- `tablet`: 768×1024
- `laptop`: 1440×900
- `desktop`: 1920×1080

## Adding Components

Register in `iframe-app.tsx`:

```tsx
import YourComponent from "../../Objects/YourComponent";

const COMPONENT_REGISTRY = {
  DashboardExample,
  YourComponent,
};
```

## Controls

```tsx
import ViewportControls from './Viewport/ViewportControls';

<ViewportControls />  {/* Preset buttons */}
```
