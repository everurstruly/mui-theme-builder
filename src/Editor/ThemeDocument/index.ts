/**
 * ThemeDocument
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
  useThemeDocumentTheme,
  useThemeDocumentOptions,
  useThemeDocumentEditValue,
  useCodeEditorPanel,
} from './themeDocument.hooks';

// === Store ===
export { useThemeDocumentStore } from './themeDocument.store';

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
  ThemeDocumentState,
  ThemeDocumentActions,
  ThemeDocumentStore,
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
} from './themeDocument.utils';

// === Resolver (if needed externally) ===
export { resolveThemeOptions } from './themeDocument.resolver';
