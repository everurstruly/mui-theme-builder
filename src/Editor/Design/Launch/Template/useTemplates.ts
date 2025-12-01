import { useMemo } from 'react';
import templatesRegistry, { getTemplateById } from '../../../Templates/registry';

export function useTemplates() {
  const templates = useMemo(() => Object.values(templatesRegistry), []);

  const getTemplateColors = (id: string): string[] => {
    const template = getTemplateById(id);
    if (!template) return ["#1976d2", "#dc004e", "#ff9800"];

    // Extract colors from theme options
    const themeOptions = template.themeOptions as any;
    const colors: string[] = [];
    
    // Try new color schemes format
    const palette = themeOptions?.colorSchemes?.light?.palette || themeOptions?.palette;
    
    if (palette) {
      ['primary', 'secondary', 'error', 'warning', 'info'].forEach(key => {
        if (palette[key]?.main) colors.push(palette[key].main);
      });
    }

    return colors.length > 0 ? colors.slice(0, 6) : ["#1976d2", "#dc004e", "#ff9800"];
  };

  return {
    templates,
    getTemplateById,
    getTemplateColors
  };
}
