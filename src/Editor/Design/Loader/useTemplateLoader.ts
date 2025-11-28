import { useState, useCallback, useMemo } from "react";
import { useTemplates, type TemplateMetadata } from "./useTemplates";
import { serializeThemeOptions } from "../compiler";
import useHasStoredAllModifications from "../Edit/useHasStoredAllModifications";
import useEdit from "../Edit/useEdit";

export type UseTemplateSelectionOptions = {
  autoConfirm?: boolean;
  defaultScheme?: "light" | "dark";
};

// Unified type for what we are trying to load
type TargetTemplate = 
  | { type: "premade"; id: string; template: TemplateMetadata }
  | { type: "blank" };

export default function useTemplateLoader(options?: UseTemplateSelectionOptions) {
  const { getAllTemplates, getTemplateById, templatesRegistry } = useTemplates();
  const hasStoredAllModifications = useHasStoredAllModifications();
  const loadNew = useEdit((s) => s.loadNew);

  const autoConfirm = options?.autoConfirm ?? false;
  const defaultScheme = options?.defaultScheme ?? "light";
  const templates = useMemo(() => getAllTemplates(), [getAllTemplates]);

  // 1. STATE: We only track the target we are waiting to load.
  const [pendingTarget, setPendingTarget] = useState<TargetTemplate | null>(null);

  // 2. HELPER: The actual loading logic (pure mechanism, no checks)
  const executeLoad = useCallback((target: TargetTemplate) => {
    if (target.type === "blank") {
      loadNew("{}", { sourceTemplateId: "", title: "Untitled Design" });
    } else {
      const themeCode = serializeThemeOptions(target.template.themeOptions);
      loadNew(themeCode, { 
        sourceTemplateId: target.id, 
        title: target.template.label 
      });
    }
    setPendingTarget(null);
  }, [loadNew]);

  // 3. ACTION: The public entry point. Decides if we load immediately or wait.
  const requestLoad = useCallback((target: TargetTemplate) => {
    // If auto-confirm is on OR we have no unsaved changes, load immediately
    if (autoConfirm || hasStoredAllModifications) {
      executeLoad(target);
      return;
    }
    
    // Otherwise, set state to trigger the UI confirmation modal
    setPendingTarget(target);
  }, [autoConfirm, hasStoredAllModifications, executeLoad]);

  // --- Public Methods ---

  const selectTemplate = useCallback((templateId: string) => {
    const template = getTemplateById(templateId);
    if (!template) return;
    requestLoad({ type: "premade", id: templateId, template });
  }, [getTemplateById, requestLoad]);

  const selectBlank = useCallback(() => {
    requestLoad({ type: "blank" });
  }, [requestLoad]);

  const selectRandomTemplate = useCallback(() => {
    if (!templates || templates.length === 0) return;
    // Simple random pick. 
    // Note: If you need to filter out the *current* ID, you need to pass currentId into this hook.
    const idx = Math.floor(Math.random() * templates.length);
    const chosen = templates[idx];
    if (chosen) selectTemplate(chosen.id);
  }, [templates, selectTemplate]);

  // Called by the UI Modal "Yes, discard changes"
  const confirmSwitch = useCallback(() => {
    if (pendingTarget) {
      executeLoad(pendingTarget);
    }
  }, [pendingTarget, executeLoad]);

  // Called by the UI Modal "No, keep editing"
  const cancelSwitch = useCallback(() => {
    setPendingTarget(null);
  }, []);

  return {
    templates,
    templatesRegistry,
    hasUnsavedModifications: !hasStoredAllModifications,
    // The UI should show the modal if this is not null
    pendingTemplate: pendingTarget, 
    selectTemplate,
    selectBlank,
    selectRandomTemplate,
    confirmSwitch,
    cancelSwitch,
    // Helper exposed for UI, but logic moved outside
    getColorSamples: (t: TemplateMetadata | string) => 
      extractColorSamples(t, getTemplateById, defaultScheme),
  };
}

// --- Extracted Utilities ---

function extractColorSamples(
  templateOrId: TemplateMetadata | string, 
  getTemplateById: (id: string) => TemplateMetadata | undefined,
  scheme: "light" | "dark"
): string[] {
  const template = typeof templateOrId === "string" 
    ? getTemplateById(templateOrId) 
    : templateOrId;

  if (!template) return ["#1976d2", "#dc004e", "#ff9800"];

  const opts = template.themeOptions as any;
  const colors: string[] = [];
  
  // Helper to safely grab a color
  const pushColor = (palette: any, key: string) => {
    if (palette?.[key]?.main) colors.push(palette[key].main);
  };

  // 1. Try modern color schemes
  if (opts?.colorSchemes?.[scheme]?.palette) {
    const p = opts.colorSchemes[scheme].palette;
    ["primary", "secondary", "error", "warning", "info"].forEach(k => pushColor(p, k));
  }

  // 2. Fallback to legacy palette
  if (colors.length < 3 && opts?.palette) {
    ["primary", "secondary", "error"].forEach(k => pushColor(opts.palette, k));
  }

  // 3. Defaults
  if (colors.length === 0) {
    return ["#1976d2", "#dc004e", "#ff9800"];
  }

  return colors.slice(0, 6);
}

export type { TemplateMetadata };