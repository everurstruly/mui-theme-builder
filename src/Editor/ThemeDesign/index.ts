/**
 * ThemeDesign
 * 
 * A complete theme editing system with:
 * - Multi-layer architecture (template → composables → visual edits → code overrides)
 * - Separate light/dark mode customization
 * - Undo/redo support
 * - Performance-optimized hooks with targeted subscriptions
 * - Code editor integration with safe evaluation
 */

// === Core Hooks ===
export {
  useThemeDesignTheme,
  useThemeDesignOptions,
  useThemeDesignEditValue,
  useCodeEditorPanel,
} from './themeDesign.hooks';

// === Store ===
export { useThemeDesignStore } from './themeDesign.store';

// === Templates ===
export {
  getThemeTemplate,
  listThemeTemplateIds,
  THEME_TEMPLATE_METADATA,
  type ThemeTemplateId,
} from './themeTemplates';

// === Composables ===
export {
  getThemeComposable,
  listThemeComposables,
} from './themeComposables';

// === Types ===
export type {
  ThemeDesignState,
  ThemeDesignActions,
  ThemeDesignStore,
  ColorSchemeEdits,
  ThemeTemplateRef,
  ThemeComposable,
  ThemeResolutionConfig,
  SerializableValue,
  CodeEvaluationResult,
} from './types';

// === Utilities (if needed externally) ===
export {
  isColorSchemePath,
  flattenThemeOptions,
  expandFlatThemeOptions,
  evaluateCodeOverrides,
  splitLiteralsAndFunctions,
  deepMerge,
} from './themeDesign.utils';

// === Resolver (if needed externally) ===
export { resolveThemeOptions } from './themeDesign.resolver';

