import useEdit from "../../Edit/useEdit";
import useHasStoredAllModifications from "../../Edit/useHasStoredAllModifications";
import { useState, useCallback, useMemo } from "react";
import { serializeThemeOptions } from "../../compiler";

import templatesRegistry, {
  type TemplateMetadata,
  getTemplateById,
} from "../../../Templates/registry";

export type UseTemplateSelectionOptions = {
  autoConfirm?: boolean;
  defaultScheme?: "light" | "dark";
  // Optional onClose callback used by loader UI helpers
  onClose?: () => void;
};

/**
 * Backwards-compatible shape kept for callers: { templateId }
 * Internally we treat blank as a special id: BLANK_PENDING_ID
 */
export type TemplateSwitchIntent = { templateId: string } | null;

const BLANK_PENDING_ID = "__blank__";

export default function useTemplateMethod(options?: UseTemplateSelectionOptions) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const autoConfirm = options?.autoConfirm ?? false;
  const defaultScheme = options?.defaultScheme ?? "light";
  const onClose = options?.onClose;

  const templates = useMemo(() => getAllTemplates(), []);

  const hasStoredAllModifications = useHasStoredAllModifications();
  const hasUnsavedModifications = !hasStoredAllModifications;

  // side-effects inlined here so this hook is self-contained
  const loadNew = useEdit((s) => s.loadNew);

  const loadTemplateDesign = useCallback(
    (templateId: string) => {
      const template = getTemplateById(templateId);
      if (!template) return;

      const themeCode = serializeThemeOptions(template.themeOptions);
      loadNew(themeCode, { sourceTemplateId: templateId, title: template.label });
    },
    [loadNew]
  );

  const loadBlankDesign = useCallback(() => {
    // Let the store supply its own default baseline when no theme is provided.
    loadNew();
  }, [loadNew]);

  // `templateSwitchIntent` represents the user's intent to switch templates
  // and is set when a template switch requires confirmation.
  const [templateSwitchIntent, setTemplateSwitchIntent] =
    useState<TemplateSwitchIntent>(null);
  const [confirmationDecision, setConfirmationDecision] = useState<boolean | null>(
    hasUnsavedModifications ? null : true
  );

  // Clear pending selection and restore derived "shouldKeep" default.
  const clearPending = useCallback(() => {
    setTemplateSwitchIntent(null);
    setConfirmationDecision(hasUnsavedModifications ? null : true);
  }, [hasUnsavedModifications]);

  // Dialog helpers will be defined after confirmPendingSelection so they can
  // safely reference the confirmation callback.

  // Apply a template immediately, discarding any unsaved modifications.
  const applyTemplateNow = useCallback(
    (templateId: string) => {
      loadTemplateDesign(templateId);
      // reset pending state
      setTemplateSwitchIntent(null);
      setConfirmationDecision(false);
      // update selected template id to reflect the loaded template
      setSelectedTemplateId(templateId);
    },
    [loadTemplateDesign]
  );

  // Apply the blank design (no template) immediately.
  const applyBlankNow = useCallback(() => {
    loadBlankDesign();
    setSelectedTemplateId(null);
    setTemplateSwitchIntent(null);
    setConfirmationDecision(false);
  }, [loadBlankDesign]);

  // Keep unsaved modifications and close pending state without applying a template.
  const keepUnsavedAndClosePending = useCallback(() => {
    setTemplateSwitchIntent(null);
    setConfirmationDecision(true);
  }, []);

  // Request selection of a template. If autoConfirm is enabled or no unsaved changes
  // exist the template is applied immediately. Otherwise a pendingChange is set
  // and the caller should confirm or cancel the pending selection.
  const requestSelectTemplate = useCallback(
    (templateId: string, opts?: { keepUnsavedModifications?: boolean }) => {
      if (autoConfirm) {
        applyTemplateNow(templateId);
        return;
      }

      // Explicit preference passed by caller
      if (typeof opts?.keepUnsavedModifications === "boolean") {
        if (opts.keepUnsavedModifications) {
          keepUnsavedAndClosePending();
        } else {
          applyTemplateNow(templateId);
        }
        return;
      }

      // If there are unsaved changes, set pending and wait for confirmation
      if (hasUnsavedModifications) {
        setTemplateSwitchIntent({ templateId });
        setConfirmationDecision(null);
        return;
      }

      // Otherwise apply immediately
      applyTemplateNow(templateId);
    },
    [
      autoConfirm,
      hasUnsavedModifications,
      applyTemplateNow,
      keepUnsavedAndClosePending,
    ]
  );

  // Request selecting a blank design. Mirrors requestSelectTemplate behaviour.
  // Returns true when the blank design was applied immediately; false when a
  // confirmation is required (pending).
  const requestSelectBlank = useCallback((): boolean => {
    if (hasUnsavedModifications) {
      setTemplateSwitchIntent({ templateId: BLANK_PENDING_ID });
      setConfirmationDecision(null);
      return false;
    }

    applyBlankNow();
    return true;
  }, [hasUnsavedModifications, applyBlankNow]);

  // Confirm the pending selection. keepUnsavedModifications determines whether to
  // keep current unsaved work or to discard and apply the pending template.
  const confirmPendingSelection = useCallback(
    (keepUnsavedModifications: boolean) => {
      const pending = templateSwitchIntent;
      if (!pending) return;

      // Special case: blank selection
      if (pending.templateId === BLANK_PENDING_ID) {
        if (keepUnsavedModifications) {
          keepUnsavedAndClosePending();
        } else {
          applyBlankNow();
        }
        return;
      }

      if (keepUnsavedModifications) {
        keepUnsavedAndClosePending();
      } else {
        applyTemplateNow(pending.templateId);
      }
    },
    [
      templateSwitchIntent,
      keepUnsavedAndClosePending,
      applyTemplateNow,
      applyBlankNow,
    ]
  );

  // Dialog helpers (previously provided by useLoadTemplate)
  const dialogOpen = Boolean(templateSwitchIntent);

  const onDiscard = useCallback(() => {
    confirmPendingSelection(false);
    onClose?.();
  }, [confirmPendingSelection, onClose]);

  const onKeep = useCallback(() => {
    confirmPendingSelection(true);
    onClose?.();
  }, [confirmPendingSelection, onClose]);

  const onCancel = useCallback(() => {
    clearPending();
  }, [clearPending]);

  // Select a random template (avoids re-selecting the currently selected template)
  const selectRandomTemplate = useCallback(() => {
    const all = templates;
    if (!all || all.length === 0) return;

    let candidates = all.map((t: TemplateMetadata) => t.id);
    if (candidates.length > 1 && selectedTemplateId) {
      candidates = candidates.filter((id: string) => id !== selectedTemplateId);
    }

    const idx = Math.floor(Math.random() * candidates.length);
    const chosen = candidates[idx];
    if (chosen) {
      requestSelectTemplate(chosen);
    }
  }, [templates, selectedTemplateId, requestSelectTemplate]);

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

  // Public API: expose clear, intention-based names only (full rename).
  return {
    templates,
    getTemplateById,
    templatesRegistry,
    selectedTemplateId,
    hasUnsavedModifications,

    // intent/confirmation state
    templateSwitchIntent,
    confirmationDecision,

    // actions (new names)
    requestSelectTemplate,
    requestSelectBlank,
    confirmPendingSelection,
    applyTemplateNow,
    keepUnsavedAndClosePending,
    selectRandomTemplate,
    getColorSamples,
    clearPending,

    // dialog helpers (UI convenience)
    dialogOpen,
    onDiscard,
    onKeep,
    onCancel,

    // allow tests or advanced use to set selected id directly
    _internal_setSelectedTemplateId: setSelectedTemplateId,
  };
}

function getAllTemplates() {
  return Object.values(templatesRegistry);
}

export type { TemplateMetadata };
