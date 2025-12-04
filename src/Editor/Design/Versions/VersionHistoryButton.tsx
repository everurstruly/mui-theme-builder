import { IconButton, Tooltip } from "@mui/material";
import { History as HistoryIcon } from "@mui/icons-material";
import { useCurrent } from "../Current/useCurrent";
import useEditor from "../../useEditor";

export function VersionHistoryButton() {
  const currentDesignId = useCurrent((s) => s.savedId);
  const setDialogOpen = useEditor((s) => s.setVersionHistoryOpen);

  // Only show button if there's a saved design
  if (!currentDesignId) {
    return null;
  }

  return (
    <Tooltip title="Version History">
      <IconButton onClick={() => setDialogOpen(true)} size="small">
        <HistoryIcon />
      </IconButton>
    </Tooltip>
  );
}
