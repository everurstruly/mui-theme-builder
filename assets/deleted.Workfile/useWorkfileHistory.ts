// Removed: deprecated helper that used zundo/temporal
// This file is retained for history but its temporal usage was removed.
export default function useWorkfile() {
  return {
    undo: () => undefined,
    redo: () => undefined,
    clearHistory: () => undefined,
    canUndo: false,
    canRedo: false,
  };
}
