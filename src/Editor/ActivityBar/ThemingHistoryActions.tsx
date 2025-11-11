import { Button, ButtonGroup } from "@mui/material";
import { RedoRounded, UndoRounded } from "@mui/icons-material";
import { useThemeDesignStore } from "../ThemeDesign";
import { useEffect, useState } from "react";

export default function ThemingHistoryActions() {
  const { undo, redo } = useThemeDesignStore.temporal.getState();

  // Subscribe to temporal state changes for reactive updates
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const unsubscribe = useThemeDesignStore.temporal.subscribe((state) => {
      setCanUndo(state.pastStates.length > 0);
      setCanRedo(state.futureStates.length > 0);
    });
    // Initial state
    const state = useThemeDesignStore.temporal.getState();
    setCanUndo(state.pastStates.length > 0);
    setCanRedo(state.futureStates.length > 0);
    return unsubscribe;
  }, []);

  const handleUndo = () => undo();
  const handleRedo = () => redo();

  return (
    <ButtonGroup size="large">
      <Button
        value="undo"
        aria-label="undo"
        disabled={!canUndo}
        onClick={handleUndo}
        sx={{
          borderRadius: 2,
          px: 1,
        }}
      >
        <UndoRounded sx={{ fontSize: 18 }} />
        {/* Undo */}
      </Button>

      <Button
        value="redo"
        aria-label="redo"
        disabled={!canRedo}
        onClick={handleRedo}
        sx={{
          borderRadius: 2,
          px: 1,
        }}
      >
        <RedoRounded sx={{ fontSize: 18 }} />
        {/* Redo */}
      </Button>
    </ButtonGroup>
  );
}
