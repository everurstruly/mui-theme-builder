import { useReducer, useEffect } from "react";

// Scene definitions
export type ConflictScene = "choose" | "rename" | "confirm-overwrite" | "closed";

// State shape
interface ConflictState {
  scene: ConflictScene;
  errorMessage: string | null;
  attemptedTitle: string | null;
}

// Actions that can trigger transitions
type ConflictAction =
  | { type: "OPEN"; mode?: "choose" | "rename" }
  | { type: "CHOOSE_SAVE_AS_NEW" }
  | { type: "CHOOSE_OVERWRITE" }
  | { type: "CONFIRM_OVERWRITE" }
  | { type: "SUBMIT_NEW_TITLE"; title: string }
  | { type: "CONFLICT_ERROR"; title: string; message: string }
  | { type: "CANCEL" }
  | { type: "CLOSE" };

// Initial state
const initialState: ConflictState = {
  scene: "closed",
  errorMessage: null,
  attemptedTitle: null,
};

// State machine reducer
function conflictReducer(
  state: ConflictState,
  action: ConflictAction
): ConflictState {
  switch (action.type) {
    case "OPEN":
      return {
        ...state,
        scene: action.mode === "rename" ? "rename" : "choose",
        errorMessage: null,
      };

    case "CHOOSE_SAVE_AS_NEW":
      return {
        ...state,
        scene: "rename",
        errorMessage: null,
        attemptedTitle: null,
      };

    case "CHOOSE_OVERWRITE":
      return {
        ...state,
        scene: "confirm-overwrite",
      };

    case "CONFIRM_OVERWRITE":
      // Let parent handle actual overwrite, we just close
      return {
        ...state,
        scene: "closed",
        errorMessage: null,
        attemptedTitle: null,
      };

    case "SUBMIT_NEW_TITLE":
      // Let parent handle save, we prepare for potential conflict
      return {
        ...state,
        attemptedTitle: action.title,
      };

    case "CONFLICT_ERROR":
      // Stay in rename scene, show error, prefill attempted title
      return {
        ...state,
        scene: "rename",
        errorMessage: action.message,
        attemptedTitle: action.title,
      };

    case "CANCEL":
    case "CLOSE":
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

interface UseSaveConflictFlowProps {
  open: boolean;
  initialMode?: "choose" | "rename";
  onOverwrite: () => void;
  onSaveAsNew: (title: string) => void;
  onClose: () => void;
}

export function useSaveConflictFlow({
  open,
  initialMode,
  onOverwrite,
  onSaveAsNew,
  onClose,
}: UseSaveConflictFlowProps) {
  const [state, dispatch] = useReducer(conflictReducer, initialState);

  // Sync external open state with internal state machine
  useEffect(() => {
    if (open) {
      dispatch({ type: "OPEN", mode: initialMode });
    } else {
      dispatch({ type: "CLOSE" });
    }
  }, [open, initialMode]);

  // Actions exposed to UI
  const actions = {
    chooseSaveAsNew: () => dispatch({ type: "CHOOSE_SAVE_AS_NEW" }),
    
    chooseOverwrite: () => dispatch({ type: "CHOOSE_OVERWRITE" }),
    
    confirmOverwrite: () => {
      dispatch({ type: "CONFIRM_OVERWRITE" });
      onOverwrite();
    },
    
    submitNewTitle: (title: string) => {
      dispatch({ type: "SUBMIT_NEW_TITLE", title });
      onSaveAsNew(title);
    },
    
    reportConflictError: (title: string, message: string) => {
      dispatch({ type: "CONFLICT_ERROR", title, message });
    },
    
    cancel: () => {
      dispatch({ type: "CANCEL" });
      onClose();
    },
  };

  return {
    scene: state.scene,
    errorMessage: state.errorMessage,
    attemptedTitle: state.attemptedTitle,
    actions,
    // Helper to check if a specific scene is active
    isOpen: open && state.scene !== "closed",
  };
}
