import { useState, useCallback, useMemo } from "react";
import { useTemplateStore, type TemplateMetadata } from "./useTemplateStore";
import { useThemeDesignStore } from "../Design";
import { serializeThemeOptions } from "../Design/codeParser";

export type UseTemplateSelectionOptions = {
  autoConfirm?: boolean;
  defaultScheme?: "light" | "dark";
};

export type PendingChange = { templateId: string } | null;

export default function useTemplateSelection(options?: UseTemplateSelectionOptions) {
  const autoConfirm = options?.autoConfirm ?? false;
  const defaultScheme = options?.defaultScheme ?? "light";

  const { getAllTemplates, getTemplateById, templatesRegistry } = useTemplateStore();

  const templates = useMemo(() => getAllTemplates(), [getAllTemplates]);

  const selectedTemplateId = useThemeDesignStore(
    (s) => s.baseThemeMetadata?.sourceTemplateId
  );

  const hasUnsavedChanges = useThemeDesignStore((s) => s.hasUnsavedChanges);
  const loadNew = useThemeDesignStore((s) => s.loadNew);

  const [pendingChange, setPendingChange] = useState<PendingChange>(null);
  const [shouldKeepUnsavedChanges, setShouldKeepUnsavedChanges] = useState<
    boolean | null
  >(hasUnsavedChanges ? null : true);

  const clearPending = useCallback(() => {
    setPendingChange(null);
    setShouldKeepUnsavedChanges(hasUnsavedChanges ? null : true);
  }, [hasUnsavedChanges]);

  const discardAndApply = useCallback(
    (templateId: string) => {
      const template = getTemplateById(templateId);
      if (!template) return;

      const themeCode = serializeThemeOptions(template.themeOptions);
      loadNew(themeCode, { sourceTemplateId: templateId, title: template.label });

      // clear pending state
      setPendingChange(null);
      setShouldKeepUnsavedChanges(false);
    },
    [getTemplateById, loadNew]
  );

  const applyKeepingUnsaved = useCallback(() => {
    // Default: keep current base theme and simply clear pending state.
    setPendingChange(null);
    setShouldKeepUnsavedChanges(true);
  }, []);

  const selectTemplate = useCallback(
    (templateId: string, opts?: { keepUnsavedChanges?: boolean }) => {
      if (autoConfirm) {
        discardAndApply(templateId);
        return;
      }

      // If caller explicitly provided keep/discard preference, honor it
      if (typeof opts?.keepUnsavedChanges === "boolean") {
        if (opts.keepUnsavedChanges) {
          applyKeepingUnsaved();
        } else {
          discardAndApply(templateId);
        }
        return;
      }

      // If there are unsaved changes, request confirmation
      if (hasUnsavedChanges) {
        setPendingChange({ templateId });
        setShouldKeepUnsavedChanges(null);
        return;
      }

      // No unsaved changes — apply immediately
      discardAndApply(templateId);
    },
    [autoConfirm, hasUnsavedChanges, discardAndApply, applyKeepingUnsaved]
  );

  const confirmSwitch = useCallback(
    (keepUnsavedChanges: boolean) => {
      const pending = pendingChange;
      if (!pending) return;

      if (keepUnsavedChanges) {
        applyKeepingUnsaved();
      } else {
        discardAndApply(pending.templateId);
      }
    },
    [pendingChange, applyKeepingUnsaved, discardAndApply]
  );

  const selectRandomTemplate = useCallback(() => {
    const all = templates;
    if (!all || all.length === 0) return;

    let candidates = all.map((t) => t.id);
    if (candidates.length > 1) {
      candidates = candidates.filter((id) => id !== selectedTemplateId);
    }

    const idx = Math.floor(Math.random() * candidates.length);
    const chosen = candidates[idx];
    if (chosen) selectTemplate(chosen);
  }, [templates, selectedTemplateId, selectTemplate]);

  function getColorSamples(templateOrId: TemplateMetadata | string): string[] {
    const template: TemplateMetadata | undefined = typeof templateOrId === "string"
      ? getTemplateById(templateOrId)
      : templateOrId;

    if (!template) return ["#1976d2", "#dc004e", "#ff9800"];

    const themeOptions = template.themeOptions as any;
    const colors: string[] = [];

    if (
      themeOptions?.colorSchemes &&
      typeof themeOptions.colorSchemes === "object" &&
      themeOptions.colorSchemes[defaultScheme] &&
      typeof themeOptions.colorSchemes[defaultScheme] === "object" &&
      themeOptions.colorSchemes[defaultScheme].palette
    ) {
      const palette = themeOptions.colorSchemes[defaultScheme].palette as Record<
        string,
        unknown
      >;

      const colorKeys = ["primary", "secondary", "error", "warning", "info"] as const;
      for (const key of colorKeys) {
        const color = palette[key];
        if (color && typeof color === "object" && "main" in color) {
          colors.push((color as any).main as string);
          if (colors.length >= 6) break;
        }
      }
    }

    // Fallback to old palette format
    if (colors.length < 3 && themeOptions?.palette) {
      const palette = themeOptions.palette as Record<string, unknown>;
      const colorKeys = ["primary", "secondary", "error"] as const;
      for (const key of colorKeys) {
        const color = palette[key];
        if (color && typeof color === "object" && "main" in color) {
          colors.push((color as any).main as string);
          if (colors.length >= 6) break;
        }
      }
    }

    if (colors.length === 0) {
      colors.push("#1976d2", "#dc004e", "#ff9800");
    }

    return colors.slice(0, 6);
  }

  return {
    templates,
    getTemplateById,
    templatesRegistry,
    selectedTemplateId,
    hasUnsavedChanges,
    pendingChange,
    shouldKeepUnsavedChanges,
    selectTemplate,
    confirmSwitch,
    discardAndApply,
    applyKeepingUnsaved,
    selectRandomTemplate,
    getColorSamples,
    clearPending,
  };
}

export type { TemplateMetadata };
