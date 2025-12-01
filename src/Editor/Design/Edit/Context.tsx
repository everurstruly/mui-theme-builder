import React from "react";
import { usePersistenceStore } from "../Persistence/persistenceStore";
import { useRename } from "../Persistence/hooks";
import useEdit from "./useEdit";
import { MoreVertRounded } from "@mui/icons-material";
import {
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  type SxProps,
} from "@mui/material";

function Context({ sx }: { sx?: SxProps }) {
  const storageStatus = usePersistenceStore((s) => s.status);
  const lastSavedAt = usePersistenceStore((s) => s.lastSavedAt);
  const hasSavedRecently = storageStatus === "idle" && lastSavedAt !== null;

  const { title, rename } = useRename();
  const loadNew = useEdit((s) => s.loadNew);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [renameFormValue, setRenameFormValue] = React.useState(title);

  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
    React.useState(false);

  const actionMenuOpen = Boolean(anchorEl);

  const [snack, setSnack] = React.useState<null | {
    severity?: "info" | "success" | "error";
    message: string;
  }>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleRename = () => {
    setRenameDialogOpen(true);
    setRenameFormValue(title);
    handleMenuClose();
  };

  const handleRenameConfirm = async () => {
    const newTitle = renameFormValue || "Untitled";
    setRenameDialogOpen(false);

    try {
      const result = await rename(newTitle);
      if (result.persisted) {
        setSnack({
          severity: "success",
          message: `Renamed and saved as '${result.title}'`,
        });
      } else {
        setSnack({
          severity: "success",
          message: `Renamed to '${result.title}' (not yet saved)`,
        });
      }
    } catch (err) {
      console.error("Failed to rename:", err);
      setSnack({ severity: "error", message: "Rename failed" });
    }
  };

  const handleDelete = () => {
    handleMenuClose();
    setDeleteConfirmationDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    loadNew();
    setDeleteConfirmationDialogOpen(false);
    setSnack({ severity: "info", message: "Deleted current design" });
  };

  const handleSnackClose = () => setSnack(null);

  return (
    <>
      <Button
        onClick={handleMenuOpen}
        sx={{
          display: "flex",
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: 1,
          ...sx,
        }}
      >
        <Typography
          variant="button"
          color="primary"
          sx={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          You're editing —{" "}
          <Typography
            variant="caption"
            color="textPrimary"
            sx={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              lineHeight: 1,
              overflow: "hidden",
              alignItems: "center",
              display: "inline-flex",
              columnGap: 0.5,
            }}
          >
            {title} <MoreVertRounded sx={{ fontSize: "14px" }} />
          </Typography>
        </Typography>
      </Button>

      <Menu
        id="design-menu"
        anchorEl={anchorEl}
        open={actionMenuOpen}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: 230,
            },
          },
        }}
      >
        <MenuItem dense onClick={handleRename}>
          Rename
        </MenuItem>
        <MenuItem dense onClick={handleDelete} disabled={!hasSavedRecently}>
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Rename Current Design</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            value={renameFormValue}
            onChange={(e) => setRenameFormValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              const enterKeyCode = "Enter";
              if (e.code === enterKeyCode) {
                handleRenameConfirm();
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRenameConfirm} variant="contained">
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirmationDialogOpen}
        onClose={() => setDeleteConfirmationDialogOpen(false)}
      >
        <DialogTitle>Delete current design?</DialogTitle>

        <DialogContent>
          <Typography>
            Deleting will reset the canvas to a blank design. Continue?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteConfirmationDialogOpen(false)}>
            Cancel
          </Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3500} onClose={handleSnackClose}>
        {snack ? (
          <Alert
            onClose={handleSnackClose}
            severity={snack.severity ?? "info"}
            sx={{ width: "100%" }}
          >
            {snack.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
}

export default Context;
