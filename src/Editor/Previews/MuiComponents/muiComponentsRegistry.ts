/**
 * MUI Components Registry
 * 
 * Auto-generates a component registry from @mui/material package.
 * Uses the package's own metadata instead of manually duplicating from docs.
 */

import * as MuiMaterial from '@mui/material';
import type { ComponentType } from 'react';

export type MuiComponentMetadata = {
  id: string;
  name: string;
  label: string;
  component: ComponentType<Record<string, unknown>>;
  category: string;
  description?: string;
  path: string; // For compatibility with preview registry
};

export type MuiComponentTree = {
  type: 'folder';
  label: string;
  children: Record<string, {
    type: 'component';
    id: string;
    label: string;
    component: ComponentType<Record<string, unknown>>;
    children: Record<string, never>;
  }>;
};

/**
 * Flat metadata without categorization fields
 */
export type FlatMuiComponentMetadata = {
  id: string;
  name: string;
  label: string;
  component: ComponentType<Record<string, unknown>>;
};

/**
 * Infer category from component name using heuristics
 * This eliminates the need to manually maintain a category mapping
 */
function inferCategory(componentName: string): string {
  const name = componentName.toLowerCase();
  
  // Input components
  if (name.includes('button') || name.includes('input') || name.includes('text') || 
      name.includes('select') || name.includes('checkbox') || name.includes('radio') ||
      name.includes('switch') || name.includes('slider') || name.includes('fab') ||
      name.includes('toggle') || name.includes('autocomplete') || name.includes('rating') ||
      name.includes('form')) {
    return 'Inputs';
  }
  
  // Feedback components
  if (name.includes('progress') || name.includes('skeleton') || name.includes('alert') ||
      name.includes('snackbar') || name.includes('dialog') || name.includes('backdrop')) {
    return 'Feedback';
  }
  
  // Navigation components
  if (name.includes('menu') || name.includes('tab') || name.includes('stepper') ||
      name.includes('step') || name.includes('breadcrumb') || name.includes('drawer') ||
      name.includes('link') || name.includes('pagination') || name.includes('speed') ||
      name.includes('navigation')) {
    return 'Navigation';
  }
  
  // Layout components
  if (name.includes('box') || name.includes('container') || name.includes('grid') ||
      name.includes('stack') || name.includes('imagelist')) {
    return 'Layout';
  }
  
  // Surface components
  if (name.includes('card') || name.includes('paper') || name.includes('accordion') ||
      name.includes('appbar') || name.includes('toolbar')) {
    return 'Surfaces';
  }
  
  // Data Display components
  if (name.includes('avatar') || name.includes('badge') || name.includes('chip') ||
      name.includes('divider') || name.includes('list') || name.includes('table') ||
      name.includes('tooltip') || name.includes('typography') || name.includes('icon')) {
    return 'Data Display';
  }
  
  // Utility components
  if (name.includes('click') || name.includes('css') || name.includes('global') ||
      name.includes('grow') || name.includes('modal') || name.includes('popper') ||
      name.includes('portal') || name.includes('slide') || name.includes('zoom') ||
      name.includes('swipeable') || name.includes('popover') || name.includes('nossr') ||
      name.includes('textarea') || name.includes('trap')) {
    return 'Utils';
  }
  
  // Default fallback
  return 'Other';
}

/**
 * Get all MUI components from the package
 */
function getAllMuiComponents(): MuiComponentMetadata[] {
  const components: MuiComponentMetadata[] = [];
  const muiExports = Object.keys(MuiMaterial);

  for (const exportName of muiExports) {
    // Skip non-component exports (hooks, utils, types, etc.)
    if (
      exportName.startsWith('use') || // Hooks
      exportName.startsWith('create') || // Utilities
      exportName.startsWith('styled') || // Styled utilities
      exportName.includes('Props') || // Type definitions
      exportName.includes('Classes') || // Style classes
      exportName.includes('Theme') || // Theme types
      exportName === 'default' ||
      exportName === '__esModule'
    ) {
      continue;
    }

    const component = (MuiMaterial as Record<string, unknown>)[exportName];
    
    // Check if it's a valid React component
    if (typeof component === 'function' || (typeof component === 'object' && component !== null)) {
      const category = inferCategory(exportName);
      
      components.push({
        id: exportName,
        name: exportName,
        label: exportName,
        component: component as ComponentType<Record<string, unknown>>,
        category,
        path: `mui/${category}`,
      });
    }
  }

  return components;
}

/**
 * New flat (no categorization) registry of components
 * Only exposes id, name, label, component
 */
export function getMuiComponentsFlat(): Record<string, FlatMuiComponentMetadata> {
  const components = getAllMuiComponents();
  const flat: Record<string, FlatMuiComponentMetadata> = {};

  for (const comp of components) {
    const { id, name, label, component } = comp;
    flat[id] = { id, name, label, component };
  }

  return flat;
}

/**
 * Build a tree structure grouped by category
 */
export function buildMuiComponentTree(): Record<string, MuiComponentTree> {
  const components = getAllMuiComponents();
  const tree: Record<string, MuiComponentTree> = {};

  // Group components by category
  for (const comp of components) {
    const category = comp.category;

    if (!tree[category]) {
      tree[category] = {
        type: 'folder',
        label: category,
        children: {},
      };
    }

    tree[category].children[comp.id] = {
      type: 'component',
      id: comp.id,
      label: comp.name,
      component: comp.component,
      children: {},
    };
  }

  return tree;
}

/**
 * Get a flat registry of all MUI components
 */
export function getMuiComponentsRegistry(): Record<string, MuiComponentMetadata> {
  const components = getAllMuiComponents();
  const registry: Record<string, MuiComponentMetadata> = {};

  for (const comp of components) {
    registry[comp.id] = comp;
  }

  return registry;
}

/**
 * Export the auto-generated tree and registry
 */
export const muiComponentsTree = buildMuiComponentTree();
// Expose a flat registry under the same name so consumers don't need to change imports
export const muiComponentsRegistry = getMuiComponentsFlat();
