import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { History as HistoryIcon } from "@mui/icons-material";
import { VersionHistoryDialog } from "./VersionHistoryDialog";
import { useCurrent } from "../Current/useCurrent";

export function VersionHistoryButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const currentDesignId = useCurrent((s) => s.persistenceSnapshotId);

  // Only show button if there's a saved design
  if (!currentDesignId) {
    return null;
  }

  return (
    <>
      <Tooltip title="Version History">
        <IconButton onClick={() => setDialogOpen(true)} size="small">
          <HistoryIcon />
        </IconButton>
      </Tooltip>

      <VersionHistoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
