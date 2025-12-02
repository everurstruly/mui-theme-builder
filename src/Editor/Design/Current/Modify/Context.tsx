import React from "react";
import useCurrent from "../useCurrent";
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
  Snackbar,
  Alert,
  type SxProps,
} from "@mui/material";
import RenameDialog from "./RenameDialog";
import { useTitle } from "./useTitle";
import { VersionHistoryDialog } from "../../Versions";
import { isFeatureEnabled } from "../../../../config/featureFlags";

function Context({ sx }: { sx?: SxProps }) {
  const storageStatus = useCurrent((s) => s.saveStatus);
  const lastSavedAt = useCurrent((s) => s.lastPersistedAt);
  const persistedSnapshotId = useCurrent((s) => s.persistenceSnapshotId);
  const isViewingVersion = useCurrent((s) => s.isViewingVersion);
  const hasSavedRecently = storageStatus === "idle" && lastSavedAt !== null;

  const { title } = useTitle();
  const loadNew = useCurrent((s) => s.loadNew);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = React.useState(false);

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
    handleMenuClose();
  };

  const handleVersionHistory = () => {
    setVersionHistoryOpen(true);
    handleMenuClose();
  };

  const handleRenameSuccess = (result: { persisted: boolean; title: string }) => {
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
          {isViewingVersion ? "You're previewing —" : "You're editing —"}{" "}
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
        {isFeatureEnabled("SHOW_VERSION_HISTORY") && (
          <MenuItem
            dense
            onClick={handleVersionHistory}
            disabled={!hasSavedRecently}
          >
            Version History
          </MenuItem>
        )}
        <MenuItem dense onClick={handleDelete} disabled={!hasSavedRecently}>
          Delete
        </MenuItem>
      </Menu>

      {isFeatureEnabled("SHOW_VERSION_HISTORY") && (
        <VersionHistoryDialog
          open={versionHistoryOpen}
          onClose={() => setVersionHistoryOpen(false)}
        />
      )}

      <RenameDialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        initialTitle={title}
        currentSnapshotId={persistedSnapshotId}
        onSuccess={(res) => {
          handleRenameSuccess(res);
        }}
      />

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
