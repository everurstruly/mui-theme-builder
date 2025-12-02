import { useCallback } from "react";
import { usePersistenceStore } from "./persistenceStore";
import { useCurrent, type CurrentDesignStore } from "../Current/useCurrent";
import type {
  SaveOptions,
  LoadOptions,
  EditCommand,
  PersistenceError,
} from "./types";
import { getPersistenceDependencies } from "./persistenceRegistry";

/**
 * Apply edit command to the edit store
 */
function applyEditCommand(
  editStore: CurrentDesignStore,
  command: EditCommand
): void {
  switch (command.type) {
    case "set-base-theme":
      editStore.setBaseThemeOption?.(command.dsl, command.metadata);
      break;

    case "set-title":
      editStore.setTitle(command.title);
      break;

    case "apply-neutral-edit":
      editStore.addNeutralDesignerEdit(command.path, command.value);
      break;

    case "apply-scheme-edit":
      editStore.addSchemeDesignerEdit(command.scheme, command.path, command.value);
      break;

    case "apply-code-overrides":
      editStore.setCodeOverrides(
        command.source,
        command.dsl,
        command.flattened,
        null
      );
      break;

    case "set-active-scheme":
      editStore.setActiveColorScheme(command.scheme);
      break;

    case "set-checkpoint":
      editStore.setCheckpoint(command.hash);
      break;
  }
}

export function usePersistence() {
  const { setStatus, setError, setSnapshotId, setLastSavedAt, setCollection } =
    usePersistenceStore();

  const save = useCallback(
    async (options: SaveOptions = { mode: "update-or-create" }) => {
      let deps;
      try {
        deps = getPersistenceDependencies();
      } catch (e: any) {
        const err: PersistenceError = {
          code: "INIT_ERROR",
          message: e.message,
        };
        setError(err);
        throw err;
      }

      const { adapter, serializer } = deps;

      setStatus("saving");
      setError(null);

      try {
        // Capture edit state at START of save to prevent race conditions
        const editState = useCurrent.getState();
        const currentSnapshotId = usePersistenceStore.getState().currentSnapshotId;
        const capturedContentHash = (editState as any).contentHash; // Freeze the hash at save start

        // Serialize current edit state
        const snapshot = serializer.serialize(editState, {
          id: options.snapshotId ?? currentSnapshotId ?? undefined,
          title: options.title ?? editState.title,
          strategy: options.strategy,
        });

        // Conflict detection
        const targetId = snapshot.id; // Start with current snapshot ID (if updating existing)
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
            setStatus("error");
            setError(err);
            throw err;
          }
        } else {
          // onConflict === 'overwrite': mark conflicting design for deletion
          const existing = await adapter.findByTitle(snapshot.title);
          const conflict = existing.find((m: any) => m.id !== snapshot.id);
          if (conflict) {
            conflictToDelete = conflict.id;
          }
        }

        // Persist with transaction support
        const saved = await adapter.transaction(async (tx: any) => {
          // Delete conflicting design first if overwriting
          if (conflictToDelete) {
            await tx.delete(conflictToDelete);
          }
          
          return targetId
            ? await tx.update(targetId, { ...snapshot, id: targetId })
            : await tx.create(snapshot);
        });

        // Update reactive state
        setStatus("idle");
        setSnapshotId(saved.id);
        setLastSavedAt(Date.now());

        // Refresh collection to keep it in sync
        try {
          const { adapter } = getPersistenceDependencies();
          const items = await adapter.list();
          setCollection(items);
        } catch (collectionError) {
          console.error("Failed to refresh collection after save:", collectionError);
          // Don't throw - save was successful, just collection is stale
        }

        // Set checkpoint using the captured hash from save START, not save END
        // This prevents race condition where user makes changes during save
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
        setStatus("error");
        setError(persistenceError);
        throw persistenceError;
      }
    },
    [setError, setStatus, setSnapshotId, setLastSavedAt, setCollection]
  );

  const load = useCallback(
    async (id: string, options: LoadOptions = { mode: "replace" }) => {
      let deps;
      try {
        deps = getPersistenceDependencies();
      } catch (e: any) {
        const err: PersistenceError = {
          code: "INIT_ERROR",
          message: e.message,
        };
        setError(err);
        throw err;
      }

      const { adapter, deserializer } = deps;

      setStatus("loading");
      setError(null);

      try {
        const snapshot = await adapter.get(id);
        if (!snapshot) {
          const err: PersistenceError = {
            code: "INVALID_DATA",
            message: "Snapshot not found",
          };
          throw err;
        }

        const commands = deserializer.deserialize(snapshot);
        const editStore = useCurrent.getState();

        // For replace mode, batch-clear state without triggering intermediate renders
        if (options.mode === "replace") {
          editStore.clearHistory?.(); // Clear undo/redo stacks
        }

        // BATCH: Suppress hash recomputation during deserialization
        const originalSet = useCurrent.setState;
        let batchedUpdates: any = {};
        
        useCurrent.setState = (update: any) => {
          const resolved = typeof update === 'function' ? update(useCurrent.getState()) : update;
          batchedUpdates = { ...batchedUpdates, ...resolved };
        };

        // Apply all commands (they'll batch into batchedUpdates)
        commands.forEach((cmd: EditCommand) => applyEditCommand(editStore, cmd));
        
        // Restore original setState
        useCurrent.setState = originalSet;
        
        // Now apply all updates at once and compute final hash
        originalSet(batchedUpdates);
        
        // Capture the final content hash AFTER all edits applied
        const finalContentHash = (useCurrent.getState() as any).contentHash;

        console.log('[LOAD DEBUG] After applying commands:', JSON.stringify({
          finalContentHash,
          storedCheckpoint: snapshot.checkpointHash,
          match: finalContentHash === snapshot.checkpointHash
        }));

        // Set checkpoint to the NEW hash (ignore old format checkpoints from storage)
        // This effectively marks old saves as "clean" with the new hash on first load
        if ((editStore as any).setCheckpoint) {
          (editStore as any).setCheckpoint(finalContentHash);
        }

        // Update reactive state: snapshot id and last saved timestamp
        setSnapshotId(snapshot.id);
        setLastSavedAt(snapshot.updatedAt ?? Date.now());

        // Finally set persistence status to idle so consumers observe a consistent saved state
        setStatus("idle");
      } catch (error: any) {
        const persistenceError: PersistenceError = {
          code: error.code ?? "UNKNOWN",
          message: error.message ?? String(error),
        };
        setStatus("error");
        setError(persistenceError);
        throw persistenceError;
      }
    },
    [setError, setStatus, setSnapshotId, setLastSavedAt]
  );

  return {
    save,
    load,
    status: usePersistenceStore((s) => s.status),
    error: usePersistenceStore((s) => s.error),
  };
}
