/**
 * Theme Compiler Service
 * 
 * Provides safe transformation and validation for MUI theme code.
 * This service acts as the boundary between user-written code and
 * runtime ThemeOptions, using a DSL to prevent code injection.
 * 
 * Architecture:
 * - Validation: Syntax and structure checks (validator.ts)
 * - Transformation: Code ↔ DSL ↔ ThemeOptions (transformation/)
 * - Parsing: AST utilities and code parsing (parsing/)
 * - Utilities: Helper functions (utilities/)
 */

// ========== Types ==========
export type {
  // DSL Types
  DslPlaceholder,
  DslSpacingPlaceholder,
  DslTokenPlaceholder,
  DslBreakpointPlaceholder,
  DslHelperPlaceholder,
  DslFunctionPlaceholder,
  DslValue,
  ThemeDsl,
  
  // Result Types
  DslTransformResult,
  DslResolutionContext,
} from './types';

// ========== Validation ==========
export {
  validateCodeBeforeEvaluation,
  type CodeEvaluationResult,
  type ValidationError,
  type ValidationResult,
} from './validation/validator';

// ========== Transformation ==========
export { transformCodeToDsl } from './transformation/codeStringToDsl';
export { transformDslToThemeOptions } from './transformation/dslToThemeOptions';
export { default as createThemeOptionsFromEdits, type ThemeResolutionConfig } from './transformation/editsToThemeOptions';

// ========== Parsing ==========
export { parseThemeCode, serializeThemeOptions } from './parsing/codeStringParser';

// ========== Utilities ==========
export { flattenThemeObject } from './utilities/flatten';
export {
  getNestedValue,
  setNestedValue,
  expandFlatThemeOptions,
  flattenThemeOptions,
  deepMerge,
  type SerializableValue,
} from './utilities/objectOps';
export { 
  isColorSchemePath,
  COLOR_SCHEME_PATHS,
} from './utilities/colorSchemes';

// ========== Convenience Service ==========
import { validateCodeBeforeEvaluation } from './validation/validator';
import { transformCodeToDsl } from './transformation/codeStringToDsl';
import { flattenThemeObject } from './utilities/flatten';

/**
 * Unified theme compiler service for validation and transformation.
 */
export const themeCompiler = {
  /**
   * Validates theme code for syntax errors and dangerous patterns.
   * @param code - JavaScript code string to validate
   * @returns Validation result with error details
   */
  validateThemeCode: validateCodeBeforeEvaluation,

  /**
   * Transforms JavaScript code to safe DSL representation.
   * @param code - JavaScript ThemeOptions code
   * @returns DSL transform result
   */
  transformThemeCode: (code: string) => {
    const result = transformCodeToDsl(code);
    if (result.error) {
      throw new Error(result.error);
    }
    return result.dsl;
  },

  /**
   * Flattens nested ThemeOptions for display/comparison.
   * @param obj - Theme object to flatten
   * @returns Flat key-value object
   */
  flattenThemeObject,

  // ========== Backward Compatibility Aliases ==========
  /** @deprecated Use validateThemeCode instead */
  validate: validateCodeBeforeEvaluation,
  
  /** @deprecated Use transformThemeCode, but note: old transform returned full result, new returns only DSL */
  transform: transformCodeToDsl,
  
  /** @deprecated Use flattenThemeObject instead */
  flatten: flattenThemeObject,
} as const;
