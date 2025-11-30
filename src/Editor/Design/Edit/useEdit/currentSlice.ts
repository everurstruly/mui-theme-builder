import type { StateCreator } from "zustand";
import { serializeThemeOptions } from "../../compiler";
import type {
  ColorSchemeEdits,
  DesignEditCurrentSlice,
  ThemeCurrentState,
} from "./types";
import templatesRegistry from "../../../Templates/registry";
import { createAddPatch, createRemovePatch } from "./historySlice";

export const createCurrentSlice: StateCreator<
  DesignEditCurrentSlice,
  [],
  [],
  DesignEditCurrentSlice
> = (set, get) => ({
  title: templatesRegistry.material.label,
  baseThemeOptionSource: generateDefaultBaseThemeOption(),
  baseThemeOptionSourceMetadata: {
    templateId: "material",
    createdAtTimestamp: Date.now(),
    lastModifiedTimestamp: Date.now(),
  },

  neutralEdits: {},
  schemeEdits: {
    light: createInitialSchemeEdits(),
    dark: createInitialSchemeEdits(),
  },

  codeOverridesSource: "",
  codeOverridesDsl: {},
  codeOverridesEdits: {},
  codeOverridesError: null,

  contentHash: generateInitialContentHash(),
  lastStoredContentHash: generateInitialContentHash(),
  modificationTimestamps: {},

  setTitle: (title: string) => {
    set((state) => {
      const newState: Partial<DesignEditCurrentSlice> = { title };
      const contentHash = computeContentHash({ ...state, ...newState });
      return {
        ...newState,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          title: Date.now(),
        },
      };
    });
  },

  setBaseThemeOption: (themeCodeOrDsl, metadata) => {
    const codeString =
      typeof themeCodeOrDsl === "string"
        ? themeCodeOrDsl
        : JSON.stringify(themeCodeOrDsl);

    set((state) => {
      const newState: Partial<DesignEditCurrentSlice> = {
        baseThemeOptionSource: codeString,
        baseThemeOptionSourceMetadata: {
          ...state.baseThemeOptionSourceMetadata,
          ...metadata,
          lastModifiedTimestamp: Date.now(),
        },
        title: metadata?.title ?? state.title,
      };

      const contentHash = computeContentHash({ ...state, ...newState });

      return {
        ...newState,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          baseThemeOptionSource: Date.now(),
        },
      };
    });
  },

  addGlobalDesignerEdit: (path, value) => {
    set((state) => {
      const current = state.neutralEdits[path];
      if (current === value) return state; // Skip if no change

      // Record history patch for this change
      try {
        const patch = createAddPatch(path, value, current, undefined, true);
        (get() as any).recordVisualChange?.([patch]);
      } catch {
        // non-fatal; continue
      }

      const newEdits = {
        ...state.neutralEdits,
        [path]: value,
      };

      const newState: Partial<DesignEditCurrentSlice> = { neutralEdits: newEdits };
      const contentHash = computeContentHash({ ...state, ...newState });

      return {
        ...newState,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["global:" + path]: Date.now(),
        },
      };
    });
  },

  addSchemeDesignerEdit: (scheme, path, value) => {
    set((state) => {
      const schemeObj = state.schemeEdits[scheme] || { designer: {} };
      const current = schemeObj.designer[path];
      if (current === value) return state;

      // Record history patch for scheme-specific change
      try {
        const patch = createAddPatch(path, value, current, scheme as any, false);
        (get() as any).recordVisualChange?.([patch]);
      } catch {
        // ignore
      }

      const newSchemes: DesignEditCurrentSlice["schemeEdits"] = {
        ...state.schemeEdits,
        [scheme]: {
          ...schemeObj,
          designer: {
            ...(schemeObj.designer || {}),
            [path]: value,
          },
        },
      };

      const newState: Partial<DesignEditCurrentSlice> = { schemeEdits: newSchemes };
      const contentHash = computeContentHash({ ...state, ...newState });

      return {
        schemeEdits: newSchemes,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["scheme:" + scheme + ":" + path]: Date.now(),
        },
      };
    });
  },

  removeGlobalDesignerEdit: (path) => {
    set((state) => {
      const newEdits = { ...state.neutralEdits };
      if (!(path in newEdits)) return state;
      const oldValue = newEdits[path];
      delete newEdits[path];

      // Record removal patch
      try {
        const patch = createRemovePatch(path, oldValue, undefined, true);
        (get() as any).recordVisualChange?.([patch]);
      } catch {
        // ignore
      }
      const newState: Partial<DesignEditCurrentSlice> = { neutralEdits: newEdits };
      const contentHash = computeContentHash({ ...state, ...newState });
      return {
        neutralEdits: newEdits,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["global:" + path]: Date.now(),
        },
      };
    });
  },

  removeSchemeDesignerEdit: (scheme, path) => {
    set((state) => {
      const schemeEdits = state.schemeEdits[scheme];
      if (!schemeEdits) return state;

      if (!(path in schemeEdits.designer)) return state;

      const newEdits = { ...schemeEdits.designer };
      const oldValue = newEdits[path];
      delete newEdits[path];

      // Record removal patch for scheme edit
      try {
        const patch = createRemovePatch(path, oldValue, scheme as any, false);
        (get() as any).recordVisualChange?.([patch]);
      } catch {
        // ignore
      }

      const newSchemes: DesignEditCurrentSlice["schemeEdits"] = {
        ...state.schemeEdits,
        [scheme]: {
          ...schemeEdits,
          designer: newEdits,
        },
      };

      const newState: Partial<DesignEditCurrentSlice> = { schemeEdits: newSchemes };
      const contentHash = computeContentHash({ ...state, ...newState });

      return {
        schemeEdits: newSchemes,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["scheme:" + scheme + ":" + path]: Date.now(),
        },
      };
    });
  },

  getGlobalDesignerEdit: (path) => {
    return get().neutralEdits[path];
  },

  getSchemeDesignerEdit: (scheme, path) => {
    const schemeEdits = get().schemeEdits[scheme];
    return schemeEdits?.designer[path];
  },

  // Backward compatibility helper - merges global + scheme edits
  getDeveloperToolEdit: (path: string, scheme: string) => {
    const state = get();
    return {
      ...state.neutralEdits,
      ...(state.schemeEdits[scheme]?.designer || {}),
    }[path];
  },

  clearDesignerEdits: (scope, scheme) => {
    if (scope === "global") {
      set((state) => {
        const newState: Partial<DesignEditCurrentSlice> = { neutralEdits: {} };
        const contentHash = computeContentHash({ ...state, ...newState });
        return {
          neutralEdits: {},
          contentHash,
          modificationTimestamps: {
            ...state.modificationTimestamps,
            ["visual:global:clear"]: Date.now(),
          },
        };
      });
    } else if (scope === "current-scheme") {
      set((state) => {
        const newSchemes: DesignEditCurrentSlice["schemeEdits"] = {
          ...state.schemeEdits,
          [scheme]: {
            ...state.schemeEdits[scheme],
            designer: {},
          },
        };
        const newState: Partial<DesignEditCurrentSlice> = {
          schemeEdits: newSchemes,
        };
        const contentHash = computeContentHash({ ...state, ...newState });
        return {
          schemeEdits: newSchemes,
          contentHash,
          modificationTimestamps: {
            ...state.modificationTimestamps,
            ["visual:scheme:clear:" + scheme]: Date.now(),
          },
        };
      });
    } else {
      set((state) => {
        const newState: Partial<DesignEditCurrentSlice> = {
          neutralEdits: {},
          schemeEdits: {
            light: createInitialSchemeEdits(),
            dark: createInitialSchemeEdits(),
          },
        };
        const contentHash = computeContentHash({ ...state, ...newState });
        return {
          neutralEdits: {},
          schemeEdits: {
            light: createInitialSchemeEdits(),
            dark: createInitialSchemeEdits(),
          },
          contentHash,
          modificationTimestamps: {
            ...state.modificationTimestamps,
            ["visual:all:clear"]: Date.now(),
          },
        };
      });
    }
  },

  setCodeOverrides: (source, dsl, flattened, error) => {
    set((state) => {
      const previousSource = state.codeOverridesSource;

      // Record code history (previous source) for undo
      try {
        (get() as any).recordCodeChange?.(previousSource);
      } catch {
        // ignore
      }

      const newState: Partial<DesignEditCurrentSlice> = {
        codeOverridesSource: source,
        codeOverridesDsl: dsl,
        codeOverridesEdits: flattened,
        codeOverridesError: error,
      };
      const contentHash = computeContentHash({ ...state, ...newState });
      return {
        ...newState,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          codeOverrides: Date.now(),
        },
      };
    });
  },

  clearCodeOverrides: () => {
    set((state) => {
      const newState: Partial<DesignEditCurrentSlice> = {
        codeOverridesSource: "",
        codeOverridesDsl: {},
        codeOverridesEdits: {},
        codeOverridesError: null,
      };
      const contentHash = computeContentHash({ ...state, ...newState });
      return {
        ...newState,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["codeOverrides:clear"]: Date.now(),
        },
      };
    });
  },

  loadNew: (themeCodeOrDsl, metadata) => {
    // If caller doesn't provide a theme, store will use its internal default.
    const codeString = themeCodeOrDsl
      ? typeof themeCodeOrDsl === "string"
        ? themeCodeOrDsl
        : JSON.stringify(themeCodeOrDsl)
      : generateDefaultBaseThemeOption();

    set((state) => {
      const newState: Partial<DesignEditCurrentSlice> = {
        title: metadata?.title || templatesRegistry.material.label,
        baseThemeOptionSource: codeString,
        baseThemeOptionSourceMetadata: {
          templateId:
            metadata?.templateId ?? (themeCodeOrDsl ? undefined : "material"),
          createdAtTimestamp: Date.now(),
          lastModifiedTimestamp: Date.now(),
        },
        neutralEdits: {},
        schemeEdits: {
          light: createInitialSchemeEdits(),
          dark: createInitialSchemeEdits(),
        },
        codeOverridesSource: "",
        codeOverridesDsl: {},
        codeOverridesEdits: {},
        codeOverridesError: null,
      } as any;

      const contentHash = computeContentHash({ ...state, ...newState });

      return {
        ...newState,
        contentHash,
        lastStoredContentHash: contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          loadNew: Date.now(),
        },
      } as any;
    });
  },

  resetToBase: () => {
    set((state) => {
      const newState: Partial<DesignEditCurrentSlice> = {
        neutralEdits: {},
        schemeEdits: {
          light: createInitialSchemeEdits(),
          dark: createInitialSchemeEdits(),
        },
        codeOverridesSource: "",
        codeOverridesDsl: {},
        codeOverridesEdits: {},
        codeOverridesError: null,
      };
      const contentHash = computeContentHash({ ...state, ...newState });
      return {
        ...newState,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          resetToBase: Date.now(),
        },
      };
    });
  },

  acknowledgeStoredModifications: () => {
    set((state) => ({
      lastStoredContentHash: state.contentHash,
    }));
  },
});

function generateDefaultBaseThemeOption(): string {
  return serializeThemeOptions(templatesRegistry.material.themeOptions);
}

// Helper: compute a deterministic content hash (JSON string) for dirty checking
// Only includes the serializable parts relevant to storage/dirty checks.
export function computeContentHash(state: Partial<ThemeCurrentState>): string {
  return JSON.stringify({
    base: state.baseThemeOptionSource,
    neutral: state.neutralEdits,
    schemes: state.schemeEdits,
    codeOverrides: state.codeOverridesEdits,
  });
}

function createInitialSchemeEdits(): ColorSchemeEdits {
  return { designer: {} };
}

function generateInitialContentHash() {
  return computeContentHash({
    baseThemeOptionSource: generateDefaultBaseThemeOption(),
    codeOverridesEdits: {},
    neutralEdits: {},
    schemeEdits: {
      light: { designer: {} },
      dark: { designer: {} },
    },
  });
}
