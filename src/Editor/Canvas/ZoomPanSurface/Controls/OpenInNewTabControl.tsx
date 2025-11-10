import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Tooltip, IconButton } from "@mui/material";
import { useThemeDocumentOptions, useThemeDocumentStore } from "../../../ThemeDocument";

export default function OpenInNewTabControl() {
  const activePreviewId = useThemeDocumentStore((state) => state.activePreviewId);
  const themeOptions = useThemeDocumentOptions();

  const handleOpenInNewTab = () => {
    if (!activePreviewId) {
      console.warn("[OpenInNewTabControl] No active preview ID");
      return;
    }

    try {
      // Get the current theme options for export
      const encodedTheme = btoa(JSON.stringify(themeOptions));
      const url = `/editor/viewport?component=${encodeURIComponent(
        activePreviewId
      )}&theme=${encodeURIComponent(encodedTheme)}`;
      window.open(url, "_blank");
    } catch (error) {
      console.error("[OpenInNewTabControl] Failed to open in new tab:", error);
    }
  };

  return (
    <Tooltip title="Open in new tab" arrow>
      <IconButton
        onClick={handleOpenInNewTab}
        size="small"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          borderRadius: 1,
          border: "1px solid rgba(0, 0, 0, 0.1)",
          padding: "11px",
          backdropFilter: "blur(20px)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          },
        }}
      >
        <OpenInNewIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
