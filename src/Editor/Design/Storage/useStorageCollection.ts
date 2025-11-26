import useEdit from "../Edit/useEdit";
import useStorage from "./useStorage";
import useCreatedThemeOption from "../Edit/useCreatedThemeOption";
import useDeveloperToolActions from "../Edit/useDeveloperToolActions";
import { useCallback, useEffect, useState } from "react";
import { useEditWithDesignerTools } from "../Edit/useEditWithDesignerTools";
import type { StorageAdapter } from "./storageAdapters";
import { deviceStorageAdapter } from "./storageAdapters";
import type { SavedToStorageDesign } from "./types";
import { MAX_SAVED } from "./types";

export default function useStorageCollection(
  adapter: StorageAdapter = deviceStorageAdapter
) {
  const [savedDesigns, setSavedDesigns] = useState<SavedToStorageDesign[]>([]);

  const loadNewDesign = useEdit((s) => s.loadNew);
  const acknowledgeStoredVersion = useEdit((s) => s.acknowledgeStoredVersion);
  const setActiveColorScheme = useEdit((s) => s.setActiveColorScheme);
  const { addGlobalVisualEdit } = useEditWithDesignerTools();
  const { applyModifications } = useDeveloperToolActions();
  const createdThemeOptions = useCreatedThemeOption();

  const setStatus = useStorage((s) => s.setStatus);
  const recordLastStored = useStorage((s) => s.recordLastStored);

  const saveCurrent = useCallback(
    async (opts?: { title?: string; includeSession?: boolean }) => {
      setStatus("loading");

      const state = useEdit.getState();
      const title = opts?.title ?? state.title ?? "Untitled";

      // Primary data: the merged/created ThemeOptions as JSON string
      const themeOptionsCode = JSON.stringify(createdThemeOptions, null, 2);

      // Optional session data for restoring editor state
      const session =
        opts?.includeSession !== false
          ? {
              activeColorScheme: state.activeColorScheme,
              colorSchemeIndependentVisualToolEdits:
                state.colorSchemeIndependentVisualToolEdits,
              light: {
                visualToolEdits: state.colorSchemes?.light?.visualToolEdits || {},
              },
              dark: {
                visualToolEdits: state.colorSchemes?.dark?.visualToolEdits || {},
              },
              codeOverridesSource: state.codeOverridesSource,
            }
          : undefined;

      const before = await adapter.read();

      // Check for existing saved design with the same title (case-sensitive).
      // Titles are treated as unique identifiers for saved items.
      const existingIndex = before.findIndex((d) => d.title === title);

      let newItem: SavedToStorageDesign;

      if (existingIndex !== -1) {
        // Update existing
        const existing = before[existingIndex];
        newItem = {
          ...existing,
          themeOptionsCode,
          session: session ?? existing.session,
          updatedAt: Date.now(),
          title,
        };

        // Move updated item to front
        const next = [
          newItem,
          ...before.slice(0, existingIndex),
          ...before.slice(existingIndex + 1),
        ].slice(0, MAX_SAVED);

        await adapter.write(next);
        setSavedDesigns(next);
        // mark domain as stored
        acknowledgeStoredVersion();
        // record storage success + timestamp
        recordLastStored();
        return newItem.id;
      }

      // Create new
      const id = crypto.randomUUID();
      newItem = {
        id,
        title,
        createdAt: Date.now(),
        themeOptionsCode,
        session,
      };

      const next = [newItem, ...before].slice(0, MAX_SAVED);
      await adapter.write(next);
      setSavedDesigns(next);
      // mark domain as stored
      acknowledgeStoredVersion();
      // record storage success + timestamp
      recordLastStored();
      return newItem.id;
    },
    [
      adapter,
      createdThemeOptions,
      acknowledgeStoredVersion,
      recordLastStored,
      setStatus,
    ]
  );

  const removeSaved = useCallback(
    async (id: string) => {
      setStatus("loading");
      try {
        const before = await adapter.read();
        const next = before.filter((d) => d.id !== id);
        if (next.length === before.length) return false;
        await adapter.write(next);
        setSavedDesigns(next);

        // If the deleted design is the one currently open in the editor,
        // load the next saved design (if any) or fall back to an untitled blank.
        try {
          const state = useEdit.getState();
          const currentSourceId = (state as any).sourceTemplateId as string | undefined;
          if (currentSourceId === id) {
            if (next.length > 0) {
              const first = next[0];
              loadNewDesign(first.themeOptionsCode, {
                title: first.title,
                sourceTemplateId: first.id,
              });
            } else {
              loadNewDesign("", { title: "Untitled" });
            }
          }
        } catch (e) {
          void e;
        }

        return true;
      } catch (e) {
        setStatus("error", String(e));
        throw e;
      } finally {
        setStatus("idle");
      }
    },
    [adapter, setStatus, loadNewDesign]
  );

  const duplicateSaved = useCallback(
    async (id: string) => {
      const before = await adapter.read();
      const found = before.find((d) => d.id === id);

      if (!found) {
        return null;
      }

      const rawTitle = found.title || "Untitled";
      const normalizedBase =
        rawTitle.replace(/\s*\(copy(?:\s*\d+)?\)\s*$/i, "").trim() || "Untitled";

      function escapeRegExp(s: string) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }

      const copyPattern = new RegExp(
        `^${escapeRegExp(normalizedBase)}\\s*\\(copy(?:\\s*\\d+)?\\)$`,
        "i"
      );
      const existingCopies = before
        .map((d) => d.title)
        .filter(Boolean)
        .filter((t) => !!t && copyPattern.test(t));

      let copyTitle = `${normalizedBase} (copy)`;
      if (existingCopies.length > 0) {
        // find highest numbered copy
        let max = 0;
        for (const t of existingCopies) {
          const m = t!.match(/\(copy(?:\s*(\d+))?\)$/i);
          if (m) {
            const n = m[1] ? parseInt(m[1], 10) : 1;
            if (n > max) max = n;
          }
        }
        const next = max === 0 ? 2 : max + 1;
        copyTitle = `${normalizedBase} (copy ${next})`;
      }

      const copy: SavedToStorageDesign = {
        id: Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8),
        title: copyTitle,
        createdAt: Date.now(),
        themeOptionsCode: found.themeOptionsCode,
        session: found.session
          ? JSON.parse(JSON.stringify(found.session))
          : undefined,
      };

      const next = [copy, ...before].slice(0, MAX_SAVED);
      await adapter.write(next);
      setSavedDesigns(next);
      return copy.id;
    },
    [adapter]
  );

  const loadSaved = async (id: string) => {
    try {
      setStatus("loading");
      const found = savedDesigns.find((d) => d.id === id);

      if (!found) {
        setStatus("error");
        return false;
      }

      // 1) Load the themeOptionsCode as the base theme
      loadNewDesign(found.themeOptionsCode, {
        title: found.title,
        sourceTemplateId: found.id,
      });

      // 2) Restore session data if present
      const session = found.session;
      if (session) {
        // Re-apply color-scheme-independent visual edits
        if (session.colorSchemeIndependentVisualToolEdits) {
          Object.entries(session.colorSchemeIndependentVisualToolEdits).forEach(
            ([k, v]) => {
              try {
                addGlobalVisualEdit(k, v as any);
              } catch (e) {
                void e;
              }
            }
          );
        }

        // Re-apply light mode visual edits
        if (session.light?.visualToolEdits) {
          Object.entries(session.light.visualToolEdits).forEach(([k, v]) => {
            try {
              addGlobalVisualEdit(k, v as any);
            } catch (e) {
              void e;
            }
          });
        }

        // Re-apply dark mode visual edits
        if (session.dark?.visualToolEdits) {
          Object.entries(session.dark.visualToolEdits).forEach(([k, v]) => {
            try {
              addGlobalVisualEdit(k, v as any);
            } catch (e) {
              void e;
            }
          });
        }

        // Apply code overrides if present
        if (session.codeOverridesSource) {
          try {
            applyModifications(session.codeOverridesSource);
          } catch (e) {
            void e;
          }
        }

        // Set active color scheme if present
        if (session.activeColorScheme) {
          try {
            setActiveColorScheme(session.activeColorScheme);
          } catch (e) {
            void e;
          }
        }
      }

      acknowledgeStoredVersion();
      recordLastStored();
      return true;
    } catch (e) {
      setStatus("error", String(e));
      throw e;
    }
  };

  const exportAll = useCallback(
    async () => JSON.stringify(await adapter.read(), null, 2),
    [adapter]
  );

  const importAll = useCallback(
    async (json: string, opts?: { merge?: boolean }) => {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) return { imported: 0, skipped: 0 };
      const before = await adapter.read();
      const merged = opts?.merge ? [...parsed, ...before] : parsed;
      const next = (merged as SavedToStorageDesign[]).slice(0, MAX_SAVED);
      await adapter.write(next);
      setSavedDesigns(next);
    },
    [adapter]
  );

  const clearAll = useCallback(async () => {
    await adapter.clear();
    setSavedDesigns([]);
  }, [adapter]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (mounted) {
        const items = await adapter.read();
        setSavedDesigns(items);
      }
    }

    init();

    // listen for storage events to keep multiple tabs in sync
    const onStorage = async () => {
      const items = await adapter.read();
      setSavedDesigns(items);
    };

    window.addEventListener("storage", onStorage);

    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
    };
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
  };
}
