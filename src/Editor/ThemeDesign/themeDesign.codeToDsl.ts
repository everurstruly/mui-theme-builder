import { parse } from 'acorn';
import type {
  ThemeDsl,
  DslTransformResult,
  DslValue,
  DslPlaceholder,
} from './types';

// Type helpers for acorn AST nodes
type AnyNode = any; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Transforms user-written MUI ThemeOptions code into a safe DSL representation.
 * 
 * This function:
 * 1. Parses the code to an AST
 * 2. Walks the AST and recognizes only allowed MUI patterns
 * 3. Transforms recognized patterns into DSL placeholders
 * 4. Rejects any unrecognized or unsafe constructs
 * 
 * Allowed patterns:
 * - Arrow functions: `({ theme }) => ({ ... })`
 * - `theme.spacing(n)` → spacing placeholder
 * - `theme.palette.*` → token placeholder
 * - `theme.breakpoints.up('md')` → breakpoint placeholder
 * - MUI helpers: `alpha()`, `lighten()`, `darken()`
 * - Literals: strings, numbers, booleans, objects, arrays
 * 
 * @param source - User code string (MUI ThemeOptions)
 * @returns Transform result with DSL, source, errors, warnings
 * 
 * @example
 * const result = transformCodeToDsl(`{
 *   components: {
 *     MuiButton: {
 *       styleOverrides: {
 *         root: ({ theme }) => ({
 *           fontSize: theme.spacing(2),
 *           [theme.breakpoints.up('md')]: { fontSize: '14px' }
 *         })
 *       }
 *     }
 *   }
 * }`);
 * 
 * if (!result.error) {
 *   console.log(result.dsl); // Safe DSL with placeholders
 * }
 */
export function transformCodeToDsl(source: string): DslTransformResult {
  const warnings: string[] = [];

  // Empty source is valid (no overrides)
  if (!source.trim()) {
    return {
      dsl: {},
      source: '',
      error: null,
      warnings: [],
    };
  }

  try {
    // Extract inner object if wrapped in template
    const objectMatch = /const\s+theme(?:\s*:\s*[^=]+)?\s*=\s*\{([\s\S]*?)\};/m.exec(source);
    const parseSource = objectMatch ? `{${objectMatch[1]}}` : source;

    // Parse to AST
    const wrappedSource = `(${parseSource})`;
    const ast = parse(wrappedSource, {
      ecmaVersion: 2022,
      sourceType: 'module',
      locations: true,
    });

    // Verify it's a single expression statement with object expression
    if (
      !ast.body ||
      ast.body.length !== 1 ||
      ast.body[0].type !== 'ExpressionStatement'
    ) {
      return {
        dsl: {},
        source,
        error: 'Code must be a single object literal expression',
        warnings,
      };
    }

    const expression = ast.body[0].expression;
    if (expression.type !== 'ObjectExpression') {
      return {
        dsl: {},
        source,
        error: `Expected object literal, got ${expression.type}`,
        warnings,
      };
    }

    // Transform AST to DSL
    const dsl = transformNode(expression, warnings) as ThemeDsl;

    return {
      dsl,
      source,
      error: null,
      warnings,
    };
  } catch (error) {
    const err = error as Error;
    return {
      dsl: {},
      source,
      error: `Transform failed: ${err.message}`,
      warnings,
    };
  }
}

/**
 * Recursively transforms an AST node to a DSL value.
 * Recognizes MUI patterns and converts them to placeholders.
 */
function transformNode(node: AnyNode, warnings: string[]): DslValue {
  switch (node.type) {
    // ===== Literals =====
    case 'Literal':
      return node.value as string | number | boolean | null;

    case 'TemplateLiteral':
      // Only allow template literals without expressions (plain strings)
      if (node.expressions && node.expressions.length > 0) {
        warnings.push(
          `Line ${node.loc?.start.line}: Template literals with expressions are not supported`
        );
        return '';
      }
      return node.quasis[0]?.value.cooked || '';

    // ===== Object =====
    case 'ObjectExpression': {
      const obj: Record<string, DslValue> = {};
      
      for (const property of node.properties) {
        if (property.type === 'SpreadElement') {
          warnings.push(
            `Line ${property.loc?.start.line}: Spread syntax (...) is not fully supported`
          );
          continue;
        }

        // Get property key
        let key: string;
        if (property.key.type === 'Identifier') {
          key = property.key.name;
        } else if (property.key.type === 'Literal') {
          key = String(property.key.value);
        } else if (property.key.type === 'MemberExpression' || property.key.type === 'CallExpression') {
          // Computed property key like [theme.breakpoints.up('md')]
          const placeholder = transformNode(property.key, warnings);
          if (placeholder && typeof placeholder === 'object' && '__type' in placeholder) {
            if (placeholder.__type === 'breakpoint') {
              // Convert breakpoint placeholder to media query key
              const bp = placeholder as { breakpoint: string; direction: string };
              key = `@media-${bp.direction}-${bp.breakpoint}`;
            } else {
              warnings.push(
                `Line ${property.loc?.start.line}: Computed property keys must be breakpoint queries`
              );
              continue;
            }
          } else {
            warnings.push(
              `Line ${property.loc?.start.line}: Computed property keys must be static or breakpoint queries`
            );
            continue;
          }
        } else {
          warnings.push(
            `Line ${property.loc?.start.line}: Unsupported property key type: ${property.key.type}`
          );
          continue;
        }

        // Transform property value
        obj[key] = transformNode(property.value, warnings);
      }
      
      return obj;
    }

    // ===== Array =====
    case 'ArrayExpression':
      return node.elements.map((element: AnyNode) => {
        if (!element) return null;
        return transformNode(element, warnings);
      });

    // ===== Arrow Function =====
    case 'ArrowFunctionExpression': {
      // Check function signature: must be ({ theme }) => ... or (props) => ...
      const params: string[] = [];
      
      for (const param of node.params) {
        if (param.type === 'Identifier') {
          params.push(param.name);
        } else if (param.type === 'ObjectPattern') {
          // Destructured param like { theme }
          for (const property of param.properties) {
            if (property.type === 'Property' && property.key.type === 'Identifier') {
              params.push(property.key.name);
            }
          }
        } else {
          warnings.push(
            `Line ${param.loc?.start.line}: Unsupported function parameter type: ${param.type}`
          );
        }
      }

      // Transform function body
      let body: DslValue;
      if (node.body.type === 'BlockStatement') {
        warnings.push(
          `Line ${node.loc?.start.line}: Block statement functions are not supported, use arrow function with expression body`
        );
        body = {};
      } else {
        body = transformNode(node.body, warnings);
      }

      return {
        __type: 'function',
        params,
        body,
      } as DslPlaceholder;
    }

    // ===== Call Expression (theme.spacing(), theme.breakpoints.up(), helpers) =====
    case 'CallExpression': {
      const { callee } = node;

      // Case 1: theme.spacing(n)
      if (
        callee.type === 'MemberExpression' &&
        callee.object.type === 'Identifier' &&
        callee.object.name === 'theme' &&
        callee.property.type === 'Identifier' &&
        callee.property.name === 'spacing'
      ) {
        if (node.arguments.length !== 1 || node.arguments[0].type !== 'Literal') {
          warnings.push(
            `Line ${node.loc?.start.line}: theme.spacing() must have exactly one numeric literal argument`
          );
          return { __type: 'spacing', args: [1] } as DslPlaceholder;
        }
        return {
          __type: 'spacing',
          args: [node.arguments[0].value as number],
        } as DslPlaceholder;
      }

      // Case 2: theme.breakpoints.up('md')
      if (
        callee.type === 'MemberExpression' &&
        callee.object.type === 'MemberExpression' &&
        callee.object.object.type === 'Identifier' &&
        callee.object.object.name === 'theme' &&
        callee.object.property.type === 'Identifier' &&
        callee.object.property.name === 'breakpoints' &&
        callee.property.type === 'Identifier'
      ) {
        const direction = callee.property.name as 'up' | 'down' | 'only' | 'between';
        if (!['up', 'down', 'only', 'between'].includes(direction)) {
          warnings.push(
            `Line ${node.loc?.start.line}: Unknown breakpoint method: ${direction}`
          );
          return '';
        }

        if (node.arguments.length < 1 || node.arguments[0].type !== 'Literal') {
          warnings.push(
            `Line ${node.loc?.start.line}: theme.breakpoints.${direction}() requires breakpoint name`
          );
          return '';
        }

        const breakpoint = node.arguments[0].value as string;
        const endBreakpoint =
          node.arguments[1]?.type === 'Literal' ? (node.arguments[1].value as string) : undefined;

        return {
          __type: 'breakpoint',
          breakpoint,
          direction,
          endBreakpoint,
        } as DslPlaceholder;
      }

      // Case 3: MUI helper functions (alpha, lighten, darken, etc.)
      if (callee.type === 'Identifier') {
        const helperName = callee.name;
        const allowedHelpers = ['alpha', 'lighten', 'darken', 'emphasize', 'getContrastRatio'];
        
        if (allowedHelpers.includes(helperName)) {
          const args = node.arguments.map((arg: AnyNode) => transformNode(arg, warnings));
          return {
            __type: 'helper',
            name: helperName,
            args,
          } as DslPlaceholder;
        }

        warnings.push(
          `Line ${node.loc?.start.line}: Unknown function call: ${helperName}(). Only MUI helpers are allowed: ${allowedHelpers.join(', ')}`
        );
        return '';
      }

      warnings.push(
        `Line ${node.loc?.start.line}: Unsupported function call pattern`
      );
      return '';
    }

    // ===== Member Expression (theme.palette.primary.main) =====
    case 'MemberExpression': {
      // Build token path from member expression chain
      const path = buildTokenPath(node);
      
      if (path && path.startsWith('theme.')) {
        // Remove 'theme.' prefix
        const tokenPath = path.slice(6);
        return {
          __type: 'token',
          path: tokenPath,
        } as DslPlaceholder;
      }

      warnings.push(
        `Line ${node.loc?.start.line}: Unsupported member expression: ${path || 'unknown'}`
      );
      return '';
    }

    // ===== Unary Expression (e.g., -5) =====
    case 'UnaryExpression':
      if (node.operator === '-' || node.operator === '+') {
        const arg = transformNode(node.argument, warnings);
        if (typeof arg === 'number') {
          return node.operator === '-' ? -arg : arg;
        }
      }
      warnings.push(
        `Line ${node.loc?.start.line}: Unsupported unary operator: ${node.operator}`
      );
      return 0;

    // ===== Unsupported =====
    default:
      warnings.push(
        `Line ${node.loc?.start.line}: Unsupported syntax: ${node.type}`
      );
      return '';
  }
}

/**
 * Builds a dot-notation path from a MemberExpression AST node.
 * 
 * @example
 * theme.palette.primary.main → 'theme.palette.primary.main'
 */
function buildTokenPath(node: AnyNode): string | null {
  if (node.type === 'Identifier') {
    return node.name;
  }

  if (node.type === 'MemberExpression') {
    const objectPath = buildTokenPath(node.object);
    const propertyName =
      node.property.type === 'Identifier'
        ? node.property.name
        : node.property.type === 'Literal'
        ? String(node.property.value)
        : null;

    if (objectPath && propertyName) {
      return `${objectPath}.${propertyName}`;
    }
  }

  return null;
}
