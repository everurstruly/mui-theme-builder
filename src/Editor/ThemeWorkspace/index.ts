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
export { useThemeWorkspaceStore } from './themeWorkspaceStore';

// ===== Theme Resolution =====
export {
  resolveThemeOptions,
  resolveThemeOptionsForPreview,
  resolveThemeOptionsForExport,
} from './themeOptionsResolver';

// ===== Registries =====
export {
  getStaticThemeOptionsTemplate as getStaticBaseThemeOptions,
  listThemeOptionsTemplateIds as listBaseThemeIds,
} from './themeTemplates';

export {
  getComposableById,
  listComposables,
} from './appearanceComposables';

// ===== Hooks =====
export { useThemeWorkspaceEditValue as useThemeValue } from './useThemeOptionsValue';
export { useThemeWorkspaceHistory as useThemeHistory } from './useThemeHistory.hooks';
export { useThemeWorkspaceCreatedTheme as useThemeCreated } from './useCreatedTheme.hooks';

// ===== Utilities (advanced usage) =====
export { flattenThemeOptions } from './utils/flattenThemeOptions';
export { expandFlatThemeOptions } from './utils/expandFlatThemeOptions';
export { splitThemeOptions } from './utils/splitThemeOptions';
export { hydrateFunctionsSafely } from './utils/hydrateFunctionsSafely';
