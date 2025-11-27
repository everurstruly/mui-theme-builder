import { useMemo } from "react";
import { useEdit } from "./useEdit";
import {
  getNestedValue,
  parseThemeCode,
  deepMerge,
  type SerializableValue,
} from "../compiler";

export default function useDesignerToolEdit(path: string, scheme?: string | null) {
  // Determine if this usage intends scheme-specific edits. Caller must provide `scheme`.
  const isSchemeSpecific = scheme != null;

  // Narrow selectors — subscribe only to the minimal pieces needed
  const codeValue = useEdit((s) => s.codeOverridesFlattened[path]);
  const globalEdit = useEdit((s) => s.colorSchemeIndependentVisualToolEdits[path]);
  const schemeEdit = useEdit((s) =>
    isSchemeSpecific ? s.colorSchemes[scheme as string]?.visualToolEdits[path] : undefined
  );
  const previewValue = useEdit((s) => s.previews?.[path]);
  const baseThemeCode = useEdit((s) => s.baseThemeCode);

  // Compose the authoritative 'value' (code overrides take precedence)
  const editValue = isSchemeSpecific ? schemeEdit : globalEdit;
  const value = codeValue ?? editValue;

  // Determine whether a visual edit or code override exists
  const hasVisualEdit = typeof editValue === "string" || !!editValue;
  const hasCodeOverride = !!codeValue;

  // Compute a resolved value for display when no edits exist. This avoids
  // subscribing to the entire created theme by parsing only the base theme
  // code and extracting the single `path` we care about. Parse results are
  // memoized by `baseThemeCode` to avoid repeated parsing.
  const parsedCache = getParseCache();
  const parsed = parsedCache.get(baseThemeCode) ?? parseThemeCode(baseThemeCode);
  if (!parsedCache.has(baseThemeCode)) parsedCache.set(baseThemeCode, parsed);

  // If the base template uses `colorSchemes`, merge base + scheme branch.
  let templateForScheme: any = parsed || {};
  if (
    templateForScheme &&
    typeof templateForScheme === "object" &&
    templateForScheme.colorSchemes &&
    (scheme as string) in templateForScheme.colorSchemes
  ) {
    const base = { ...(templateForScheme as Record<string, any>) };
    delete base.colorSchemes;
    const schemeOpts = (templateForScheme.colorSchemes as Record<string, any>)[scheme as string];
    if (schemeOpts) {
      templateForScheme = deepMerge(base as Record<string, any>, schemeOpts);
    }
  }

  const autoResolvedValue = ((): SerializableValue => {
    // Precedence: previews -> code overrides -> visual edits -> template
    if (previewValue !== undefined) return previewValue as SerializableValue;
    if (codeValue !== undefined) return codeValue as SerializableValue;
    if (editValue !== undefined) return editValue as SerializableValue;
    try {
      return getNestedValue(templateForScheme, path) as SerializableValue;
    } catch {
      return undefined;
    }
  })();

  const canReset = hasVisualEdit || hasCodeOverride;

  // Get the appropriate actions (stable function identities from store)
  const addGlobalEdit = useEdit((s) => s.addGlobalVisualEdit);
  const addSchemeEdit = useEdit((s) => s.addSchemeVisualEdit);
  const removeGlobalEdit = useEdit((s) => s.removeGlobalVisualEdit);
  const removeSchemeEdit = useEdit((s) => s.removeSchemeVisualEdit);

  return useMemo(
    () => ({
      value,
      resolvedValue: autoResolvedValue,
      hasCodeOverride,
      hasVisualEdit,
      canReset,
      isModified: hasCodeOverride || hasVisualEdit,
      setValue: (v: SerializableValue) =>
        isSchemeSpecific ? addSchemeEdit(scheme as string, path, v) : addGlobalEdit(path, v),
      reset: () => (isSchemeSpecific ? removeSchemeEdit(scheme as string, path) : removeGlobalEdit(path)),
    }),
    [
      value,
      scheme,
      autoResolvedValue,
      hasCodeOverride,
      hasVisualEdit,
      canReset,
      isSchemeSpecific,
      addGlobalEdit,
      addSchemeEdit,
      removeGlobalEdit,
      removeSchemeEdit,
      path,
    ]
  );
}

// Simple parse cache for base theme parsing to avoid repeated work.
const parseCache = new Map<string, any>();
function getParseCache() {
  return parseCache;
}
