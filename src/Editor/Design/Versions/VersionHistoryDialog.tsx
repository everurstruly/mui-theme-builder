import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useCurrent } from "../Current/useCurrent";
import { useVersionHistory } from "./useVersionHistory";
import { VersionItem } from "./VersionItem";
import { RestoreConfirmDialog } from "./RestoreConfirmDialog";
import { useEditor } from "../../useEditor";

export function VersionHistoryDialog() {
  const {
    versions,
    isLoading,
    error,
    deleteVersion,
    restoreVersion,
    loadVersionAsNew,
    getVersion,
  } = useVersionHistory();

  const open = useEditor((s) => s.versionHistoryOpen);
  const setVersionHistoryOpen = useEditor((s) => s.setVersionHistoryOpen);

  const onClose = () => {
    setVersionHistoryOpen(false);
  };

  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [selectedVersionTimestamp, setSelectedVersionTimestamp] = useState<
    number | null
  >(null);

  const handleView = async (versionId: string) => {
    const version = await getVersion(versionId);
    if (version) {
      const { enterViewMode } = useCurrent.getState();
      enterViewMode(versionId, version.snapshot, version.createdAt);
      onClose();
    }
  };

  const handleRestoreClick = (versionId: string) => {
    const version = versions.find((v) => v.id === versionId);
    if (version) {
      setSelectedVersionId(versionId);
      setSelectedVersionTimestamp(version.createdAt);
      setRestoreDialogOpen(true);
    }
  };

  const handleRestoreConfirm = async () => {
    if (selectedVersionId) {
      await restoreVersion(selectedVersionId);
      setRestoreDialogOpen(false);
      onClose();
    }
  };

  const handleLoadAsNew = async (versionId: string) => {
    await loadVersionAsNew(versionId);
    onClose();
  };

  const handleDelete = async (versionId: string) => {
    if (confirm("Delete this version? This cannot be undone.")) {
      await deleteVersion(versionId);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Version History</DialogTitle>
        <DialogContent>
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!isLoading && versions.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 4, textAlign: "center" }}
            >
              No versions yet. Versions are created when you save changes to an
              existing design.
            </Typography>
          )}

          {!isLoading && versions.length > 0 && (
            <List>
              {versions.map((version) => (
                <VersionItem
                  key={version.id}
                  version={version}
                  onView={handleView}
                  onRestore={handleRestoreClick}
                  onLoadAsNew={handleLoadAsNew}
                  onDelete={handleDelete}
                />
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <RestoreConfirmDialog
        open={restoreDialogOpen}
        versionId={selectedVersionId}
        versionTimestamp={selectedVersionTimestamp}
        onClose={() => setRestoreDialogOpen(false)}
        onConfirm={handleRestoreConfirm}
      />
    </>
  );
}
