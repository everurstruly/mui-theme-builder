import { Alert, Button, Stack, type SxProps } from "@mui/material";
import { useCurrent } from "../Current/useCurrent";
import { useVersionHistory } from "./useVersionHistory";

type StatusBarProps = {
  sx?: SxProps;
  actionSx?: SxProps;
};

export default function StatusBar({ sx, actionSx }: StatusBarProps) {
  const isViewingVersion = useCurrent((s) => s.isViewingVersion);
  const viewingVersionId = useCurrent((s) => s.viewingVersionId);
  const viewingVersionSnapshot = useCurrent((s) => s.viewingVersionSnapshot);
  const exitViewMode = useCurrent((s) => s.exitViewMode);
  const restoreVersion = useVersionHistory().restoreVersion;

  if (!isViewingVersion) {
    return null;
  }

  const versionDate = viewingVersionSnapshot?.versionCreatedAt
    ? new Date(viewingVersionSnapshot.versionCreatedAt).toLocaleString()
    : "Unknown date";

  const handleBackToCurrent = () => {
    exitViewMode();
  };

  const handleRestore = async () => {
    if (viewingVersionId) {
      // Ask for confirmation
      if (confirm("Restore this version? This will replace your current design.")) {
        await restoreVersion(viewingVersionId);
        // exitViewMode is called automatically by restoreVersion
      }
    }
  };

  return (
    <Alert
      severity="warning"
      sx={{ flexGrow: 1, ...(Array.isArray(sx) ? sx : [sx]) }}
      action={
        <Stack
          direction="row"
          sx={{ columnGap: 2, ...(Array.isArray(actionSx) ? actionSx : [actionSx]) }}
        >
          <Button size="small" onClick={handleBackToCurrent}>
            Back to editing
          </Button>

          <Button size="small" variant="contained" onClick={handleRestore}>
            Restore this Version
          </Button>
        </Stack>
      }
    >
      Version {versionDate}
    </Alert>
  );
}
