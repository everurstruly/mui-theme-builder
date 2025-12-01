/**
 * useSave Hook
 * 
 * User-facing hook for save operations.
 * Exposes semantic save state machine + dirty tracking.
 * 
 * Status values are mutually exclusive:
 * - 'idle': ready to save or no changes
 * - 'saving': currently persisting to storage
 * - 'saved': most recent save completed successfully
 */

import { useMemo } from 'react';
import { usePersistence } from '../usePersistence';
import { usePersistenceStore } from '../persistenceStore';
import { useEdit } from '../../Edit/useEdit';

type SaveStatus = 'idle' | 'saving' | 'saved';

export function useSave() {
  const { save } = usePersistence();
  const persistenceStatus = usePersistenceStore((s) => s.status);
  const currentSnapshotId = usePersistenceStore((s) => s.currentSnapshotId);
  const error = usePersistenceStore((s) => s.error);
  
  // Design is dirty if:
  // Content changed since last save (contentHash !== checkpointHash)
  // NOTE: Brand new designs (checkpointHash === null) are NOT considered dirty
  const isDirty = useEdit((s) => {
    const checkpointHash = (s as any).checkpointHash;
    const contentHash = (s as any).contentHash;
    return checkpointHash !== null && contentHash !== checkpointHash;
  });
  
  // Map low-level persistence status to high-level save status
  // Persistence 'error' state is transient (conflict dialog), maps to 'idle' for button
  const status: SaveStatus = useMemo(() => {
    if (persistenceStatus === 'saving') return 'saving';
    // Only show 'saved' if there are no unsaved changes AND it's been saved before
    if (persistenceStatus === 'idle' && !isDirty && currentSnapshotId !== null) return 'saved';
    return 'idle';
  }, [persistenceStatus, isDirty, currentSnapshotId]);
  
  // Can save if:
  // 1. Status is idle (not already saving), AND
  // 2. Either the design is dirty, OR it's a new design (no snapshotId)
  const canSave = status !== 'saving' && (isDirty || !currentSnapshotId);
  
  return { 
    save, 
    status,
    canSave, 
    isDirty,
    error
  };
}
