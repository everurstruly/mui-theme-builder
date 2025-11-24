import type { ThemeOptions } from "@mui/material";
import materialTheme from "./material";
import modernTheme from "./modern";
import minimalTheme from "./minimal";
import ios26 from "./collections/ios26";
import { deepMerge } from "../Design/shared";

export type TemplateMetadata = {
  id: string;
  label: string;
  description?: string;
  path: string; // Path-based organization (e.g., "root" or "category/subcategory")
  themeOptions: ThemeOptions;
};

export type TreeNode = {
  type: "folder" | "template";
  label: string;
  children: Record<string, TreeNode>;
} & Partial<TemplateMetadata>;

/**
 * Registry of all available theme templates.
 * Add new templates here to make them available in the editor.
 *
 * Each template should:
 * - Export a ThemeOptions object as default
 * - Use colorSchemes property to define light and dark modes
 * - Be a single file or index file in a folder
 */
const templatesRegistry: Record<string, TemplateMetadata> = {
  material: {
    id: "material",
    label: "Material Design",
    description: "Default Material Design theme with standard colors and spacing",
    path: "root",
    themeOptions: materialTheme,
  },
  modern: {
    id: "modern",
    label: "Modern",
    description: "A clean, modern theme with vibrant colors and rounded corners",
    path: "root",
    themeOptions: modernTheme,
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    description: "A minimalist theme with subtle colors and tight spacing",
    path: "root",
    themeOptions: minimalTheme,
  },
  ios26: {
    id: "ios26",
    label: "iOS 26",
    description: "Soft, rounded, system-style theme inspired by modern iOS design",
    path: "root",
    themeOptions: ios26,
  },
};

/**
 * Get list of all template IDs
 */
export const getTemplateIds = () => Object.keys(templatesRegistry);

/**
 * Build a tree structure from flat path-based registry
 */
export const buildTemplatesTree = (): Record<string, TreeNode> => {
  const tree: Record<string, TreeNode> = {};

  Object.entries(templatesRegistry).forEach(([id, template]) => {
    // Normalize and split the path
    const pathParts = template.path ? template.path.split("/").filter(Boolean) : [];

    // If path starts with 'root' we place the template at the top-level (no nesting)
    if (pathParts.length > 0 && pathParts[0].toLowerCase() === "root") {
      tree[id] = {
        type: "template",
        children: {},
        ...template,
      };
      return;
    }

    let current = tree;

    // Build nested structure from path
    pathParts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {
          type: "folder",
          label: part.charAt(0).toUpperCase() + part.slice(1), // Capitalize
          children: {},
        };
      }

      if (index === pathParts.length - 1) {
        // Leaf node - add the template under the folder's children
        current[part].children[id] = {
          type: "template",
          children: {},
          ...template,
        };
      } else {
        current = current[part].children;
      }
    });
  });

  return tree;
};

/**
 * Build an index mapping template id -> folder chain (array of folder keys)
 * Useful for fast lookups (avoids walking the tree repeatedly).
 */
export function buildTemplatesIndex(tree?: Record<string, TreeNode>) {
  const t = tree ?? buildTemplatesTree();
  const index: Record<string, string[]> = {};

  const walk = (nodeMap: Record<string, TreeNode>, path: string[]) => {
    for (const [key, node] of Object.entries(nodeMap)) {
      if (node.type === "template" && node.id) {
        index[node.id] = path;
      } else if (node.type === "folder") {
        walk(node.children || {}, [...path, key]);
      }
    }
  };

  walk(t, []);
  return index;
}

/**
 * Find the folder chain (array of folder keys) that contains the given template id.
 * Uses a tree produced by `buildTemplatesTree`.
 */
export function findFolderChain(
  tree: Record<string, TreeNode>,
  targetId: string
): string[] | null {
  const helper = (
    nodeMap: Record<string, TreeNode>,
    path: string[]
  ): string[] | null => {
    for (const [key, node] of Object.entries(nodeMap)) {
      if (node.type === "template" && node.id === targetId) {
        return path;
      }

      if (node.type === "folder") {
        const res = helper(node.children || {}, [...path, key]);
        if (res) return res;
      }
    }
    return null;
  };

  return helper(tree, []);
}

/**
 * Get folder node by a chain of keys.
 */
export function getFolderNodeByChain(
  tree: Record<string, TreeNode>,
  chain: string[]
): TreeNode | null {
  let current: Record<string, TreeNode> = tree;
  let node: TreeNode | null = null;

  for (const key of chain) {
    node = current[key];
    if (!node || node.type !== "folder") return null;
    current = node.children || {};
  }

  return node;
}

/**
 * Export the registry as default and named export
 */
export default templatesRegistry;

/**
 * Also export as templatesRegistry for backwards compatibility
 */
export { templatesRegistry };

export function isTemplateIdValid(id: string): boolean {
  return id in templatesRegistry;
}

export function getValidTemplateId(id: string, fallback = "material"): string {
  return isTemplateIdValid(id) ? id : fallback;
}

/**
 * Get a template by ID
 */
export function getTemplateById(id: string): TemplateMetadata | undefined {
  return templatesRegistry[id];
}

/**
 * Register a new template dynamically
 * Useful for adding templates from external sources or user imports
 */
export function registerTemplate(metadata: TemplateMetadata): void {
  templatesRegistry[metadata.id] = metadata;
}

/**
 * Resolve a ThemeOptions for a specific color scheme when templates use the
 * `colorSchemes` structure. If template already is a flat ThemeOptions (old
 * format), it will be returned as-is.
 */
export function extractThemeOptionsForScheme(
  themeOptions: ThemeOptions,
  scheme: "light" | "dark"
): ThemeOptions {
  if (
    themeOptions.colorSchemes &&
    typeof themeOptions.colorSchemes === "object" &&
    scheme in themeOptions.colorSchemes
  ) {
    const schemeOpts = (themeOptions.colorSchemes as Record<string, any>)[scheme] as
      | Record<string, any>
      | undefined;

    const { colorSchemes, ...base } = themeOptions as Record<string, any>;

    if (schemeOpts) {
      void colorSchemes;
      return deepMerge(base as Record<string, any>, schemeOpts) as ThemeOptions;
    }
  }

  // Fallback: return template as-is
  return themeOptions;
}
