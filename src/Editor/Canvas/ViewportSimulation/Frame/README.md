# IsolatedViewport

A React component that renders children in an iframe with an isolated viewport, allowing components to respond to simulated device sizes independently of the browser window size.

## How It Works

1. **Iframe Isolation**: Components are rendered inside an iframe with a controlled width/height
2. **Real Viewport**: The iframe's `window.innerWidth` matches the simulated device size
3. **Media Queries**: CSS `@media` queries and MUI's `useMediaQuery` work based on the iframe size
4. **Theme Control**: Theme is passed from parent and applied inside the iframe via `ThemeProvider`

## Usage

```tsx
import IsolatedViewport from "./IsolatedViewport";

<IsolatedViewport
  width={375} // iPhone size
  height={667}
  component="DashboardExample" // Component name from registry
  componentProps={{}} // Optional props
/>;
```

## Adding Components to the Registry

Components must be registered in `iframe-app.tsx` to be rendered:

```tsx
// In iframe-app.tsx
import YourComponent from "../path/to/YourComponent";

const COMPONENT_REGISTRY = {
  DashboardExample,
  YourComponent, // Add here
};
```

Then use it:

```tsx
<IsolatedViewport width={768} height={1024} component="YourComponent" />
```

## Development

In development, Vite automatically serves `iframe-viewport.html` and hot-reloads the iframe app.

## Production Build

Vite will automatically build both the main app and the iframe HTML file. No additional configuration needed.

## Limitations

1. **Component Registration**: Components must be explicitly registered (can't pass React elements directly due to postMessage serialization)
2. **Same Origin**: Iframe must be same-origin to work properly
3. **Props**: Component props must be JSON-serializable

## Future Enhancements

- Dynamic component loading without registry
- Better error boundaries
- Performance optimizations for theme updates
- Support for React Context providers beyond ThemeProvider
