import { Button, ButtonGroup } from "@mui/material";
import { RedoRounded, UndoRounded } from "@mui/icons-material";
import { useThemeDocumentStore } from "../ThemeDocument";
import { useEffect, useState } from "react";

export default function ThemingHistoryActions() {
  const { undo, redo } = useThemeDocumentStore.temporal.getState();
  
  // Subscribe to temporal state changes for reactive updates
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const unsubscribe = useThemeDocumentStore.temporal.subscribe((state) => {
      setCanUndo(state.pastStates.length > 0);
      setCanRedo(state.futureStates.length > 0);
    });
    // Initial state
    const state = useThemeDocumentStore.temporal.getState();
    setCanUndo(state.pastStates.length > 0);
    setCanRedo(state.futureStates.length > 0);
    return unsubscribe;
  }, []);

  const handleUndo = () => undo();
  const handleRedo = () => redo();

  return (
    <ButtonGroup size="large">
      <Button
        color="inherit"
        value="undo"
        aria-label="undo"
        disabled={!canUndo}
        sx={{
          borderRadius: 2,
          px: 1,
        }}
        onClick={handleUndo}
      >
        <UndoRounded sx={{ fontSize: 18 }} />
        {/* Undo */}
      </Button>

      <Button
        color="inherit"
        value="redo"
        aria-label="redo"
        disabled={!canRedo}
        sx={{
          borderRadius: 2,
          px: 1,
        }}
        onClick={handleRedo}
      >
        <RedoRounded sx={{ fontSize: 18 }} />
        {/* Redo */}
      </Button>
    </ButtonGroup>
  );
}
