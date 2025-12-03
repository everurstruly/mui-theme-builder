import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Divider,
  Dialog as ConfirmDialog,
  DialogTitle as ConfirmDialogTitle,
  DialogContent as ConfirmDialogContent,
  DialogContentText,
  DialogActions as ConfirmDialogActions,
} from "@mui/material";
import { useCallback } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useCollection, useManageCollection } from ".";

export default function CollectionDialog() {
  const open = useCollection((s) => s.menuOpened);
  const display = useCollection((s) => s.setMenuOpened);
  const onClose = useCallback(() => {
    display(false);
  }, [display]);

  const {
    collection,
    isLoading,
    loadDesign,
    deleteDesign,
    loadStatus,
    loadBlocker,
    isLoadingDesign,
  } = useManageCollection();

  const handleLoadDesign = useCallback(
    (id: string) => {
      loadDesign(id, onClose);
    },
    [loadDesign, onClose]
  );

  const handleDeleteDesign = useCallback(
    async (id: string, event: React.MouseEvent) => {
      event.stopPropagation();

      if (!confirm("Are you sure you want to delete this design?")) {
        return;
      }

      try {
        await deleteDesign(id);
      } catch (error) {
        console.error("Failed to delete design:", error);
      }
    },
    [deleteDesign]
  );

  const filteredAndSortedCollection = collection.sort(
    (a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt)
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCreatedAt = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);

    // If created in the last minute, show "just now"
    if (minutes < 1) return "just now";

    // Otherwise show formatted date
    return formatDate(timestamp);
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(timestamp);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{ maxHeight: "80vh" }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h6">Saved Designs</Typography>
          <Typography variant="caption" color="text.secondary">
            {filteredAndSortedCollection.length} of {collection.length} design
            {collection.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
        <IconButton edge="end" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {/* Design List */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : filteredAndSortedCollection.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No saved designs yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredAndSortedCollection.map((item: any, index: number) => (
              <Box key={item.id}>
                {index > 0 && <Divider />}
                <ListItem
                  disablePadding
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => handleDeleteDesign(item.id, e)}
                      disabled={isLoadingDesign}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    onClick={() => handleLoadDesign(item.id)}
                    disabled={isLoadingDesign}
                    sx={{ py: 2 }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={500}>
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Box
                          component="span"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            component="span"
                            color="text.secondary"
                          >
                            Created: {formatCreatedAt(item.createdAt)}
                          </Typography>
                          {item.updatedAt && item.updatedAt !== item.createdAt && (
                            <Typography
                              variant="caption"
                              component="span"
                              color="primary.main"
                            >
                              Updated: {formatRelativeTime(item.updatedAt)}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>

      {/* Unsaved Changes Confirmation Dialog */}
      <ConfirmDialog
        open={loadStatus === "blocked" && loadBlocker?.reason === "UNSAVED_CHANGES"}
        onClose={() => loadBlocker?.resolutions.cancel()}
      >
        <ConfirmDialogTitle>Unsaved Changes</ConfirmDialogTitle>
        <ConfirmDialogContent>
          <DialogContentText>
            You have unsaved changes. Loading this design will discard your current
            work.
          </DialogContentText>
        </ConfirmDialogContent>
        <ConfirmDialogActions>
          <Button onClick={() => loadBlocker?.resolutions.cancel()}>Cancel</Button>
          <Button
            onClick={() => loadBlocker?.resolutions.discardAndProceed()}
            color="error"
            autoFocus
          >
            Discard Changes
          </Button>
        </ConfirmDialogActions>
      </ConfirmDialog>
    </Dialog>
  );
}
