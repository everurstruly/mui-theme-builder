import useEdit from "../Edit/useEdit";
import useStorage from "./useStorage";
import { detectTitleConflict, findItemIndex, generateCopyTitle } from "./fsTitle";
import { buildSessionData } from "./sessionBuilder";
import { insertItem, updateItem, limitList, generateId } from "./fsOps";
import { restoreSession } from "./sessionRestorer";
import useCreatedThemeOption from "../Edit/useCreatedThemeOption";
import useDeveloperToolActions from "../Edit/useDeveloperEditTools";
import { useCallback, useState } from "react";
import { useStorageSync } from "./useStorageSync";
import { useEditorStoreSync } from "./useEditorStoreSync";
import { useDesignerEditTools } from "../Edit/useDesignerEditTools";
import type { StorageAdapter } from "./storageAdapters";
import { deviceStorageAdapter } from "./storageAdapters";
import type { SavedToStorageDesign } from "./types";
import { MAX_SAVED } from "./types";

export default function useStorageCollection(
  adapter: StorageAdapter = deviceStorageAdapter
) {
  const [savedDesigns, setSavedDesigns] = useState<SavedToStorageDesign[]>([]);

  const loadNewDesign = useEdit((s) => s.loadNew);
  const acknowledgeStoredVersion = useEdit((s) => s.acknowledgeStoredModifications);
  const recordStoragePoint = useEdit((s) => (s as any).recordStoragePoint);
  const setActiveColorScheme = useEdit((s) => s.setActiveColorScheme);
  const { addGlobalDesignerEdit } = useDesignerEditTools();
  const { applyModifications } = useDeveloperToolActions();
  const createdThemeOptions = useCreatedThemeOption();

  const setStatus = useStorage((s) => s.setStatus);
  const recordLastStored = useStorage((s) => s.recordLastStored);
  const setLastSavedId = useStorage((s) => s.setLastSavedId);

  const saveCurrent = useCallback(
    async (opts?: {
      title?: string;
      includeSession?: boolean;
      overwriteExisting?: boolean;
    }) => {
      setStatus("loading");

      const state = useEdit.getState();
      const title = opts?.title ?? state.title ?? "Untitled";

      // Primary data: the merged/created ThemeOptions as JSON string
      const themeOptionsCode = JSON.stringify(createdThemeOptions, null, 2);

      // Optional session data for restoring editor state
      const session =
        opts?.includeSession !== false ? buildSessionData(state) : undefined;

      const before = await adapter.read();
      let newItem: SavedToStorageDesign;

      const currentSourceId = (useEdit.getState() as any).baseThemeMetadata
        ?.templateId as string | undefined;

      const conflict = detectTitleConflict(before, title, currentSourceId);
      if (conflict) {
        try {
          setStatus("idle");
        } catch (e) {
          void e;
        }
        throw new Error(`TITLE_CONFLICT:${conflict.id}`);
      }

      const existingIndex = findItemIndex(
        before,
        title,
        currentSourceId,
        opts?.overwriteExisting
      );

      if (existingIndex !== -1) {
        const existing = before[existingIndex];
        newItem = {
          ...existing,
          themeOptionsCode,
          session: session ?? existing.session,
          updatedAt: Date.now(),
          title,
        };

        const next = limitList(
          updateItem(before, existingIndex, newItem),
          MAX_SAVED
        );
        await adapter.write(next);
        setSavedDesigns(next);
        acknowledgeStoredVersion();
        recordLastStored(newItem.id);
        try {
          const contentHash = useEdit.getState().contentHash;
          recordStoragePoint?.(contentHash);
        } catch {
          // non-fatal
        }
        return newItem.id;
      }

      // Create new
      const id = generateId();
      newItem = {
        id,
        title,
        createdAt: Date.now(),
        themeOptionsCode,
        session,
      };

      const next = limitList(insertItem(before, newItem), MAX_SAVED);
      await adapter.write(next);
      setSavedDesigns(next);

      // Make the newly-created saved item the editor's source so the UI
      // recognizes it as coming from storage.
      try {
        const state = useEdit.getState();
        state.setBaseThemeOption(state.baseThemeOptionSource, {
          templateId: id,
          title,
        });
      } catch (e) {
        void e;
      }

      acknowledgeStoredVersion();
      recordLastStored(newItem.id);
      try {
        const contentHash = useEdit.getState().contentHash;
        recordStoragePoint?.(contentHash);
      } catch {
        // ignore
      }
      return newItem.id;
    },
    [
      adapter,
      createdThemeOptions,
      acknowledgeStoredVersion,
      recordLastStored,
      setStatus,
      recordStoragePoint,
    ]
  );

  const handlePostDeleteEditorUpdate = useCallback(
    (deletedId: string, nextList: SavedToStorageDesign[]) => {
      try {
        const state = useEdit.getState();
        const currentSourceId = (state as any).baseThemeMetadata?.templateId as
          | string
          | undefined;

        if (currentSourceId === deletedId) {
          if (nextList.length > 0) {
            const first = nextList[0];
            loadNewDesign(first.themeOptionsCode, {
              title: first.title,
              templateId: first.id,
            });
          } else {
            loadNewDesign("", { title: "Untitled" });
          }
        }
      } catch (e) {
        void e;
      }
    },
    [loadNewDesign]
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
        // Delegate application flow (editor update) to a helper
        handlePostDeleteEditorUpdate(id, next);

        return true;
      } catch (e) {
        setStatus("error", String(e));
        throw e;
      } finally {
        setStatus("idle");
      }
    },
    [adapter, setStatus, handlePostDeleteEditorUpdate]
  );

  const duplicateSaved = useCallback(
    async (id: string) => {
      const before = await adapter.read();
      const found = before.find((d) => d.id === id);

      if (!found) {
        return null;
      }

      const rawTitle = found.title || "Untitled";
      const copyTitle = generateCopyTitle(before, rawTitle);

      const copy: SavedToStorageDesign = {
        id: generateId(),
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
        templateId: found.id,
      });

      // 2) Restore session data if present
      const session = found.session;
      if (session) {
        restoreSession(session, {
          addGlobalDesignerEdit,
          applyModifications,
          setActiveColorScheme,
        });
      }

      acknowledgeStoredVersion();
      recordLastStored(found.id);
      try {
        const contentHash = useEdit.getState().contentHash;
        recordStoragePoint?.(contentHash);
      } catch {
        // ignore
      }
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

  useStorageSync(adapter, setSavedDesigns);

  // Keep lastSavedId in sync with the editor's current source id. Subscribe
  // to changes in the editor store so the UI reflects whether the currently
  // open design actually corresponds to an item in storage.
  useEditorStoreSync(savedDesigns, setLastSavedId);

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
