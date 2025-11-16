export { default as useDesignedEditsResolvedThemeOptions } from "./useVisualToolEditsThemeOptions";
export { default as useCodeOverridesActions } from "./useCodeOverridesActions";
export { default as useCodeOverridesState } from "./useCodeOverridesState";
export { default as useThemeDesignEditValue } from "./useEditWithVisualTool";
export { default as useThemeDesignTheme } from "./useDesignCreatedTheme";
export { default as useResolvedThemeOptions } from "./useDesignCreatedThemeOptions";

// === Validation ===
export {
  validateCodeBeforeEvaluation,
  useCodeOverridesValidation,
  type ValidationError,
  type ValidationResult,
} from "./domainSpecificLanguage/dslValidator";

// === DSL Transformation (Code → DSL → ThemeOptions) ===
export { transformCodeToDsl } from "./domainSpecificLanguage/themeOptionsToDslTransformer";
export { transformDslToThemeOptions } from "./domainSpecificLanguage/dslToThemeOptionsTransformer";

// === Store ===
export { useDesignStore as useThemeDesignStore } from "./designStore";

// === Templates ===
export {
  getDesignTemplate as getThemeTemplate,
  listDesignTemplateIds as listThemeTemplateIds,
  THEME_TEMPLATE_METADATA,
  type ThemeTemplateId,
} from "./designTemplates";

export type {
  ThemeDesignState,
  ThemeDesignActions,
  ThemeDesignStore,
  ColorSchemeEdits,
  ThemeTemplateRef,
  SerializableValue,
} from "./designStore";

export type { CodeEvaluationResult } from "./domainSpecificLanguage/dslValidator";
export type { ThemeResolutionConfig } from "./createThemeOptionsFromEdits";

export type {
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
} from "./domainSpecificLanguage/types";

// === Utilities (if needed externally) ===
export {
  isColorSchemePath,
  flattenThemeOptions,
  expandFlatThemeOptions,
  deepMerge,
} from "./shared";

// === Resolver (if needed externally) ===
export { default as resolveThemeOptions } from "./createThemeOptionsFromEdits";
