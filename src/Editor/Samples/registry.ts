import type { ComponentType } from "react";
import DashboardExample from "./DashboardExample";
import ContactForm from "./ContactForm";
import ProductCardGrid from "./ProductCardGrid";

export type SampleMetadata = {
  id: string;
  label: string;
  description?: string;
  path: string; // Path-based organization (e.g., "examples/dashboards" or "components/forms")
  component: ComponentType<Record<string, unknown>>;
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
export const samplesRegistry: Record<string, SampleMetadata> = {
  DashboardExample: {
    id: "DashboardExample",
    label: "Dashboard Example",
    description: "A sample dashboard layout with responsive behavior",
    path: "examples/dashboards",
    component: DashboardExample,
  },
  ContactForm: {
    id: "ContactForm",
    label: "Contact Form",
    description: "A contact form with validation and loading states",
    path: "examples/forms",
    component: ContactForm,
  },
  ProductCardGrid: {
    id: "ProductCardGrid",
    label: "Product Card Grid",
    description: "A responsive product grid with ratings and favorites",
    path: "examples/ecommerce",
    component: ProductCardGrid,
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
 * Get list of all sample IDs
 */
export const getSampleIds = () => Object.keys(samplesRegistry);

/**
 * Build a tree structure from flat path-based registry
 */
export const buildSamplesTree = (): Record<string, TreeNode> => {
  const tree: Record<string, TreeNode> = {};

  Object.entries(samplesRegistry).forEach(([id, sample]) => {
    const pathParts = sample.path.split("/");
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
        // Leaf node - add the component
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

export default samplesRegistry;
