import {
  Box,
  Typography,
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  Stack,
} from "@mui/material";
import useDesignStorage from "./useDesignStorage";
import { useDesignStore } from "../designStore";
import React from "react";
import { ListOutlined } from "@mui/icons-material";
import StoredDesignListItem from "./StoredDesignListItem";

type SavedDesignPopoverMenuListProps = {
  onClose?: () => void;
};

function SavedDesignPopoverMenuList({ onClose }: SavedDesignPopoverMenuListProps) {
  const { savedDesigns, loadSaved, removeSaved, duplicateSaved } =
    useDesignStorage();
  const hasUnsaved = useDesignStore((s) => s.hasUnsavedChanges);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  const handleLoad = async (id: string) => {
    if (hasUnsaved) {
      setPendingId(id);
      setConfirmOpen(true);
      return;
    }
    const ok = await loadSaved(id);
    if (ok && onClose) onClose();
  };

  const handleRemove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await removeSaved(id);
  };

  const handleConfirmDiscard = async () => {
    if (!pendingId) return;
    setConfirmOpen(false);
    const ok = await loadSaved(pendingId);
    setPendingId(null);
    if (ok && onClose) onClose();
  };

  const handleCancelDiscard = () => {
    setConfirmOpen(false);
    setPendingId(null);
  };

  const handleDuplicate = async (id: string): Promise<void> => {
    // Minimal UX: create a copy but do not auto-open it
    try {
      await duplicateSaved(id);
    } catch {
      // swallow UX errors for now
    }
  };
  return (
    <Stack
      sx={{
        p: 2,
        minHeight: "40vh",
        maxHeight: "60vh",
        overflow: "auto",
        width: 320,
      }}
    >
      <Box sx={{ mb: 2, py: 1, textAlign: "center" }}>
        <Typography variant="subtitle1">My Saved Theme Designs</Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "caption.fontSize" }}
        >
          Saved in your browser for quick access later.
        </Typography>
      </Box>

      {savedDesigns.length === 0 ? (
        <Card
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            pb: 6,
          }}
        >
          <ListOutlined sx={{ mb: 2 }} color="action" />
          <Typography>You have no saved designs</Typography>
          <Typography variant="body2" color="text.secondary">
            Create, Modify and Save, for it to appear here.
          </Typography>
        </Card>
      ) : (
        <List dense sx={{ px: 0 }}>
          {savedDesigns.map((s) => (
            <StoredDesignListItem
              key={s.id}
              design={s}
              onLoad={handleLoad}
              onRemove={handleRemove}
              onDuplicate={handleDuplicate}
            />
          ))}
        </List>
      )}

      <Dialog open={confirmOpen} onClose={handleCancelDiscard}>
        <DialogTitle>Discard changes?</DialogTitle>
        <DialogContent>
          <Typography>
            Loading a saved design will discard unsaved changes. Continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDiscard}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDiscard} autoFocus>
            Discard and Load
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default SavedDesignPopoverMenuList;
