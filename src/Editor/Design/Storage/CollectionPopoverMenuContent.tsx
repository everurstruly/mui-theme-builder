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
import useStorageCollection from "./useStorageCollection";
import React from "react";
import { ListOutlined } from "@mui/icons-material";
import CollectionPopoverMenutem from "./CollectionPopoverMenutem";
import useHasStoredAllModifications from "../Edit/useHasStoredAllModifications";

type CollectionPopoverMenuContentProps = {
  onClose?: () => void;
};

function CollectionPopoverMenuContent({
  onClose,
}: CollectionPopoverMenuContentProps) {
  const { savedDesigns, loadSaved, removeSaved, duplicateSaved } =
    useStorageCollection();
  const hasStoredAllModifications = useHasStoredAllModifications();
  const hasUnsaved = !hasStoredAllModifications;
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
        pt: 2,
        pb: 3,
        px: 3,
        minHeight: "40vh",
        maxHeight: "60vh",
        overflow: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(0,0,0,0.2) transparent",
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
          elevation={0}
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            borderRadius: 4,
            pt: 4,
            pb: 6,
          }}
        >
          <ListOutlined sx={{ mb: 2 }} color="action" />
          <Typography>You have no saved designs</Typography>
          <Typography
            variant="body2"
            fontSize={"caption.fontSize"}
            color="text.secondary"
          >
            Create, Edit and Save, for it to appear here.
          </Typography>
        </Card>
      ) : (
        <List dense sx={{ px: 0 }}>
          {savedDesigns.map((s) => (
            <CollectionPopoverMenutem
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

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCancelDiscard}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDiscard} autoFocus>
            Discard and Load
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default CollectionPopoverMenuContent;
