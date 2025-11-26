import { useState, useCallback, useMemo } from "react";
import { useTemplateStore, type TemplateMetadata } from "./useTemplateStore";
import { serializeThemeOptions } from "../compiler";
import useHasUnsavedChanges from "../Current/useHasUnsavedChanges";
import useDesignStore from "../Current/currentStore";

export type UseTemplateSelectionOptions = {
  autoConfirm?: boolean;
  defaultScheme?: "light" | "dark";
};

export type PendingChange = { templateId: string } | null;

const BLANK_PENDING_ID = "__blank__";

export default function useTemplateSelection(options?: UseTemplateSelectionOptions) {
  const autoConfirm = options?.autoConfirm ?? false;
  const defaultScheme = options?.defaultScheme ?? "light";
  const { getAllTemplates, getTemplateById, templatesRegistry } = useTemplateStore();

  const templates = useMemo(() => getAllTemplates(), [getAllTemplates]);
  const selectedTemplateId = useDesignStore(
    (s) => s.baseThemeMetadata?.sourceTemplateId
  );

  const hasUnsavedChanges = useHasUnsavedChanges();
  const loadNew = useDesignStore((s) => s.loadNew);

  const [pendingChange, setPendingChange] = useState<PendingChange>(null);
  const [shouldKeepUnsavedChanges, setShouldKeepUnsavedChanges] = useState(
    hasUnsavedChanges ? null : true
  );

  const clearPending = useCallback(() => {
    setPendingChange(null);
    setShouldKeepUnsavedChanges(hasUnsavedChanges ? null : true);
  }, [hasUnsavedChanges]);

  const discardAndApply = useCallback(
    (templateId: string) => {
      const template = getTemplateById(templateId);

      if (!template) {
        return;
      }

      const themeCode = serializeThemeOptions(template.themeOptions);
      loadNew(themeCode, { sourceTemplateId: templateId, title: template.label });
      setPendingChange(null);
      setShouldKeepUnsavedChanges(false);
    },
    [getTemplateById, loadNew]
  );

  const applyBlank = useCallback(() => {
    loadNew("{}", { sourceTemplateId: "", title: "Untitled Design" });
    setPendingChange(null);
    setShouldKeepUnsavedChanges(false);
  }, [loadNew]);

  const applyKeepingUnsaved = useCallback(() => {
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

      // special-case the blank selection
      if (pending.templateId === BLANK_PENDING_ID) {
        if (keepUnsavedChanges) {
          applyKeepingUnsaved();
        } else {
          applyBlank();
        }
        return;
      }

      if (keepUnsavedChanges) {
        applyKeepingUnsaved();
      } else {
        discardAndApply(pending.templateId);
      }
    },
    [pendingChange, applyKeepingUnsaved, discardAndApply, applyBlank]
  );

  const selectRandomTemplate = useCallback(() => {
    const all = templates;
    if (!all || all.length === 0) return;

    let candidates = all.map((t: TemplateMetadata) => t.id);
    if (candidates.length > 1) {
      candidates = candidates.filter((id: string) => id !== selectedTemplateId);
    }

    const idx = Math.floor(Math.random() * candidates.length);
    const chosen = candidates[idx];
    if (chosen) selectTemplate(chosen);
  }, [templates, selectedTemplateId, selectTemplate]);

  const selectBlank = useCallback(() => {
    if (hasUnsavedChanges) {
      setPendingChange({ templateId: BLANK_PENDING_ID });
      setShouldKeepUnsavedChanges(null);
      return;
    }

    applyBlank();
  }, [hasUnsavedChanges, applyBlank]);

  function getColorSamples(templateOrId: TemplateMetadata | string): string[] {
    const template =
      typeof templateOrId === "string"
        ? getTemplateById(templateOrId)
        : templateOrId;

    if (!template) {
      return ["#1976d2", "#dc004e", "#ff9800"];
    }

    const themeOptions = template.themeOptions as any;
    const colors: string[] = [];
    const colorKeys = ["primary", "secondary", "error", "warning", "info"] as const;

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
    selectBlank,
    confirmSwitch,
    discardAndApply,
    applyKeepingUnsaved,
    selectRandomTemplate,
    getColorSamples,
    clearPending,
  };
}

export type { TemplateMetadata };
