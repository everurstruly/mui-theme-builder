/**
 * ThemeSheet - A flat-structure theme management system for MUI
 */

// ===== Core Store =====
export { useThemeSheetStore } from './themeSheet.store';

// ===== React Hooks =====
export { useThemeSheetValue, useThemeSheetTheme, useThemeSheetOptions } from './themeSheet.hooks';

// ===== Theme Resolution =====
export { resolveThemeOptions, invalidateThemeCache } from './themeSheet.resolver';

// ===== Templates & Presets =====
export {
  getThemeTemplate,
  listThemeTemplateIds,
  THEME_TEMPLATE_METADATA,
  type ThemeTemplateId,
} from './themeTemplates';

export {
  getThemePreset,
  listThemePresets,
} from './themePresets';

// ===== Utilities =====
export { 
  flattenThemeOptions, 
  expandFlatThemeOptions, 
  splitThemeOptions, 
  hydrateFunctions,
  getNestedValue,
  setNestedValue,
} from './themeSheet.utils';

// ===== Types =====
export type {
  SerializableValue,
  ThemeTemplateRef,
  ThemePreset,
  FlatThemeOptions,
  ThemeEditBuffer,
  ThemeSheetState,
  ThemeResolutionMode,
} from './types';

