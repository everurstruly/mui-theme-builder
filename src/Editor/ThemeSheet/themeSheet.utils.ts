import type { ThemeOptions } from '@mui/material/styles';
import type { SerializableValue, FlatThemeOptions, ThemeResolutionMode } from './types';

// =================================================================
// Object Helpers
// =================================================================

export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return undefined;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return result;
}

export function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const keys = path.split('.');
  const lastKey = keys.pop();

  if (!lastKey) return;

  let current: Record<string, unknown> = obj;

  for (const key of keys) {
    const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
    
    if (arrayMatch) {
      const [, arrayKey, index] = arrayMatch;
      const idx = parseInt(index, 10);
      
      if (!current[arrayKey]) {
        current[arrayKey] = [];
      }
      
      const arr = current[arrayKey] as unknown[];
      if (!arr[idx] || typeof arr[idx] !== 'object') {
        arr[idx] = {};
      }
      current = arr[idx] as Record<string, unknown>;
    } else {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }
  }

  const lastArrayMatch = lastKey.match(/^(.+)\[(\d+)\]$/);
  if (lastArrayMatch) {
    const [, arrayKey, index] = lastArrayMatch;
    const idx = parseInt(index, 10);
    
    if (!current[arrayKey]) {
      current[arrayKey] = [];
    }
    
    (current[arrayKey] as unknown[])[idx] = value;
  } else {
    current[lastKey] = value;
  }
}

// =================================================================
// Flat/Nested Conversion
// =================================================================

export function flattenThemeOptions(
  obj: unknown,
  prefix = ''
): Record<string, SerializableValue> {
  const result: Record<string, SerializableValue> = {};

  const traverse = (value: unknown, path: string) => {
    if (value == null) {
      if (path) result[path] = null;
      return;
    }
    if (typeof value === 'function') {
      return;
    }
    if (Array.isArray(value)) {
      const hasComplexItems = value.some(
        (item) => typeof item === 'object' && item !== null && !Array.isArray(item)
      );
      if (!hasComplexItems) {
        result[path] = value as SerializableValue;
      } else {
        value.forEach((item, i) => traverse(item, `${path}[${i}]`));
      }
      return;
    }
    if (typeof value !== 'object') {
      if (path) result[path] = value as SerializableValue;
      return;
    }
    const entries = Object.entries(value);
    if (entries.length === 0) {
      if (path) result[path] = {} as SerializableValue;
      return;
    }
    entries.forEach(([key, val]) => {
      traverse(val, path ? `${path}.${key}` : key);
    });
  };

  traverse(obj, prefix);
  return result;
}

export function expandFlatThemeOptions(
  flat: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  Object.entries(flat).forEach(([path, value]) => {
    const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1');
    setNestedValue(result, normalizedPath, value);
  });

  return result;
}

export function splitThemeOptions(
  themeOptions: Record<string, unknown>
): FlatThemeOptions {
  const literals: Record<string, SerializableValue> = {};
  const functions: Record<string, string> = {};

  const traverse = (obj: unknown, path = '') => {
    if (obj == null) {
      if (path) literals[path] = null;
      return;
    }
    if (typeof obj === 'function') {
      if (path) {
        functions[path] = obj.toString();
      }
      return;
    }
    if (Array.isArray(obj)) {
      const hasComplexItems = obj.some(
        (item) => typeof item === 'object' && item !== null && !Array.isArray(item)
      );
      if (!hasComplexItems) {
        if (path) literals[path] = obj as SerializableValue;
      } else {
        obj.forEach((item, i) => traverse(item, `${path}[${i}]`));
      }
      return;
    }
    if (typeof obj !== 'object') {
      if (path) literals[path] = obj as SerializableValue;
      return;
    }
    const entries = Object.entries(obj);
    if (entries.length === 0) {
      if (path) literals[path] = {} as SerializableValue;
      return;
    }
    entries.forEach(([key, value]) => {
      traverse(value, path ? `${path}.${key}` : key);
    });
  };

  traverse(themeOptions);

  return { literals, functions };
}

// =================================================================
// Function Hydration
// =================================================================

export function hydrateFunctions(
  functionPaths: Record<string, string>,
  mode: ThemeResolutionMode,
  currentTheme: ThemeOptions
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  Object.entries(functionPaths).forEach(([path, fnBody]) => {
    try {
      const fn = new Function('theme', `return (${fnBody})(theme);`);
      result[path] = fn(currentTheme);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      if (mode === 'strict') {
        throw new Error(
          `Failed to hydrate function at path "${path}": ${errorMsg}\nFunction body: ${fnBody}`
        );
      }
      
      console.error(
        `[ThemeSheet] Failed to hydrate function at "${path}":`,
        errorMsg,
        '\nFunction body:',
        fnBody
      );
      
      result[path] = undefined;
    }
  });

  return result;
}

