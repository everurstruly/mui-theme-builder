import { MoreVertOutlined } from "@mui/icons-material";
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
} from "@mui/material";
import React from "react";
import useHasStoredAllModifications from "./useHasStoredAllModifications";
import { useEdit } from "./useEdit";
import useStorage from "../Storage/useStorage";

function Context() {
  const title = useEdit((s) => s.title);
  const setTitle = useEdit((s) => s.setTitle);
  const storageStatus = useStorage((s) => s.storageProgress);
  const hasStoredAllModifications = useHasStoredAllModifications();

  const hasUnsavedModifications = !hasStoredAllModifications;
  const loadNew = useEdit((s) => s.loadNew);

  const isSavedNow = storageStatus === "success";

  const [renameOpen, setRenameOpen] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState(title);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

  const [snack, setSnack] = React.useState<null | {
    severity?: "info" | "success" | "error";
    message: string;
  }>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleRename = () => {
    setRenameOpen(true);
    handleMenuClose();
  };

  const handleRenameConfirm = () => {
    setTitle(renameValue || "Untitled");
    setRenameOpen(false);
    setSnack({ severity: "success", message: `Renamed to '${renameValue}'` });
  };

  const handleDelete = () => {
    handleMenuClose();
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    loadNew("{}", {});
    setDeleteConfirmOpen(false);
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
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: 1,
        }}
        endIcon={<MoreVertOutlined fontSize="small" />}
      >
        <Typography
          variant="button"
          color="primary"
          sx={{
            whiteSpace: "nowrap",
            maxWidth: "30ch", // FIXME: sync with design sidebar
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          You're editing {hasUnsavedModifications ? "(unsaved)" : ""} —{" "}
          <Typography
            variant="caption"
            color="textPrimary"
            sx={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              lineHeight: 1,
              overflow: "hidden",
            }}
          >
            {title}
          </Typography>
        </Typography>
      </Button>

      <Menu
        id="design-menu"
        anchorEl={anchorEl}
        open={menuOpen}
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
        <MenuItem dense onClick={handleDelete} disabled={!isSavedNow}>
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Rename Current Design</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
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
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button onClick={handleRenameConfirm} variant="contained">
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete current design?</DialogTitle>

        <DialogContent>
          <Typography>
            Deleting will reset the canvas to a blank design. Continue?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
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
