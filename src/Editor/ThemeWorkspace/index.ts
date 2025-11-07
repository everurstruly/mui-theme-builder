/**
 * ThemeWorkspace Module
 * 
 * A complete theme management system with:
 * - Serializable state (no functions in stores)
 * - Layered composition (base → composables → user mods)
 * - Two resolution modes: 'raw' (strict) and 'failsafe' (safe preview)
 * - Undo/redo history (via zundo)
 * - Live preview with transient raw buffer
 */

// ===== Core Types =====
export type {
  SerializableValue,
  BaseThemeReference,
  Composable,
  RawThemeModification,
  ResolvedThemeModifications,
  ThemeWorkspaceState,
  ResolutionMode,
} from './types';

// ===== Store =====
export { useThemeWorkspaceStore } from './stores/themeWorkspace.store';

// ===== Theme Resolution =====
export {
  resolveThemeOptions,
  resolveThemeOptionsForPreview,
  resolveThemeOptionsForExport,
} from './themeOptionsResolver';

// ===== Registries =====
export {
  getStaticBaseThemeOptions,
  listBaseThemeIds,
} from './baseThemes';

export {
  getComposableById,
  listComposables,
} from './appearanceComposables';

// ===== Hooks =====
export { useThemeValue } from './hooks/useThemeValue.hooks';
export { useThemeHistory } from './hooks/useThemeHistory.hooks';
export { useThemeWorkspaceCreatedTheme as useThemePreview } from './hooks/useThemePreview.hooks';

// ===== Components =====
export { ThemePreviewPane } from './components/ThemePreviewPane';

// ===== Utilities (advanced usage) =====
export { flattenThemeOptions } from './utils/flattenThemeOptions';
export { expandFlatThemeOptions } from './utils/expandFlatThemeOptions';
export { splitThemeOptions } from './utils/splitThemeOptions';
export { hydrateFunctionsSafely } from './utils/hydrateFunctionsSafely';
