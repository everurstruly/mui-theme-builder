# Theme Templates

This directory contains the theme template system for the MUI Theme Builder.

## Overview

Templates are pre-configured `ThemeOptions` objects that serve as starting points for theme customization. Each template defines both light and dark color schemes using MUI's `colorSchemes` property.

## Structure

```
Templates/
├── registry.ts          # Central registry and tree-building utilities
├── index.ts            # Module exports
├── material.ts         # Material Design template
├── modern.ts           # Modern theme template
├── minimal.ts          # Minimal theme template
└── README.md           # This file
```

## Creating a New Template

### 1. Create a Template File

Create a new `.ts` file (e.g., `custom.ts`) in this directory:

```typescript
import type { ThemeOptions } from "@mui/material";
import { alpha } from "@mui/material/styles";

/**
 * Custom Theme Template
 * 
 * Brief description of your theme
 */

const customTheme: ThemeOptions = {
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#your-color",
          // ...
        },
        // ... other palette options
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#your-dark-color",
          // ...
        },
        // ... other palette options
      },
    },
  },
  typography: {
    // ... typography options
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
};

export default customTheme;
```

### 2. Register the Template

Add your template to `registry.ts`:

```typescript
import customTheme from "./custom";

const templatesRegistry: Record<string, TemplateMetadata> = {
  // ... existing templates
  custom: {
    id: "custom",
    label: "Custom Theme",
    description: "Description of your custom theme",
    path: "root", // or "category/subcategory" for organization
    themeOptions: customTheme,
  },
};
```

### 3. Export the Template (Optional)

Add an export to `index.ts`:

```typescript
export { default as customTheme } from "./custom";
```

## Template Requirements

1. **Default Export**: Each template file must default-export a `ThemeOptions` object
2. **Color Schemes**: Must use `colorSchemes` property with `light` and `dark` definitions
3. **File Structure**: Can be a single file or an `index.ts` in a folder (single file preferred)
4. **Type Safety**: Use `ThemeOptions` type from `@mui/material`

## Registry Integration

Templates are automatically available in the Design Store through:

- `useDesignStore.getState().templatesRegistry` - Access all templates
- `useDesignStore.getState().getTemplateFromRegistry(id)` - Get specific template
- `useDesignStore.getState().getAllTemplates()` - Get array of all templates
- `useDesignStore.getState().getTemplatesTree()` - Get organized tree structure

## Path Organization

The `path` property in the registry controls UI organization:

- `"root"` - Places template at top level
- `"category"` - Creates a category folder
- `"category/subcategory"` - Creates nested structure

## Example Usage

```typescript
import { useDesignStore } from "../Design/designStore";

// Get all templates
const templates = useDesignStore.getState().getAllTemplates();

// Get specific template
const material = useDesignStore.getState().getTemplateFromRegistry("material");

// Check if template exists
const exists = useDesignStore.getState().isTemplateAvailable("custom");

// Switch to a template
useDesignStore.getState().switchTemplate(
  { type: "builtin", id: "material" },
  false // keepEdits
);
```

## Notes

- The old `designTemplates.ts` file is deprecated and should not be used as a reference
- Templates should use `colorSchemes` instead of separate light/dark theme objects
- All templates are loaded at initialization for fast access
