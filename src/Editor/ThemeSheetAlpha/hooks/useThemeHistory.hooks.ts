import { useThemeSheetStore } from '../stores/themeWorkspace.store';

/**
 * Hook for managing theme modification history (undo/redo).
 * 
 * Provides access to undo, redo, and clear operations along with
 * state information about whether these operations are available.
 * 
 * @example
 * ```tsx
 * function HistoryControls() {
 *   const { undo, redo, canUndo, canRedo, clearHistory } = useThemeSheetHistory();
 *   
 *   return (
 *     <>
 *       <button onClick={undo} disabled={!canUndo}>Undo</button>
 *       <button onClick={redo} disabled={!canRedo}>Redo</button>
 *     </>
 *   );
 * }
 * ```
 */
export const useThemeSheetHistory = () => {
  const temporalState = useThemeSheetStore.temporal.getState();
  
  const canUndo = temporalState.pastStates.length > 0;
  const canRedo = temporalState.futureStates.length > 0;
  const historySize = temporalState.pastStates.length;

  return {
    /**
     * Undo the last committed change.
     * Only works if there are past states available.
     */
    undo: temporalState.undo,

    /**
     * Redo the previously undone change.
     * Only works if there are future states available.
     */
    redo: temporalState.redo,

    /**
     * Clear all history (past and future states).
     * Use with caution - this cannot be undone!
     */
    clearHistory: temporalState.clear,

    /**
     * Whether undo operation is available.
     * True if there are past states to undo to.
     */
    canUndo,

    /**
     * Whether redo operation is available.
     * True if there are future states to redo to.
     */
    canRedo,

    /**
     * Number of past states in history.
     * Useful for displaying history depth to users.
     */
    historySize,

    /**
     * Whether the current state has uncommitted changes.
     * True when rawThemeOptionsModifications differs from resolved.
     */
    isDirty: useThemeSheetStore.getState().isDirty,
  };
};

