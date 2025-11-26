import type { ThemeOptions } from "@mui/material";
import { transformCodeToDsl } from "../transformation/codeToDsl";
import { transformDslToThemeOptions } from "../transformation/dslToTheme";
import type { ThemeDsl, DslResolutionContext } from "../types";

/**
 * Parses theme code string (JavaScript/DSL JSON) into executable ThemeOptions.
 * 
 * This is the main entry point for converting stored code strings into
 * runtime ThemeOptions. It handles:
 * 1. JSON strings (DSL format) → DSL object → ThemeOptions (fastest path)
 * 2. JavaScript object literals → DSL → ThemeOptions (fallback)
 * 3. Pre-parsed DSL objects → ThemeOptions (direct)
 * 
 * @param codeOrDsl - JSON string, JavaScript code, or DSL object
 * @param context - Optional resolution context (for placeholders like spacing, tokens)
 * @returns ThemeOptions or null if parsing fails
 * 
 * @example
 * // Parse from JSON string (stored format)
 * const theme = parseThemeCode('{"palette":{"primary":{"main":"#1976d2"}}}');
 * 
 * // Parse from JavaScript code
 * const theme = parseThemeCode(`{
 *   palette: { primary: { main: '#1976d2' } }
 * }`);
 * 
 * // Parse from DSL object
 * const dsl = { palette: { primary: { main: '#1976d2' } } };
 * const theme = parseThemeCode(dsl);
 */
export function parseThemeCode(
  codeOrDsl: string | ThemeDsl,
  context?: Partial<DslResolutionContext>
): ThemeOptions | null {
  try {
    let dsl: ThemeDsl;

    if (typeof codeOrDsl === "string") {
      // Try JSON.parse first (fastest for stored DSL)
      try {
        dsl = JSON.parse(codeOrDsl) as ThemeDsl;
      } catch {
        // Fallback: parse as JavaScript object literal
        const result = transformCodeToDsl(codeOrDsl);
        if (result.error) {
          console.error("Code transform failed:", result.error);
          if (result.warnings.length > 0) {
            console.warn("Transform warnings:", result.warnings);
          }
          return null;
        }
        dsl = result.dsl;
      }
    } else {
      // Already a DSL object
      dsl = codeOrDsl;
    }

    // Validate DSL structure
    if (!dsl || typeof dsl !== "object") {
      console.error("Invalid DSL structure");
      return null;
    }

    // Empty DSL is valid (represents empty ThemeOptions)
    if (Object.keys(dsl).length === 0) {
      return {};
    }

    // Build default resolution context
    const defaultContext: DslResolutionContext = {
      template: {},
      colorScheme: "light",
      spacingFactor: 8,
      ...context,
    };

    // Transform DSL to executable ThemeOptions
    const themeOptions = transformDslToThemeOptions(dsl, defaultContext);
    return themeOptions;
  } catch (error) {
    console.error("Failed to parse theme code:", error);
    return null;
  }
}

/**
 * Serializes ThemeOptions to DSL JSON string (for storage).
 * 
 * This is the inverse of parseThemeCode. It converts ThemeOptions
 * into a storable JSON string representation.
 * 
 * @param themeOptions - ThemeOptions to serialize
 * @returns JSON string of DSL
 * 
 * @example
 * const themeOptions = { palette: { primary: { main: '#1976d2' } } };
 * const jsonString = serializeThemeOptions(themeOptions);
 * // Store jsonString in localStorage or backend
 */
export function serializeThemeOptions(themeOptions: ThemeOptions): string {
  // For now, we store ThemeOptions directly as DSL (they're compatible for simple cases)
  // Future enhancement: detect functions and convert them to placeholders
  try {
    return JSON.stringify(themeOptions as unknown as ThemeDsl);
  } catch (error) {
    console.error("Failed to serialize ThemeOptions:", error);
    return "{}";
  }
}

/**
 * Validates code string without full parsing.
 * Quick check before attempting full parse.
 * 
 * @param code - Code string to validate
 * @returns True if code is likely valid
 * 
 * @example
 * if (isValidThemeCode(userInput)) {
 *   const theme = parseThemeCode(userInput);
 * }
 */
export function isValidThemeCode(code: string): boolean {
  if (!code || !code.trim()) return true; // Empty is valid
  
  try {
    // Try JSON parse first
    JSON.parse(code);
    return true;
  } catch {
    // Try DSL transform
    try {
      const result = transformCodeToDsl(code);
      return !result.error;
    } catch {
      return false;
    }
  }
}
