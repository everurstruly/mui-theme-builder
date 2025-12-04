import templatesRegistry, { getTemplateById } from "../../../Templates/registry";
import { useCallback, useEffect } from "react";
import { useTemplates } from "./useTemplates";
import { useDraft } from "../useDraft";
import { loadFromTemplate } from "../strategies/loadFromTemplate";

const maxPreviewColorCount = 4;

export function useTemplateSelection() {
  const templates = useTemplates((s) => s.templates);
  const setTemplates = useTemplates((s) => s.setTemplates);
  const setLoading = useTemplates((s) => s.setLoading);
  const setError = useTemplates((s) => s.setError);
  const setSelection = useTemplates((s) => s.select);
  const selectedId = useTemplates((s) => s.selectedId);
  const clearSelection = useTemplates((s) => s.clearSelection);

  const { load } = useDraft();

  const select = useCallback(
    (id: string) => {
      load(() => loadFromTemplate(id));
      setSelection(id);
    },
    [setSelection, load]
  );

  const next = useCallback(() => {
    if (!templates || templates.length === 0) {
      return;
    }

    if (!selectedId) {
      select(templates[0].id);
      return;
    }

    const currentIndex = templates.findIndex((t) => t.id === selectedId);

    if (currentIndex === -1 || currentIndex === templates.length - 1) {
      select(templates[0].id);
      return;
    }

    select(templates[currentIndex + 1].id);
  }, [templates, selectedId, select]);

  const prev = useCallback(() => {
    if (!templates || templates.length === 0) {
      return;
    }

    if (!selectedId) {
      select(templates[templates.length - 1].id);
      return;
    }

    const currentIndex = templates.findIndex((t) => t.id === selectedId);
    if (currentIndex === -1 || currentIndex === 0) {
      select(templates[templates.length - 1].id);
      return;
    }

    select(templates[currentIndex - 1].id);
  }, [templates, selectedId, select]);

  const randomSelect = useCallback(() => {
    if (!templates || templates.length === 0) {
      return;
    }

    const idx = Math.floor(Math.random() * templates.length);
    const randomTemplate = templates[idx];
    select(randomTemplate.id);
  }, [templates, select]);

  const loadTemplates = useCallback(() => {
    try {
      setLoading(true);
      const templatesList = Object.values(templatesRegistry);
      setTemplates(templatesList);
    } catch (error) {
      console.error("Failed to load templates:", error);
      setError(error instanceof Error ? error.message : "Failed to load templates");
    } finally {
      setLoading(false);
    }
  }, [setTemplates, setLoading, setError]);

  /**
   * Extract color palette from a template by ID.
   * Returns an array of color hex codes from the template's theme options.
   */
  const getTemplateColors = useCallback((id: string): string[] => {
    const template = getTemplateById(id);
    if (!template) return ["#1976d2", "#dc004e", "#ff9800"];

    // Extract colors from theme options
    const themeOptions = template.themeOptions as any;
    const colors: string[] = [];

    // Try new color schemes format first, fall back to legacy palette
    const palette =
      themeOptions?.colorSchemes?.light?.palette || themeOptions?.palette;

    if (palette) {
      ["primary", "secondary", "error", "warning", "info", "success"].forEach(
        (key) => {
          if (palette[key]?.main) colors.push(palette[key].main);
        }
      );
    }

    return colors.length > 0
      ? colors.slice(0, maxPreviewColorCount)
      : ["#1976d2", "#dc004e", "#ff9800"];
  }, []);

  // Auto-load templates on mount
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  return {
    loadTemplates,
    getTemplateColors,
    select,
    clearSelection,
    randomSelect,
    next,
    prev,
  };
}

export default useTemplateSelection;
