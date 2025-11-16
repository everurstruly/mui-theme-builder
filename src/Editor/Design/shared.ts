import type { ThemeOptions } from "@mui/material/styles";
import type { SerializableValue } from "./designStore";
import type { CodeEvaluationResult } from "./domainSpecificLanguage/dslValidator";

/**
 * Paths that are color-scheme-specific (light vs dark mode).
 * All other paths are considered global.
 */
const COLOR_SCHEME_PATHS = ["palette", "shadows"];

/**
 * Determines if a given path should be scoped to a specific color scheme.
 *
 * @param path - Dot-notation path (e.g., 'palette.primary.main')
 * @returns true if path is color-scheme-specific
 *
 * @example
 * isColorSchemePath('palette.primary.main') // true
 * isColorSchemePath('typography.fontSize') // false
 * isColorSchemePath('shadows.1') // true
 * isColorSchemePath('shape.borderRadius') // false
 */
export function isColorSchemePath(path: string): boolean {
  return COLOR_SCHEME_PATHS.some((prefix) => path.startsWith(prefix));
}

/**
 * Flattens a nested ThemeOptions object into dot-notation paths.
 *
 * @param obj - Nested ThemeOptions object
 * @param prefix - Internal: current path prefix during recursion
 * @returns Flat record with dot-notation keys
 *
 * @example
 * flattenThemeOptions({
 *   palette: { primary: { main: '#1976d2' } },
 *   spacing: 8
 * })
 * // Returns: { 'palette.primary.main': '#1976d2', 'spacing': 8 }
 */
export function flattenThemeOptions(
  obj: Record<string, unknown>,
  prefix: string = ""
): Record<string, SerializableValue> {
  const result: Record<string, SerializableValue> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined) {
      result[fullPath] = null;
    } else if (typeof value === "function") {
      // Skip functions during flattening (they're handled separately)
      continue;
    } else if (Array.isArray(value)) {
      result[fullPath] = value as SerializableValue;
    } else if (typeof value === "object" && Object.keys(value).length > 0) {
      // Recursively flatten nested objects
      Object.assign(
        result,
        flattenThemeOptions(value as Record<string, unknown>, fullPath)
      );
    } else {
      result[fullPath] = value as SerializableValue;
    }
  }

  return result;
}

/**
 * Expands a flat dot-notation record back into a nested object.
 *
 * @param flat - Flat record with dot-notation keys
 * @returns Nested object structure
 *
 * @example
 * expandFlatThemeOptions({
 *   'palette.primary.main': '#1976d2',
 *   'spacing': 8
 * })
 * // Returns: { palette: { primary: { main: '#1976d2' } }, spacing: 8 }
 */
export function expandFlatThemeOptions(
  flat: Record<string, SerializableValue>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [path, value] of Object.entries(flat)) {
    setNestedValue(result, path, value);
  }

  return result;
}

/**
 * Sets a value at a nested path in an object.
 * Creates intermediate objects as needed.
 *
 * @param obj - Target object (mutated in place)
 * @param path - Dot-notation path
 * @param value - Value to set
 *
 * @example
 * const obj = {};
 * setNestedValue(obj, 'palette.primary.main', '#ff0000');
 * // obj is now: { palette: { primary: { main: '#ff0000' } } }
 */
export function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  let current: Record<string, unknown> = obj;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[lastKey] = value;
}

/**
 * Gets a value at a nested path in an object.
 *
 * @param obj - Source object
 * @param path - Dot-notation path
 * @returns Value at path, or undefined if not found
 *
 * @example
 * const obj = { palette: { primary: { main: '#1976d2' } } };
 * getNestedValue(obj, 'palette.primary.main') // '#1976d2'
 * getNestedValue(obj, 'palette.secondary.main') // undefined
 */
export function getNestedValue(obj: Record<string, any>, path: string) {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current == null || typeof current !== "object") {
      return undefined;
    }
    current = current[key];
  }

  return current as any;
}

/**
 * Safely evaluates JavaScript/TypeScript code from Monaco editor.
 * Returns evaluated ThemeOptions and flattened version for lookups.
 *
 * @param source - Raw JavaScript/TypeScript source code
 * @returns Evaluation result with evaluated object, flattened paths, and error
 *
 * @example
 * evaluateCodeOverrides(`{
 *   palette: {
 *     primary: { main: '#ff0000' }
 *   }
 * }`)
 * // Returns: { evaluated: {...}, flattened: {'palette.primary.main': '#ff0000'}, error: null }
 */
export function evaluateCodeOverrides(source: string): CodeEvaluationResult {
  // Empty source is valid (no overrides)
  if (!source.trim()) {
    return {
      evaluated: {},
      flattened: {},
      error: null,
    };
  }

  try {
    // If the source contains a full file-like wrapper (e.g. "const theme: ThemeOptions = {...};")
    // extract the inner object so evaluation works. This lets the editor store the full
    // content (with header/footer) while evaluation still receives an object literal.
    const objectMatch = /const\s+theme(?:\s*:\s*[^=]+)?\s*=\s*\{([\s\S]*?)\};/m.exec(
      source
    );
    const evalSource = objectMatch ? `{${objectMatch[1]}}` : source;

    // Wrap source in parentheses to support object literals
    // Use Function constructor for safer eval (no access to closure scope)
    const wrappedSource = `(${evalSource})`;
    const evaluator = new Function(`return ${wrappedSource}`);
    const evaluated = evaluator() as ThemeOptions;

    // Validate result is an object
    if (typeof evaluated !== "object" || evaluated === null) {
      return {
        evaluated: {},
        flattened: {},
        error: "Code must evaluate to an object",
      };
    }

    // Flatten for quick path lookups (skip functions)
    const flattened = flattenThemeOptions(evaluated as Record<string, unknown>);

    // Validate color formats in flattened values to avoid runtime crashes
    // from MUI color utilities which expect specific formats.
    // Conservative predicate: only treat a path as a color candidate when it
    // appears to reference palette entries or contains "color". Explicitly
    // skip the well-known `palette.mode` property which is not a color but
    // a mode string ('light'|'dark').
    const colorKeyPredicate = (path: string) => {
      if (path.endsWith(".mode")) return false; // skip palette.mode
      return path.startsWith("palette") || path.toLowerCase().includes("color");
    };

    const isValidMuiColor = (val: unknown) => {
      if (typeof val !== "string") return true;
      const s = val.trim();
      // Hex: #rgb or #rrggbb
      if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s)) return true;
      // rgb() / rgba()
      if (/^rgba?\s*\(/i.test(s)) return true;
      // hsl() / hsla()
      if (/^hsla?\s*\(/i.test(s)) return true;
      // color() function
      if (/^color\s*\(/i.test(s)) return true;
      return false;
    };

    for (const [path, value] of Object.entries(flattened)) {
      if (
        colorKeyPredicate(path) &&
        typeof value === "string" &&
        !isValidMuiColor(value)
      ) {
        return {
          evaluated: {},
          flattened: {},
          error: `Evaluation failed: Unsupported color '${value}' at path '${path}'.\nThe following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().`,
        };
      }
    }

    return {
      evaluated,
      flattened,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      evaluated: {},
      flattened: {},
      error: `Evaluation failed: ${errorMessage}`,
    };
  }
}

/**
 * Deep merge multiple objects into one.
 * Later objects override earlier ones.
 *
 * @param objects - Objects to merge (in order of priority)
 * @returns Merged object
 */
export function deepMerge(
  ...objects: Record<string, unknown>[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const obj of objects) {
    if (!obj) continue;

    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) continue;

      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        result[key] &&
        typeof result[key] === "object" &&
        !Array.isArray(result[key])
      ) {
        result[key] = deepMerge(
          result[key] as Record<string, unknown>,
          value as Record<string, unknown>
        );
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}
