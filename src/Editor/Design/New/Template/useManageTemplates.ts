import { useCallback, useEffect } from 'react';
import { useTemplates } from './useTemplates';
import templatesRegistry, { getTemplateById } from '../../../Templates/registry';

/**
 * Hook to manage templates - handles side effects and helper functions.
 * Similar to useManageCollection but for templates.
 */
export function useManageTemplates() {
  const templates = useTemplates((s) => s.templates);
  const setTemplates = useTemplates((s) => s.setTemplates);
  const isLoading = useTemplates((s) => s.isLoading);
  const setLoading = useTemplates((s) => s.setLoading);
  const setError = useTemplates((s) => s.setError);

  /**
   * Load templates from the registry.
   * In a real app, this might fetch from an API.
   */
  const loadTemplates = useCallback(() => {
    try {
      setLoading(true);
      const templatesList = Object.values(templatesRegistry);
      setTemplates(templatesList);
    } catch (error) {
      console.error('Failed to load templates:', error);
      setError(error instanceof Error ? error.message : 'Failed to load templates');
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
    const palette = themeOptions?.colorSchemes?.light?.palette || themeOptions?.palette;
    
    if (palette) {
      ['primary', 'secondary', 'error', 'warning', 'info', 'success'].forEach(key => {
        if (palette[key]?.main) colors.push(palette[key].main);
      });
    }

    return colors.length > 0 ? colors.slice(0, 6) : ["#1976d2", "#dc004e", "#ff9800"];
  }, []);

  /**
   * Get a template by ID (convenience wrapper).
   */
  const getTemplate = useCallback((id: string) => {
    return getTemplateById(id);
  }, []);

  // Auto-load templates on mount
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  return {
    templates,
    isLoading,
    loadTemplates,
    getTemplateColors,
    getTemplate,
    getTemplateById, // Re-export for compatibility
  };
}

export default useManageTemplates;
