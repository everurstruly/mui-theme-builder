export { default as useCodeOverridesActions } from "./Current/useCodeOverridesActions";
export { default as useCodeOverridesState } from "./Current/useCodeOverridesState";
export { default as useEditWithVisualTool } from "./Current/useEditWithVisualTool";
export { default as useCreatedTheme } from "./Current/useCreatedTheme";
export { default as useCreatedThemeOption } from "./Current/useCreatedThemeOption";

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
export { useDesignStore as useThemeDesignStore } from "./Current/designStore";
// === Template Registry (New) ===
export {
  templatesRegistry,
  getTemplateIds,
  buildTemplatesTree,
  buildTemplatesIndex,
  findFolderChain,
  getFolderNodeByChain,
  isTemplateIdValid,
  getValidTemplateId,
  getTemplateById,
  registerTemplate,
  type TemplateMetadata,
  type TreeNode as TemplateTreeNode,
} from "../Templates/registry";

export type {
  ThemeDesignState,
  ThemeDesignActions,
  ThemeDesignStore,
  ColorSchemeEdits,
  SerializableValue,
} from "./Current/designStore";

export type { CodeEvaluationResult } from "./domainSpecificLanguage/dslValidator";
export type { ThemeResolutionConfig } from "./domainSpecificLanguage/createThemeOptionsFromEdits";

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
export { default as resolveThemeOptions } from "./domainSpecificLanguage/createThemeOptionsFromEdits";
