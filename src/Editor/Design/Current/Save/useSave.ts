import { useCallback } from 'react';
import { useCurrent } from '../useCurrent';
import { useIsSavedDesignDirty } from './useIsSavedDesignDirty';
import { useCollectionStore } from "../../Collection";
import { useStorage } from "../../storage/useStorage";
import type {
  SaveOptions,
  PersistenceError,
} from "../useCurrent/types";

export function useSave() {
  const storage = useStorage();
  const setSaveStatus = useCurrent((s) => s.setSaveStatus);
  const setError = useCurrent((s) => s.setPersistenceError);
  const setSnapshotId = useCurrent((s) => s.setPersistenceSnapshotId);
  const setLastSavedAt = useCurrent((s) => s.setPersistedAt);
  const setCollection = useCollectionStore((s) => s.setCollection);
  
  const saveStatus = useCurrent((s) => s.saveStatus);
  const currentSnapshotId = useCurrent((s) => s.persistenceSnapshotId);
  const error = useCurrent((s) => s.persistenceError);
  
  const isDirty = useIsSavedDesignDirty();
  
  const save = useCallback(
    async (options: SaveOptions = { mode: "update-or-create" }) => {
      const { adapter, serializer } = storage;

      setSaveStatus("saving");
      setError(null);

      try {
        // Capture edit state at START of save to prevent race conditions
        const editState = useCurrent.getState();
        const currentSnapshotId = editState.persistenceSnapshotId;
        const capturedContentHash = (editState as any).contentHash;

        // Serialize current edit state
        const snapshot = serializer.serialize(editState, {
          id: options.snapshotId ?? currentSnapshotId ?? undefined,
          title: options.title ?? editState.title,
          strategy: options.strategy,
        });

        // Conflict detection
        const targetId = snapshot.id;
        let conflictToDelete: string | null = null;

        if (options.onConflict !== "overwrite") {
          const existing = await adapter.findByTitle(snapshot.title);
          const conflict = existing.find((m: any) => m.id !== snapshot.id);
          if (conflict && options.onConflict === "fail") {
            const err: PersistenceError = {
              code: "CONFLICT",
              message: "Title already exists",
              context: { conflict },
            };
            setSaveStatus("error");
            setError(err);
            throw err;
          }
        } else {
          const existing = await adapter.findByTitle(snapshot.title);
          const conflict = existing.find((m: any) => m.id !== snapshot.id);
          if (conflict) {
            conflictToDelete = conflict.id;
          }
        }

        // Persist with transaction support
        const saved = await adapter.transaction(async (tx: any) => {
          if (conflictToDelete) {
            await tx.delete(conflictToDelete);
          }
          
          return targetId
            ? await tx.update(targetId, { ...snapshot, id: targetId })
            : await tx.create(snapshot);
        });

        // Update reactive state
        setSaveStatus("saved");
        setSnapshotId(saved.id);
        setLastSavedAt(Date.now());

        // Create version if this is an update to an existing design and content changed
        const isUpdate = !!currentSnapshotId;
        const contentChanged = editState.checkpointHash !== capturedContentHash;
        if (isUpdate && contentChanged) {
          try {
            await adapter.createVersion(saved.id, saved);
          } catch (versionError) {
            console.error("Failed to create version:", versionError);
            // Non-fatal - save still succeeded
          }
        }

        // Refresh collection to keep it in sync
        try {
          const items = await storage.adapter.list();
          setCollection(items);
        } catch (collectionError) {
          console.error("Failed to refresh collection after save:", collectionError);
        }

        // Set checkpoint using the captured hash from save START
        const editStore = useCurrent.getState();
        if ((editStore as any).setCheckpoint) {
          (editStore as any).setCheckpoint(capturedContentHash);
        }

        return saved;
      } catch (error: any) {
        const persistenceError: PersistenceError = {
          code: error.code ?? "UNKNOWN",
          message: error.message ?? String(error),
        };
        setSaveStatus("error");
        setError(persistenceError);
        throw persistenceError;
      }
    },
    [setError, setSaveStatus, setSnapshotId, setLastSavedAt, setCollection, storage]
  );
  
  // Can save if not currently saving and either dirty or new design
  const canSave = saveStatus !== 'saving' && (isDirty || !currentSnapshotId);
  
  return { 
    save, 
    status: saveStatus,
    canSave, 
    isDirty,
    error
  };
}
