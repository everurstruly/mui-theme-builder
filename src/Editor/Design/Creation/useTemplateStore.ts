import templatesRegistry, {
  type TemplateMetadata,
  getTemplateById,
  isTemplateIdValid,
  buildTemplatesTree,
  type TreeNode as TemplateTreeNode,
} from "../../Templates/registry";

/**
 * Lightweight hook for template discovery and metadata.
 * Templates are separate from active designs - they serve as starting points.
 * 
 * This hook provides access to the static template registry without
 * coupling it to the design store state.
 * 
 * @example
 * function TemplateSelector() {
 *   const { getAllTemplates, getTemplateById } = useTemplateStore();
 *   const templates = getAllTemplates();
 *   
 *   return templates.map(t => (
 *     <button onClick={() => loadTemplate(t.id)}>
 *       {t.label}
 *     </button>
 *   ));
 * }
 */
export function useTemplateStore() {
  return {
    /**
     * Get a template by ID
     * @param id - Template identifier (e.g., 'material', 'modern')
     * @returns Template metadata or undefined if not found
     */
    getTemplateById,

    /**
     * Check if a template ID is valid
     * @param id - Template identifier to validate
     * @returns True if template exists in registry
     */
    isTemplateIdValid,

    /**
     * Get all available templates as an array
     * @returns Array of all template metadata
     */
    getAllTemplates: () => Object.values(templatesRegistry),

    /**
     * Get templates organized in a tree structure
     * @returns Tree structure for UI organization (folders/categories)
     */
    getTemplatesTree: buildTemplatesTree,

    /**
     * Direct access to the registry (for advanced use)
     */
    templatesRegistry,
  };
}

export type { TemplateMetadata, TemplateTreeNode };
