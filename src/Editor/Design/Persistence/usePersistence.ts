/**
 * Persistence Orchestrator Hook
 * 
 * Zero-argument hook that orchestrates save/load operations.
 * Fetches dependencies from registry and performs I/O operations.
 * Updates the pure persistence store via setters.
 */

import { useCallback } from 'react';
import { usePersistenceStore } from './persistenceStore';
import { useEdit } from '../Edit/useEdit';
import type { SaveOptions, LoadOptions, EditCommand, PersistenceError } from './types';
import { getPersistenceDependencies } from './persistenceRegistry';

/**
 * Apply edit command to the edit store
 */
function applyEditCommand(editStore: any, command: EditCommand): void {
  switch (command.type) {
    case 'set-base-theme':
      // TODO: implement when setBaseThemeOption is available
      console.warn('set-base-theme not yet implemented', command);
      break;
      
    case 'set-title':
      if (editStore.setTitle) {
        editStore.setTitle(command.title);
      }
      break;
      
    case 'apply-neutral-edit':
      if (editStore.addGlobalDesignerEdit) {
        editStore.addGlobalDesignerEdit(command.path, command.value);
      }
      break;
      
    case 'apply-scheme-edit':
      if (editStore.addSchemeDesignerEdit) {
        editStore.addSchemeDesignerEdit(command.scheme, command.path, command.value);
      }
      break;
      
    case 'apply-code-overrides':
      if (editStore.setCodeOverrides) {
        editStore.setCodeOverrides(
          command.source,
          command.dsl,
          command.flattened,
          null
        );
      }
      break;
      
    case 'set-active-scheme':
      if (editStore.setActiveColorScheme) {
        editStore.setActiveColorScheme(command.scheme);
      }
      break;
      
    case 'set-checkpoint':
      if (editStore.setCheckpoint) {
        editStore.setCheckpoint(command.hash);
      }
      break;
  }
}

export function usePersistence() {
  const { setStatus, setError, setSnapshotId, setLastSavedAt, setCollection } = usePersistenceStore();

  const save = useCallback(async (options: SaveOptions = { mode: 'update-or-create' }) => {
    let deps;
    try {
      deps = getPersistenceDependencies();
    } catch (e: any) {
      const err: PersistenceError = { 
        code: 'INIT_ERROR', 
        message: e.message 
      };
      setError(err);
      throw err;
    }

    const { adapter, serializer } = deps;

    setStatus('saving');
    setError(null);

    try {
      const editState = useEdit.getState();
      const currentSnapshotId = usePersistenceStore.getState().currentSnapshotId;
      
      // Serialize current edit state
      const snapshot = serializer.serialize(editState, {
        id: options.snapshotId ?? currentSnapshotId ?? undefined,
        title: options.title ?? editState.title,
        strategy: options.strategy,
      });

      // Conflict detection
      let targetId = snapshot.id; // Start with current snapshot ID (if updating existing)
      
      if (options.onConflict !== 'overwrite') {
        const existing = await adapter.findByTitle(snapshot.title);
        const conflict = existing.find((m: any) => m.id !== snapshot.id);
        if (conflict && options.onConflict === 'fail') {
          const err: PersistenceError = { 
            code: 'CONFLICT', 
            message: 'Title already exists', 
            context: { conflict } 
          };
          setStatus('error');
          setError(err);
          throw err;
        }
      } else {
        // onConflict === 'overwrite': find existing design with same title and use its ID
        const existing = await adapter.findByTitle(snapshot.title);
        const conflict = existing.find((m: any) => m.id !== snapshot.id);
        if (conflict) {
          // Overwrite the existing design by using its ID
          targetId = conflict.id;
        }
      }

      // Persist with transaction support
      const saved = await adapter.transaction(async (tx: any) => {
        return targetId 
          ? await tx.update(targetId, { ...snapshot, id: targetId }) 
          : await tx.create(snapshot);
      });

      // Update reactive state
      setStatus('idle');
      setSnapshotId(saved.id);
      setLastSavedAt(Date.now());

      // Refresh collection to keep it in sync
      try {
        const { adapter } = getPersistenceDependencies();
        const items = await adapter.list();
        setCollection(items);
      } catch (collectionError) {
        console.error('Failed to refresh collection after save:', collectionError);
        // Don't throw - save was successful, just collection is stale
      }

      // Set domain checkpoint
      const editStore = useEdit.getState();
      if ((editStore as any).setCheckpoint) {
        (editStore as any).setCheckpoint(saved.checkpointHash);
      }

      return saved;
    } catch (error: any) {
      const persistenceError: PersistenceError = { 
        code: error.code ?? 'UNKNOWN', 
        message: error.message ?? String(error) 
      };
      setStatus('error');
      setError(persistenceError);
      throw persistenceError;
    }
  }, [setError, setStatus, setSnapshotId, setLastSavedAt, setCollection]);

  const load = useCallback(async (id: string, options: LoadOptions = { mode: 'replace' }) => {
    let deps;
    try {
      deps = getPersistenceDependencies();
    } catch (e: any) {
      const err: PersistenceError = { 
        code: 'INIT_ERROR', 
        message: e.message 
      };
      setError(err);
      throw err;
    }

    const { adapter, deserializer } = deps;

    setStatus('loading');
    setError(null);

    try {
      const snapshot = await adapter.get(id);
      if (!snapshot) {
        const err: PersistenceError = { 
          code: 'INVALID_DATA', 
          message: 'Snapshot not found' 
        };
        throw err;
      }

      const commands = deserializer.deserialize(snapshot);
      const editStore = useEdit.getState();

      // For replace mode, batch-clear state without triggering intermediate renders
      if (options.mode === 'replace') {
        editStore.clearHistory?.();  // Clear undo/redo stacks
      }

      // Apply all commands to restore the design
      commands.forEach((cmd: EditCommand) => applyEditCommand(editStore, cmd));

      // Set checkpoint AFTER all edits applied to mark as "fully saved"
      if ((editStore as any).setCheckpoint) {
        (editStore as any).setCheckpoint((editStore as any).contentHash);
      }

      setStatus('idle');
      setSnapshotId(snapshot.id);
      setLastSavedAt(snapshot.updatedAt ?? Date.now());
    } catch (error: any) {
      const persistenceError: PersistenceError = { 
        code: error.code ?? 'UNKNOWN', 
        message: error.message ?? String(error) 
      };
      setStatus('error');
      setError(persistenceError);
      throw persistenceError;
    }
  }, [setError, setStatus, setSnapshotId, setLastSavedAt]);

  return { 
    save, 
    load, 
    status: usePersistenceStore((s) => s.status), 
    error: usePersistenceStore((s) => s.error) 
  };
}
