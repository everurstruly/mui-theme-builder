/**
 * ThemeSheet Module
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
  ThemeSheetState,
  ResolutionMode,
} from './types';

// ===== Store =====
export { useThemeSheetStore } from './stores/themeWorkspace.store';

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
export { useThemeSheetEditValue } from './hooks/useThemeSheetEditValue.hooks';
export { useThemeSheetHistory } from './hooks/useThemeSheetHistory.hooks';
export { useThemeSheetCreatedTheme as useThemePreview } from './hooks/useThemePreview.hooks';

// ===== Components =====
export { ThemePreviewPane } from './components/ThemePreviewPane';

// ===== Utilities (advanced usage) =====
export { flattenThemeOptions } from './utils/flattenThemeOptions';
export { expandFlatThemeOptions } from './utils/expandFlatThemeOptions';
export { splitThemeOptions } from './utils/splitThemeOptions';
export { hydrateFunctionsSafely } from './utils/hydrateFunctionsSafely';
