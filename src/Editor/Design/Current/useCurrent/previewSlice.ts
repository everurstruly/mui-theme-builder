import type { StateCreator } from "zustand";
import type { CurrentDesignPreviewSlice, CurrentDesignStore, ThemeSnapshot } from "./types";

export const createPreviewSlice: StateCreator<
  CurrentDesignStore,
  [],
  [],
  CurrentDesignPreviewSlice
> = (set, get) => ({
  activeColorScheme: "light",
  activePreviewId: "DevSandbox",
  isViewingVersion: false,
  viewingVersionId: null,
  viewingVersionSnapshot: null,

  setActiveColorScheme: (scheme) => {
    set({ activeColorScheme: scheme });
  },

  selectPreview: (previewId) => {
    set({ activePreviewId: previewId });
  },

  enterViewMode: (versionId: string, snapshot: ThemeSnapshot, createdAt: number) => {
    // Save current state before switching to view mode
    const currentState = get();
    set({
      isViewingVersion: true,
      viewingVersionId: versionId,
      viewingVersionSnapshot: {
        previousSnapshotId: currentState.savedId,
        previousEditState: {
          title: currentState.title,
          baseThemeOptionSource: currentState.baseThemeOptionSource,
          baseThemeOptionSourceMetadata: currentState.baseThemeOptionSourceMetadata,
          neutralEdits: currentState.neutralEdits,
          schemeEdits: currentState.schemeEdits,
          codeOverridesSource: currentState.codeOverridesSource,
          codeOverridesDsl: currentState.codeOverridesDsl,
          codeOverridesEdits: currentState.codeOverridesEdits,
        },
        versionCreatedAt: createdAt,
      },
    });
    // Hydrate the version snapshot (read-only)
    currentState.hydrate(snapshot, { isSaved: true });
  },

  exitViewMode: () => {
    const currentState = get();
    const savedState = currentState.viewingVersionSnapshot;
    
    if (savedState?.previousEditState) {
      // Restore previous edit state
      set((state) => ({
        isViewingVersion: false,
        viewingVersionId: null,
        viewingVersionSnapshot: null,
        title: savedState.previousEditState.title,
        baseThemeOptionSource: savedState.previousEditState.baseThemeOptionSource,
        baseThemeOptionSourceMetadata: savedState.previousEditState.baseThemeOptionSourceMetadata,
        neutralEdits: savedState.previousEditState.neutralEdits,
        schemeEdits: savedState.previousEditState.schemeEdits,
        codeOverridesSource: savedState.previousEditState.codeOverridesSource,
        codeOverridesDsl: savedState.previousEditState.codeOverridesDsl,
        codeOverridesEdits: savedState.previousEditState.codeOverridesEdits,
        checkpointHash: state.checkpointHash, // Keep checkpoint to avoid dirty state
      }));
      
      // Restore snapshot ID
      if (savedState.previousSnapshotId) {
        set({ savedId: savedState.previousSnapshotId });
      }
    }
  },
});
