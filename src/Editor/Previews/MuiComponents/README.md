# MUI Components Registry

**Auto-generated component registry from `@mui/material` package.**

## Purpose

Instead of manually duplicating the component list from MUI docs, this module **automatically discovers** all available MUI components from the package itself.

## How It Works

### 1. **Auto-Discovery**
```typescript
import * as MuiMaterial from '@mui/material';

// Get all exported names
Object.keys(MuiMaterial)
  .filter(isComponent) // Filter out hooks, utils, types
  .map(name => ({
    id: name,
    component: MuiMaterial[name],
    category: getCategoryForComponent(name)
  }));
```

### 2. **Category Mapping**
Components are categorized based on MUI's documentation structure:
- **Inputs**: Button, TextField, Checkbox, etc.
- **Data Display**: Avatar, Badge, Table, etc.
- **Feedback**: Alert, Dialog, Progress, etc.
- **Surfaces**: Card, Paper, AppBar, etc.
- **Navigation**: Menu, Tabs, Drawer, etc.
- **Layout**: Box, Grid, Stack, etc.
- **Utils**: Modal, Popover, Portal, etc.

### 3. **Tree Generation**
The `buildMuiComponentTree()` function groups components by category:
```
Inputs (15 components)
  ├─ Button
  ├─ TextField
  └─ ...
Data Display (22 components)
  ├─ Avatar
  ├─ Badge
  └─ ...
```

## Usage

### In Explorer Panel
```tsx
import { MuiComponentsTree } from './ExplorerPanel/MuiComponentsTree';

// Displays auto-generated tree of all MUI components
<MuiComponentsTree />
```

### Get Component Registry
```tsx
import { muiComponentsRegistry } from './Workfile/Components/muiComponentsRegistry';

// Access any component by name
const ButtonComponent = muiComponentsRegistry['Button'].component;
```

### Get Tree Structure
```tsx
import { muiComponentsTree } from './Workfile/Components/muiComponentsRegistry';

// Tree grouped by category
Object.keys(muiComponentsTree); // ['Inputs', 'Data Display', ...]
```

## Benefits

✅ **Always up-to-date**: Automatically includes new components when MUI updates  
✅ **No duplication**: Single source of truth (the package itself)  
✅ **Type-safe**: Full TypeScript support  
✅ **Zero maintenance**: No need to manually track component additions  

## Separation from Previews

| Feature | MUI Components | Previews |
|---------|----------------|----------|
| Purpose | Raw MUI building blocks | Complete UI examples |
| Source | `@mui/material` package | Custom-built examples |
| Location | `/Workfile/Components/` | `/Workfile/Previews/` |
| Usage | Component library | Theme testing |

## Filtering Logic

The auto-discovery excludes:
- **Hooks**: `use*` (e.g., `useTheme`, `useMediaQuery`)
- **Utilities**: `create*` (e.g., `createTheme`, `createPalette`)
- **Types**: `*Props`, `*Classes`, `*Theme*`
- **Styled utilities**: `styled*`

This ensures only actual React components are included in the registry.
