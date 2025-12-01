/**
 * Persistence Store (Pure Zustand)
 * 
 * Pure reactive state container for persistence operations.
 * No side effects - only setters for updating state.
 */

import { create } from 'zustand';
import type { PersistenceState, ThemeSnapshotMetadata, PersistenceError } from './types';

export interface PersistenceActions {
  setStatus: (status: PersistenceState['status']) => void;
  setError: (error: PersistenceError | null) => void;
  setSnapshotId: (id: string | null) => void;
  setLastSavedAt: (timestamp: number | null) => void;
  setCollection: (items: ThemeSnapshotMetadata[]) => void;
  reset: () => void;
}

export type PersistenceStore = PersistenceState & PersistenceActions;

const initialState: PersistenceState = {
  status: 'idle',
  error: null,
  currentSnapshotId: null,
  lastSavedAt: null,
  collection: [],
};

export const usePersistenceStore = create<PersistenceStore>((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),
  
  setError: (error) => set({ error }),
  
  setSnapshotId: (currentSnapshotId) => set({ currentSnapshotId }),
  
  setLastSavedAt: (lastSavedAt) => set({ lastSavedAt }),
  
  setCollection: (collection) => set({ collection }),
  
  reset: () => set(initialState),
}));
