import type { ComponentType } from "react";
import DashboardExample from "./DashboardExample";
import ContactForm from "./ContactForm";
import ProductCardGrid from "./ProductCardGrid";
import BlogExample from "./BlogExample";
import CheckoutExample from "./CheckoutExample";
import { getMuiComponentsRegistry } from "./MuiComponents/muiComponentsRegistry";
import MuiComponentPreview from "./MuiComponents/MuiComponentPreview";
import DevSandbox from "./DevSandbox";

export type SampleMetadata = {
  id: string;
  label: string;
  description?: string;
  path: string; // Path-based organization (e.g., "examples/dashboards" or "components/forms")
  component: ComponentType<Record<string, unknown>>;
  isMuiComponent?: boolean; // Flag to identify MUI components
  muiComponentName?: string; // Original MUI component name for preview
};

export type TreeNode = {
  type: "folder" | "component";
  label: string;
  children: Record<string, TreeNode>;
} & Partial<SampleMetadata>;

/**
 * Registry of all available components that can be rendered in the canvas.
 * Add new samples here to make them available in the ActivitiesPanel.
 */
const samplesRegistry: Record<string, SampleMetadata> = {
  DashboardExample: {
    id: "DashboardExample",
    label: "Dashboard",
    description: "A sample dashboard layout with responsive behavior",
    path: "root",
    component: DashboardExample,
  },
  BlogExample: {
    id: "BlogExample",
    label: "Blog",
    description: "A blog layout with sidebar, featured posts and footer",
    path: "root",
    component: BlogExample,
  },
  ContactForm: {
    id: "ContactForm",
    label: "Contact Form",
    description: "A contact form with validation and loading states",
    path: "ecommerce",
    component: ContactForm,
  },
  ProductCardGrid: {
    id: "ProductCardGrid",
    label: "Product Card Grid",
    description: "A responsive product grid with ratings and favorites",
    path: "ecommerce",
    component: ProductCardGrid,
  },
  CheckoutExample: {
    id: "CheckoutExample",
    label: "Checkout Example",
    description: "A checkout flow with address, payment and review steps",
    path: "ecommerce",
    component: CheckoutExample,
  },
  DevSandbox: {
    id: "DevSandbox",
    label: "Dev Sandbox",
    description: "A set of hand-picked components for testing and prototyping",
    path: "root",
    component: DevSandbox,
  },
  // Add more samples here as you create them:
  // LoginForm: {
  //   id: "LoginForm",
  //   label: "Login Form",
  //   path: "examples/forms",
  //   component: LoginForm,
  // },
};

/**
 * Create wrapper entries for MUI components
 */
function getMuiComponentSamples(): Record<string, SampleMetadata> {
  const muiRegistry = getMuiComponentsRegistry();
  const muiSamples: Record<string, SampleMetadata> = {};

  Object.entries(muiRegistry).forEach(([id, compMetadata]) => {
    muiSamples[`mui-${id}`] = {
      id: `mui-${id}`,
      label: compMetadata.label,
      description: `MUI ${compMetadata.name} component preview`,
      // Force flat placement for all MUI components in the Previews tree
      // Ignore any category-derived paths and place at the root level
      path: "root",
      component: () => MuiComponentPreview({ componentName: compMetadata.name }),
      isMuiComponent: true,
      muiComponentName: compMetadata.name,
    };
  });

  return muiSamples;
}

/**
 * Combined registry: custom samples + auto-generated MUI components
 */
const allSamples = {
  ...samplesRegistry,
  // ...getMuiComponentSamples(),
};

/**
 * Get list of all sample IDs (including MUI components)
 */
export const getSampleIds = () => Object.keys(allSamples);

/**
 * Build a tree structure from flat path-based registry
 */
export const buildSamplesTree = (): Record<string, TreeNode> => {
  const tree: Record<string, TreeNode> = {};

  Object.entries(allSamples).forEach(([id, sample]) => {
    // Normalize and split the path
    const pathParts = sample.path ? sample.path.split("/").filter(Boolean) : [];

    // If path starts with 'root' we place the component at the top-level (no nesting)
    if (pathParts.length > 0 && pathParts[0].toLowerCase() === "root") {
      tree[id] = {
        type: "component",
        children: {},
        ...sample,
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
        // Leaf node - add the component under the folder's children
        current[part].children[id] = {
          type: "component",
          children: {},
          ...sample,
        };
      } else {
        current = current[part].children;
      }
    });
  });

  return tree;
};

/**
 * Export the combined registry as default and named export
 * This includes both custom examples and auto-generated MUI components
 */
export default allSamples;

/**
 * Also export as samplesRegistry for backwards compatibility
 */
export { allSamples as samplesRegistry };

export function isSampleIdValid(id: string): boolean {
  return id in allSamples;
}

export function getValidSampleId(id: string, fallback = "DashboardExample"): string {
  return isSampleIdValid(id) ? id : fallback;
}
