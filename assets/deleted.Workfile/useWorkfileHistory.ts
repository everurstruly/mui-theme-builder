import useWorkfileStore from "./useWorkfileStore";

export default function useWorkfile() {
  const temporalState = useWorkfileStore.temporal.getState();
  const canUndo = temporalState.pastStates.length > 0;
  const canRedo = temporalState.futureStates.length > 0;

  return {
    undo: temporalState.undo,
    redo: temporalState.redo,
    clearHistory: temporalState.clear,
    canUndo,
    canRedo,
  };
}
