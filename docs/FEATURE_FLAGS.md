# Feature Flags

Feature flags allow you to enable/disable features in development and production environments.

## Available Flags

### `SHOW_VERSION_HISTORY`
Controls the version history feature (save, view, and restore design versions).

- **Default**: `true` in development (`npm run dev`), `false` in production builds
- **Controls**: Version history button in toolbar, version dialog, and all related functionality

## Usage

### Development

Enable version history during development (default):
```bash
npm run dev
```

Disable version history during development:
```bash
VITE_FF_SHOW_VERSION_HISTORY=false npm run dev
```

### Production Build

Build with version history enabled:
```bash
VITE_FF_SHOW_VERSION_HISTORY=true npm run build
```

Build with version history disabled (default):
```bash
npm run build
```

### In Code

Use the `isFeatureEnabled()` helper to check if a feature is enabled:

```typescript
import { isFeatureEnabled } from "@/config/featureFlags";

if (isFeatureEnabled("SHOW_VERSION_HISTORY")) {
  // Feature is enabled
}
```

Or access the raw config directly:

```typescript
import { featureFlags } from "@/config/featureFlags";

if (featureFlags.SHOW_VERSION_HISTORY) {
  // Feature is enabled
}
```

## Environment Variables

Feature flags use Vite's environment variables pattern. Prefix any flag name with `VITE_FF_`:

```bash
# Set SHOW_VERSION_HISTORY flag
VITE_FF_SHOW_VERSION_HISTORY=true npm run dev

# Multiple flags
VITE_FF_SHOW_VERSION_HISTORY=true VITE_FF_OTHER_FLAG=false npm run dev
```

Valid values: `true`, `1`, `yes` (enables) or `false`, `0`, `no` (disables)

## Adding New Flags

1. Add the flag name to the `FeatureFlagsConfig` interface in `src/config/featureFlags.ts`
2. Set default value with `getFlag()`:
   ```typescript
   NEW_FEATURE: getFlag("NEW_FEATURE", false), // default: false
   ```
3. Use `isFeatureEnabled("NEW_FEATURE")` in your code

Example:
```typescript
interface FeatureFlagsConfig {
  SHOW_VERSION_HISTORY: FeatureFlag;
  MY_NEW_FEATURE: FeatureFlag; // Add here
}

export const featureFlags: FeatureFlagsConfig = {
  SHOW_VERSION_HISTORY: getFlag("SHOW_VERSION_HISTORY", import.meta.env.DEV),
  MY_NEW_FEATURE: getFlag("MY_NEW_FEATURE", false), // Add here
};
```

Then use in your component:
```typescript
import { isFeatureEnabled } from "@/config/featureFlags";

if (isFeatureEnabled("MY_NEW_FEATURE")) {
  <MyNewFeatureComponent />
}
```
