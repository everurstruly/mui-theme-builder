import type { StateCreator } from "zustand";

export type PreviewSlice = {
  previews: Record<string, any>;
  previewVersion: number; // bumped on updates to allow subscribers to react

  setPreview: (path: string, value: any) => void;
  clearPreview: (path?: string) => void;
  batchSetPreviews: (updates: Record<string, any>) => void;
};

let pendingUpdates: Record<string, any> | null = null;
let rafHandle: number | null = null;

function scheduleFlush(set: (fn: (s: any) => any) => void) {
  if (rafHandle != null) return;
  if (typeof requestAnimationFrame === "undefined") {
    // non-browser fallback: flush synchronously
    if (pendingUpdates) {
      const updates = pendingUpdates;
      pendingUpdates = null;
      set((state: any) => ({
        previews: { ...state.previews, ...updates },
        previewVersion: (state.previewVersion || 0) + 1,
      }));
    }
    return;
  }

  rafHandle = requestAnimationFrame(() => {
    rafHandle = null;
    if (!pendingUpdates) return;
    const updates = pendingUpdates!;
    pendingUpdates = null;
    set((state: any) => ({
      previews: { ...state.previews, ...updates },
      previewVersion: (state.previewVersion || 0) + 1,
    }));
  });
}

export const createPreviewSlice: StateCreator<PreviewSlice> = (set) => ({
  previews: {},
  previewVersion: 0,

  setPreview: (path: string, value: any) => {
    if (!pendingUpdates) pendingUpdates = {};
    pendingUpdates[path] = value;
    scheduleFlush(set);
  },

  clearPreview: (path?: string) => {
    // If clearing specific path, flush immediately to avoid stale previews
    if (rafHandle != null) {
      cancelAnimationFrame(rafHandle);
      rafHandle = null;
    }
    pendingUpdates = null;

    set((state: any) => {
      if (path == null) return { previews: {}, previewVersion: state.previewVersion + 1 };
      const { [path]: _omit, ...rest } = state.previews || {};
      return { previews: rest, previewVersion: state.previewVersion + 1 };
    });
  },

  batchSetPreviews: (updates: Record<string, any>) => {
    set((state: any) => ({
      previews: { ...state.previews, ...updates },
      previewVersion: (state.previewVersion || 0) + 1,
    }));
  },
});
