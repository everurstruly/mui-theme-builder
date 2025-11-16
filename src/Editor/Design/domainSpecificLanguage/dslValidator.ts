import type { ThemeOptions } from "@mui/material";
import { parse } from 'acorn';
import type { SerializableValue } from "../designStore";

/**
 * Result of evaluating code overrides.
 */
export interface CodeEvaluationResult {
  /** Successfully evaluated ThemeOptions */
  evaluated: ThemeOptions;

  /** Flattened version for quick path lookups */
  flattened: Record<string, SerializableValue>;

  /** Error message if evaluation failed */
  error: string | null;
}

/**
 * Validation error with location information for CodeMirror display.
 */
export interface ValidationError {
  message: string;
  line?: number;
  column?: number;
  severity: 'error' | 'warning';
}

/**
 * Result of pre-evaluation validation.
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Known valid ThemeOptions top-level properties.
 * Based on MUI v5/v6 ThemeOptions interface.
 */
const VALID_THEME_PROPERTIES = new Set([
  'breakpoints',
  'components',
  'direction',
  'mixins',
  'palette',
  'shadows',
  'shape',
  'spacing',
  'transitions',
  'typography',
  'zIndex',
  // Unstable/experimental
  'unstable_sx',
  'unstable_sxConfig',
  'containerQueries',
]);

/**
 * Validates code before evaluation to ensure it's safe and valid ThemeOptions.
 * 
 * Validation steps:
 * 1. Parse JavaScript/TypeScript AST to ensure it's syntactically valid
 * 2. Verify it's an object literal (not arbitrary code)
 * 3. Check that top-level properties are valid ThemeOptions keys
 * 4. Warn about potentially problematic values
 * 
 * @param source - JavaScript/TypeScript code string
 * @returns Validation result with errors/warnings
 * 
 * @example
 * const result = validateCodeBeforeEvaluation('{ palette: { primary: { main: "#ff0000" } } }');
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 */
export function validateCodeBeforeEvaluation(source: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Empty source is valid (no overrides)
  if (!source.trim()) {
    return { valid: true, errors: [], warnings: [] };
  }

  // Step 1: Parse AST to validate syntax
  // Accept both full editor content (with header/footer) and raw object literals.
  // If the source contains a `const theme = { ... };` wrapper, extract the inner object
  // before parsing so comments/TS annotations don't make the wrapped expression invalid.
  const objectMatch = /const\s+theme(?:\s*:\s*[^=]+)?\s*=\s*\{([\s\S]*?)\};/m.exec(source);
  const parseSource = objectMatch ? `{${objectMatch[1]}}` : source;

  let ast: ReturnType<typeof parse>;
  try {
    // Wrap in parentheses to support object literals
    const wrappedSource = `(${parseSource})`;
    ast = parse(wrappedSource, {
      ecmaVersion: 2022,
      sourceType: 'module',
      locations: true, // Include line/column info
    });
  } catch (error: unknown) {
    const err = error as { message: string; loc?: { line: number; column: number } };
    errors.push({
      message: `Syntax error: ${err.message}`,
      line: err.loc?.line,
      column: err.loc?.column,
      severity: 'error',
    });
    return { valid: false, errors, warnings };
  }

  // Step 2: Verify it's an object literal
  if (
    !ast.body ||
    ast.body.length !== 1 ||
    ast.body[0].type !== 'ExpressionStatement'
  ) {
    errors.push({
      message: 'Code must be a single object literal expression',
      severity: 'error',
    });
    return { valid: false, errors, warnings };
  }

  const expression = ast.body[0].expression;
  if (expression.type !== 'ObjectExpression') {
    errors.push({
      message: `Expected object literal, got ${expression.type}`,
      line: expression.loc?.start.line,
      column: expression.loc?.start.column,
      severity: 'error',
    });
    return { valid: false, errors, warnings };
  }

  // Step 3: Validate top-level properties are valid ThemeOptions keys
  const objectExpression = expression;
  for (const property of objectExpression.properties) {
    // Handle both Property and SpreadElement
    if (property.type === 'SpreadElement') {
      warnings.push({
        message: 'Spread syntax (...) may cause unexpected merging behavior',
        line: property.loc?.start.line,
        column: property.loc?.start.column,
        severity: 'warning',
      });
      continue;
    }

    // Get property key (handle both Identifier and Literal)
    let keyName: string | null = null;
    if (property.key.type === 'Identifier') {
      keyName = property.key.name;
    } else if (property.key.type === 'Literal') {
      keyName = String(property.key.value);
    }

    if (!keyName) {
      warnings.push({
        message: 'Could not determine property name (computed property?)',
        line: property.loc?.start.line,
        column: property.loc?.start.column,
        severity: 'warning',
      });
      continue;
    }

    // Check if property is a valid ThemeOptions key
    if (!VALID_THEME_PROPERTIES.has(keyName)) {
      errors.push({
        message: `"${keyName}" is not a valid ThemeOptions property. Valid properties: ${Array.from(
          VALID_THEME_PROPERTIES
        ).join(', ')}`,
        line: property.loc?.start.line,
        column: property.loc?.start.column,
        severity: 'error',
      });
    }
  }

  // Step 4: Additional checks for problematic patterns
  // Check for function calls (which might be dangerous)
  const hasCallExpressions = checkForCallExpressions(objectExpression as unknown as Record<string, unknown>);
  if (hasCallExpressions.found) {
    warnings.push({
      message:
        'Function calls detected. Only use MUI helper functions (alpha, darken, lighten, etc.)',
      line: hasCallExpressions.line,
      column: hasCallExpressions.column,
      severity: 'warning',
    });
  }

  const valid = errors.length === 0;
  return { valid, errors, warnings };
}

/**
 * Recursively checks if an AST node contains CallExpression nodes.
 * Used to warn about potentially dangerous function calls.
 */
function checkForCallExpressions(
  node: Record<string, unknown>,
  depth: number = 0
): { found: boolean; line?: number; column?: number } {
  // Limit recursion depth to avoid performance issues
  if (depth > 20) {
    return { found: false };
  }

  if (!node || typeof node !== 'object') {
    return { found: false };
  }

  // Found a call expression
  if (node.type === 'CallExpression') {
    const loc = node.loc as { start?: { line?: number; column?: number } } | undefined;
    return {
      found: true,
      line: loc?.start?.line,
      column: loc?.start?.column,
    };
  }

  // Recursively check child nodes
  for (const key of Object.keys(node)) {
    const value = node[key];

    if (Array.isArray(value)) {
      for (const item of value) {
        const result = checkForCallExpressions(item, depth + 1);
        if (result.found) {
          return result;
        }
      }
    } else if (value && typeof value === 'object') {
      const result = checkForCallExpressions(value as Record<string, unknown>, depth + 1);
      if (result.found) {
        return result;
      }
    }
  }

  return { found: false };
}

/**
 * Hook for code editor validation.
 * Provides validation function and current validation state.
 * 
 * @returns Validation utilities
 * 
 * @example
 * function CodeEditor() {
 *   const { validate } = useCodeOverridesValidation();
 *   
 *   const handleApply = (code: string) => {
 *     const result = validate(code);
 *     if (!result.valid) {
 *       showErrors(result.errors);
 *       return;
 *     }
 *     applyChanges(code);
 *   };
 * }
 */
export function useCodeOverridesValidation() {
  return {
    validate: validateCodeBeforeEvaluation,
  };
}
