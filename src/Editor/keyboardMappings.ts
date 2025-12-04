/**
 * Central keyboard shortcuts configuration.
 * Keep this in sync with the actual implementation and help documentation.
 */

export interface KeyboardShortcut {
  /** The key combination(s) for react-hotkeys-hook (e.g., "mod+s", "shift+?, ?") */
  keys: string;
  /** Display label for keys (e.g., ["Ctrl", "S"] or ["?"]) */
  displayKeys: string[];
  /** Human-readable description */
  description: string;
  /** Category for grouping in help */
  category: "basics" | "productive" | "navigation";
}

export const keyboardMappings: KeyboardShortcut[] = [
  // ============================================================================
  // BASICS
  // ============================================================================
  {
    keys: "shift+?, ?",
    displayKeys: ["?"],
    description: "Open help dialog",
    category: "basics",
  },
  {
    keys: "/",
    displayKeys: ["/"],
    description: "Open collection",
    category: "basics",
  },
  {
    keys: "n",
    displayKeys: ["N"],
    description: "Create new design",
    category: "basics",
  },
  {
    keys: "mod+s",
    displayKeys: ["Ctrl", "S"],
    description: "Save current design",
    category: "basics",
  },
  {
    keys: "mod+p",
    displayKeys: ["Ctrl", "P"],
    description: "Export theme configuration",
    category: "basics",
  },
  {
    keys: "f2",
    displayKeys: ["F2"],
    description: "Rename current design",
    category: "basics",
  },
  {
    keys: "delete",
    displayKeys: ["Delete"],
    description: "Delete current design",
    category: "basics",
  },

  // ============================================================================
  // PRODUCTIVE
  // ============================================================================
  {
    keys: "mod+z",
    displayKeys: ["Ctrl", "Z"],
    description: "Undo last change",
    category: "productive",
  },
  {
    keys: "mod+shift+z, mod+y",
    displayKeys: ["Ctrl", "Shift", "Z"],
    description: "Redo change",
    category: "productive",
  },
  {
    keys: "mod+i",
    displayKeys: ["Ctrl", "I"],
    description: "Toggle designer/developer mode",
    category: "productive",
  },

  // ============================================================================
  // NAVIGATION
  // ============================================================================
  {
    keys: "mod+b",
    displayKeys: ["Ctrl", "B"],
    description: "Toggle explorer panel",
    category: "navigation",
  },
  {
    keys: "mod+space",
    displayKeys: ["Ctrl", "Space"],
    description: "Toggle fullscreen canvas",
    category: "navigation",
  },
  {
    keys: "mod+right",
    displayKeys: ["Ctrl", "→"],
    description: "Next template",
    category: "navigation",
  },
  {
    keys: "mod+left",
    displayKeys: ["Ctrl", "←"],
    description: "Previous template",
    category: "navigation",
  },
];

/**
 * Group shortcuts by category for help display
 */
export function getShortcutsByCategory() {
  const grouped = keyboardMappings.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<string, KeyboardShortcut[]>
  );

  return {
    basics: grouped.basics || [],
    productive: grouped.productive || [],
    navigation: grouped.navigation || [],
  };
}

/**
 * Category display names
 */
export const categoryNames = {
  basics: "Basics",
  productive: "Productive",
  navigation: "Navigation",
} as const;
