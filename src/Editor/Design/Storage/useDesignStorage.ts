import { useCallback, useEffect, useState } from "react";
import { useDesignStore } from "../designStore";
import type { PersistenceAdapter } from "./persistenceAdapter";
import deviceStorageAdapter from "./persistenceAdapter";

const MAX_SAVED = 50;

export interface SavedDesign {
  id: string;
  title: string;
  createdAt: number;
  updatedAt?: number;
  snapshot: {
    baseThemeCode?: string;
    baseThemeMetadata?: any;
    title?: string;
    activeColorScheme?: string;
    colorSchemeIndependentVisualToolEdits?: Record<string, any>;
    light?: { visualToolEdits?: Record<string, any> };
    dark?: { visualToolEdits?: Record<string, any> };
    codeOverridesSource?: string;
  };
}

export default function useDesignStorage(
  adapter: PersistenceAdapter = deviceStorageAdapter
) {
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);

  useEffect(() => {
    let mounted = true;
    adapter.read().then((items) => {
      if (mounted) setSavedDesigns(items);
    });

    // listen for storage events to keep multiple tabs in sync
    const onStorage = () => adapter.read().then((items) => setSavedDesigns(items));
    window.addEventListener("storage", onStorage as any);
    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage as any);
    };
  }, [adapter]);

  const saveCurrent = useCallback(
    async (opts?: { title?: string }) => {
      const id =
        Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
      const state = useDesignStore.getState();

      const snapshot = {
        baseThemeCode: state.baseThemeCode,
        baseThemeMetadata: state.baseThemeMetadata,
        title: opts?.title ?? state.title,
        activeColorScheme: state.activeColorScheme,
        colorSchemeIndependentVisualToolEdits:
          state.colorSchemeIndependentVisualToolEdits,
        light: { visualToolEdits: state.light.visualToolEdits },
        dark: { visualToolEdits: state.dark.visualToolEdits },
        codeOverridesSource: state.codeOverridesSource,
      };

      const item: SavedDesign = {
        id,
        title: snapshot.title || "Untitled",
        createdAt: Date.now(),
        snapshot,
      };

      const before = await adapter.read();
      const next = [item, ...before].slice(0, MAX_SAVED);
      await adapter.write(next);
      setSavedDesigns(next);

      // mark design as saved
      try {
        useDesignStore.setState({ hasUnsavedChanges: false });
      } catch (e) {
        void e;
        // ignore
      }

      return id;
    },
    [adapter]
  );

  const removeSaved = useCallback(
    async (id: string) => {
      const before = await adapter.read();
      const next = before.filter((d) => d.id !== id);
      if (next.length === before.length) return false;
      await adapter.write(next);
      setSavedDesigns(next);
      return true;
    },
    [adapter]
  );

  const duplicateSaved = useCallback(async (id: string) => {
    const before = await adapter.read();
    const found = before.find((d) => d.id === id);
    if (!found) return null;
    const copy: SavedDesign = {
      id: Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8),
      title: `${found.title} (copy)`,
      createdAt: Date.now(),
      snapshot: JSON.parse(JSON.stringify(found.snapshot)),
    };
    const next = [copy, ...before].slice(0, MAX_SAVED);
    await adapter.write(next);
    setSavedDesigns(next);
    return copy.id;
  }, [adapter]);

  const getSaved = useCallback(
    (id: string) => savedDesigns.find((s) => s.id === id),
    [savedDesigns]
  );

  const loadSaved = useCallback(
    async (id: string) => {
      const found = (await adapter.read()).find((d) => d.id === id);
      if (!found) return false;

      const s = found.snapshot || {};

      // 1. set base theme + metadata + title
      if (s.baseThemeCode) {
        useDesignStore.getState().setBaseTheme(s.baseThemeCode, {
          sourceTemplateId: s.baseThemeMetadata?.sourceTemplateId,
          title: s.title,
        });
      }

      // 2. clear visual edits and code overrides
      useDesignStore.getState().removeAllVisualToolsEdits("all");
      useDesignStore.getState().removeAllCodeOverrides();

      // 3. re-apply visual edits
      const add = useDesignStore.getState().addVisualToolEdit;
      if (s.colorSchemeIndependentVisualToolEdits) {
        Object.entries(s.colorSchemeIndependentVisualToolEdits).forEach(([k, v]) => {
          try {
            add(k, v);
          } catch (e) {
            void e;
            /* ignore per-path errors */
          }
        });
      }

      if (s.light?.visualToolEdits) {
        Object.entries(s.light.visualToolEdits).forEach(([k, v]) => {
          try {
            add(k, v);
          } catch (e) { void e; }
        });
      }

      if (s.dark?.visualToolEdits) {
        Object.entries(s.dark.visualToolEdits).forEach(([k, v]) => {
          try {
            add(k, v);
          } catch (e) { void e; }
        });
      }

      // 4. apply code overrides if present
      if (s.codeOverridesSource) {
        try {
          useDesignStore.getState().applyCodeOverrides(s.codeOverridesSource);
        } catch (e) { void e; }
      }

      // 5. set active color scheme if present
      if (s.activeColorScheme) {
        try {
          useDesignStore.getState().setActiveColorScheme(s.activeColorScheme as any);
        } catch (e) { void e; }
      }

      // ensure unsaved flag is false after load
      try {
        useDesignStore.setState({ hasUnsavedChanges: false });
      } catch (e) { void e; }

      return true;
    },
    [adapter]
  );

  const exportAll = useCallback(
    async () => JSON.stringify(await adapter.read(), null, 2),
    [adapter]
  );

  const importAll = useCallback(
    async (json: string, opts?: { merge?: boolean }) => {
      try {
        const parsed = JSON.parse(json);
        if (!Array.isArray(parsed)) return { imported: 0, skipped: 0 };
        const before = await adapter.read();
        const merged = opts?.merge ? [...parsed, ...before] : parsed;
        const next = (merged as SavedDesign[]).slice(0, MAX_SAVED);
        await adapter.write(next);
        setSavedDesigns(next);
        return { imported: next.length, skipped: 0 };
      } catch {
        return { imported: 0, skipped: 0 };
      }
    },
    [adapter]
  );

  const clearAll = useCallback(async () => {
    await adapter.clear();
    setSavedDesigns([]);
  }, [adapter]);

  return {
    savedDesigns,
    saveCurrent,
    loadSaved,
    removeSaved,
    duplicateSaved,
    exportAll,
    importAll,
    clearAll,
    getSaved,
  } as const;
}
