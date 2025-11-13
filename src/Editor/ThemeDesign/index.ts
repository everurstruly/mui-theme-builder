/**
 * ThemeDesign
 * 
 * A complete theme editing system with:
 * - Multi-layer architecture (template → composables → visual edits → code overrides)
 * - Separate light/dark mode customization
 * - Undo/redo support
 * - Performance-optimized hooks with targeted subscriptions
 * - DSL-based code editor with safe transformation (no eval)
 */

// === Core Hooks ===
export {
  useThemeDesignTheme,
  useThemeDesignOptions,
  useThemeDesignEditValue,
  useCodeEditorPanel,
  useCodeOverridesState,
  useCodeOverridesActions,
  useMergedThemePreview,
} from './themeDesign.hooks';

// === Validation ===
export {
  validateCodeBeforeEvaluation,
  useCodeOverridesValidation,
  type ValidationError,
  type ValidationResult,
} from './themeDesign.validation';

// === DSL Transformation (Code → DSL → ThemeOptions) ===
export { transformCodeToDsl } from './themeDesign.codeToDsl';
export { transformDslToThemeOptions } from './themeDesign.dslToTheme';

// === Store ===
export { useThemeDesignStore } from './themeDesign.store';

// === Templates ===
export {
  getThemeTemplate,
  listThemeTemplateIds,
  THEME_TEMPLATE_METADATA,
  type ThemeTemplateId,
} from './themeTemplates';

// === Types ===
export type {
  ThemeDesignState,
  ThemeDesignActions,
  ThemeDesignStore,
  ColorSchemeEdits,
  ThemeTemplateRef,
  ThemeResolutionConfig,
  SerializableValue,
  CodeEvaluationResult,
  // DSL Types
  ThemeDsl,
  DslValue,
  DslPlaceholder,
  DslTransformResult,
  DslResolutionContext,
  DslSpacingPlaceholder,
  DslTokenPlaceholder,
  DslBreakpointPlaceholder,
  DslHelperPlaceholder,
  DslFunctionPlaceholder,
} from './types';

// === Utilities (if needed externally) ===
export {
  isColorSchemePath,
  flattenThemeOptions,
  expandFlatThemeOptions,
  deepMerge,
} from './themeDesign.utils';

// === Resolver (if needed externally) ===
export { resolveThemeOptions } from './themeDesign.resolver';


