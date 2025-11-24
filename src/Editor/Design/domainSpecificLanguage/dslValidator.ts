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
 * 🛑 DANGEROUS PROPERTY KEYS FOR PROTOTYPE POLLUTION 🛑
 * These keys are strictly forbidden at any nesting level within the theme object.
 */
const DANGEROUS_KEYS = new Set([
  '__proto__',
  'constructor',
  'prototype',
]);

/**
 * Validates code before evaluation to ensure it's safe and valid ThemeOptions.
 *
 * Validation steps:
 * 1. Parse JavaScript/TypeScript AST to ensure it's syntactically valid
 * 2. Verify it's an object literal (not arbitrary code)
 * 3. Check that top-level properties are valid ThemeOptions keys
 * 4. Perform deep AST traversal to enforce strict blocklisting of dangerous expressions and keys.
 *
 * @param source - JavaScript/TypeScript code string
 * @returns Validation result with errors/warnings
 */
export function validateCodeBeforeEvaluation(source: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Empty source is valid (no overrides)
  if (!source.trim()) {
    return { valid: true, errors: [], warnings: [] };
  }

  // Step 1: Parse AST to validate syntax
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
    
    // 💥 NEW CHECK: Block dangerous keys at the top level
    if (DANGEROUS_KEYS.has(keyName)) {
       errors.push({
         message: `Use of the reserved property key "${keyName}" is strictly forbidden for security reasons.`,
         line: property.loc?.start.line,
         column: property.loc?.start.column,
         severity: 'error',
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

  // Step 4: Additional checks for problematic patterns via deep AST traversal
  const nodeLimits = { maxDepth: 12, maxNodes: 5000 };
  let nodesVisited = 0;

  function tooComplex() {
    return nodesVisited > nodeLimits.maxNodes;
  }

  const HELPER_WHITELIST = new Set([
    'alpha',
    'darken',
    'lighten',
    'applyStyles',
    'toRuntimeSource',
  ]);

  function getLoc(n: any) {
    return { line: n?.loc?.start?.line, column: n?.loc?.start?.column };
  }

  function getKeyName(key: any) {
    if (!key) return 'unknown';
    if (key.type === 'Identifier') return key.name;
    if (key.type === 'Literal') return String((key as any).value);
    return 'unknown';
  }

  function isThemeMemberExpression(node: any): boolean {
    // Walk MemberExpression chain; accept if any Identifier named `theme` appears
    try {
      if (!node) return false;
      if (node.type === 'MemberExpression') {
        let cur: any = node;
        while (cur) {
          if (cur.type === 'Identifier' && cur.name === 'theme') return true;
          if (cur.object) cur = cur.object; else break;
        }
      }
      if (node.type === 'Identifier' && node.name === 'theme') return true;
    } catch {
      return false;
    }
    return false;
  }

  function isAllowedCallExpression(node: any): boolean {
    if (!node || node.type !== 'CallExpression') return false;
    const callee = node.callee;
    if (!callee) return false;
    if (callee.type === 'Identifier' && HELPER_WHITELIST.has(callee.name)) return true;
    if (callee.type === 'MemberExpression' && isThemeMemberExpression(callee)) return true;
    return false;
  }

  function isConciseThemeArrowFunction(node: any): boolean {
    // Must be ArrowFunctionExpression, single param which is an ObjectPattern
    // with exactly one property named `theme`, and concise body that is
    // directly an ObjectExpression (no BlockStatement / return)
    if (!node) return false;
    if (node.type !== 'ArrowFunctionExpression') return false;
    if (!node.params || node.params.length !== 1) return false;
    const p = node.params[0];
    if (p.type === 'ObjectPattern') {
      if (!p.properties || p.properties.length !== 1) return false;
      const prop = p.properties[0];
      // support both Identifier and Property nodes
      const keyName = prop.key?.name || (prop.key && prop.key.value);
      if (keyName !== 'theme') return false;
    } else {
      // we do not accept `theme` as identifier param — require destructuring
      return false;
    }

    // Body must be an ObjectExpression (concise body)
    if (!node.body || node.body.type !== 'ObjectExpression') return false;
    return true;
  }

  function checkValueNode(node: any, path: string[]) {
    // Basic performance guard
    nodesVisited++;
    if (tooComplex()) return;

    if (!node) return;

    switch (node.type) {
      case 'Literal':
        // ... existing color format validation logic ...
        if (typeof node.value === 'string') {
          const lastKey = path[path.length - 1] || '';
          const isColorPath = path.includes('palette') || /color/i.test(lastKey) || ['main','light','dark','contrastText'].includes(lastKey);
          if (isColorPath) {
            const v = node.value as string;
            const colorRegex = /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})|(rgb|rgba|hsl|hsla)\([^)]*\)|color\([^)]*\))/;
            if (!colorRegex.test(v.trim())) {
              const loc = getLoc(node);
              errors.push({
                message: `Unsupported color format "${v}" at ${path.join('.')}. Use #hex, rgb(), rgba(), hsl(), hsla(), or color() instead of named colors.`,
                line: loc.line,
                column: loc.column,
                severity: 'error',
              });
            }
          }
        }
        return;
      case 'TemplateElement':
        return; // allowed
      case 'ObjectExpression':
        for (const p of node.properties || []) {
          if (p.type === 'SpreadElement') {
            const loc = getLoc(p);
            errors.push({
              message: `Spread syntax is not allowed inside style override objects (at ${path.join('.')})`,
              line: loc.line,
              column: loc.column,
              severity: 'error',
            });
            continue;
          }
          if (p.computed) {
            const loc = getLoc(p);
            errors.push({
              message: `Computed property keys are not allowed (at ${path.join('.')})`,
              line: loc.line,
              column: loc.column,
              severity: 'error',
            });
          }
          
          // Get property key name for dangerous key check
          const keyName = getKeyName(p.key);

          // 💥 NEW CHECK: Block dangerous keys at deep levels
          if (DANGEROUS_KEYS.has(keyName)) {
             const loc = getLoc(p);
             errors.push({
               message: `Use of the reserved property key "${keyName}" is strictly forbidden for security reasons.`,
               line: loc.line,
               column: loc.column,
               severity: 'error',
             });
             continue; // Skip processing the value if the key is bad
          }

          const val = p.value || p.argument;
          checkValueNode(val, path.concat([keyName]));
        }
        return;
      case 'ArrayExpression':
        for (const el of node.elements || []) {
          checkValueNode(el, path.concat(['[]']));
        }
        return;
      case 'Identifier':
        // Bare identifiers as values are disallowed in override objects
        if (node.name !== 'undefined' && node.name !== 'null') {
          const loc = getLoc(node);
          errors.push({
            message: `Unquoted identifier "${node.name}" is not allowed as a value (use a string or literal) at ${path.join('.')}`,
            line: loc.line,
            column: loc.column,
            severity: 'error',
          });
        }
        return;
      case 'CallExpression':
        if (!isAllowedCallExpression(node)) {
          const loc = getLoc(node);
          errors.push({
            message: `Call expression is not allowed here (only known helpers or theme member calls) at ${path.join('.')}`,
            line: loc.line,
            column: loc.column,
            severity: 'error',
          });
        } else {
          // Check arguments recursively
          for (const a of node.arguments || []) checkValueNode(a, path.concat(['()']));
        }
        return;
      case 'MemberExpression':
        // Member expressions are allowed only when they reference `theme`
        if (!isThemeMemberExpression(node)) {
          const loc = getLoc(node);
          errors.push({
            message: `Member expression not referencing theme is not allowed at ${path.join('.')}`,
            line: loc.line,
            column: loc.column,
            severity: 'error',
          });
        }
        return;
      case 'ArrowFunctionExpression':
      case 'FunctionExpression':
        // Functions are allowed only in the strict concise pattern; otherwise error
        if (!isConciseThemeArrowFunction(node)) {
          const loc = getLoc(node);
          errors.push({
            message: `Only concise arrow functions of the form ({ theme }) => ({ ... }) are allowed in style overrides at ${path.join('.')}`,
            line: loc.line,
            column: loc.column,
            severity: 'error',
          });
        } else {
          // If it is the allowed concise function, validate its returned object
          checkValueNode(node.body, path.concat(['<fn>']));
        }
        return;
      case 'TemplateLiteral':
        // Ensure expressions inside templates are safe
        for (const expr of node.expressions || []) {
          if (expr.type === 'Literal') continue;
          if (expr.type === 'MemberExpression' && isThemeMemberExpression(expr)) continue;
          const loc = getLoc(expr);
          errors.push({
            message: `Unsafe expression in template literal at ${path.join('.')}`,
            line: loc.line,
            column: loc.column,
            severity: 'error',
          });
        }
        return;
      default: {
        // Unknown node types are rejected
        const loc = getLoc(node);
        errors.push({
          message: `Unsupported expression type ${node.type} at ${path.join('.')}`,
          line: loc.line,
          column: loc.column,
          severity: 'error',
        });
        return;
      }
    }
  }

  // Walk `components` subtree and apply strict rules
  for (const prop of objectExpression.properties) {
    if (prop.type !== 'Property') continue;
    const keyName = prop.key.type === 'Identifier' ? prop.key.name : getKeyName(prop.key);
    if (keyName !== 'components') continue;
    const compVal = (prop.value as any);
    if (!compVal || compVal.type !== 'ObjectExpression') continue;

    // components.<ComponentName> -> ObjectExpression
    for (const compProp of compVal.properties || []) {
      if (compProp.type !== 'Property') continue;
      const compName = compProp.key.type === 'Identifier' ? compProp.key.name : getKeyName(compProp.key);
      const compDef = compProp.value;
      if (!compDef || compDef.type !== 'ObjectExpression') continue;

      // Look for styleOverrides and variants keys inside compDef
      for (const inner of compDef.properties || []) {
        if (inner.type !== 'Property') continue;
        const innerKey = inner.key.type === 'Identifier' ? inner.key.name : String(inner.key.value);
        if (innerKey === 'styleOverrides') {
          const so = inner.value;
          if (!so) continue;
          if (so.type === 'ObjectExpression') {
            for (const soProp of so.properties || []) {
              if (soProp.type !== 'Property') continue;
              if (soProp.computed) {
                const loc = getLoc(soProp);
                errors.push({ message: `Computed keys in styleOverrides are not allowed for ${compName}`, line: loc.line, column: loc.column, severity: 'error' });
                continue;
              }
              // The deep check for DANGEROUS_KEYS is already done in checkValueNode(soVal, ...)
              const soVal = soProp.value || soProp.argument;
              checkValueNode(soVal, ['components', compName, 'styleOverrides', getKeyName(soProp.key)]);
            }
          }
        } else if (innerKey === 'variants') {
          const variants = inner.value;
          if (!variants || variants.type !== 'ArrayExpression') continue;
          for (const v of variants.elements || []) {
            if (!v || v.type !== 'ObjectExpression') continue;
            for (const vp of v.properties || []) {
              if (vp.type !== 'Property') continue;
              const vKey = vp.key.type === 'Identifier' ? vp.key.name : getKeyName(vp.key);
              if (vKey === 'style') {
                // The deep check for DANGEROUS_KEYS is already done in checkValueNode(vp.value, ...)
                checkValueNode(vp.value, ['components', compName, 'variants', 'style']);
              }
            }
          }
        }
      }
    }
  }

  // Also validate `palette` subtree to catch unquoted identifiers (e.g., `red`)
  for (const prop of objectExpression.properties) {
    if (prop.type !== 'Property') continue;
    const keyName = prop.key.type === 'Identifier' ? prop.key.name : getKeyName(prop.key);
    if (keyName !== 'palette') continue;
    const pal = prop.value as any;
    if (!pal || pal.type !== 'ObjectExpression') continue;
    checkValueNode(pal, ['palette']);
  }

  // Validate other top-level theme keys that may contain user-provided values
  const TOPLEVEL_KEYS_TO_VALIDATE = new Set([
    'typography',
    'spacing',
    'shadows',
    'shape',
    'transitions',
    'breakpoints',
    'mixins',
    'zIndex',
    'unstable_sx',
    'unstable_sxConfig',
    'containerQueries',
    'direction',
  ]);

  for (const prop of objectExpression.properties) {
    if (prop.type !== 'Property') continue;
    const keyName = prop.key.type === 'Identifier' ? prop.key.name : getKeyName(prop.key);
    if (!TOPLEVEL_KEYS_TO_VALIDATE.has(keyName)) continue;
    const val = prop.value as any;
    if (!val) continue;
    checkValueNode(val, [keyName]);
  }

  const valid = errors.length === 0;
  return { valid, errors, warnings };
}


/**
 * Hook for code editor validation.
 * Provides validation function and current validation state.
 *
 * @returns Validation utilities
 *
 * @example
 * function CodeEditor() {
 * const { validate } = useCodeOverridesValidation();
 *
 * const handleApply = (code: string) => {
 * const result = validate(code);
 * if (!result.valid) {
 * showErrors(result.errors);
 * return;
 * }
 * applyChanges(code);
 * };
 * }
 */
export function useCodeOverridesValidation() {
  return {
    validate: validateCodeBeforeEvaluation,
  };
}