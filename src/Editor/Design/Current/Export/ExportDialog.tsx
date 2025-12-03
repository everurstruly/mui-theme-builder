import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import FileSelectTab from "./FileSelectTab";
import MergeWithDefaultsSwitch from "./MergeWithDefaultsSwitch";
import DownloadButton from "./DownloadButton";
import CopyButton from "./CopyButton";
import FileExtensionToggle from "./FileExtensionToggle";
import useExportOptions from "./useExportOptions";
import FileContent from "./FileContent";
import { Close } from "@mui/icons-material";
import { Box, Typography, Paper, Stack, useMediaQuery } from "@mui/material";
import FileSelectBox from "./FileSelectBox";

export default function ExportDialog() {
  const open = useExportOptions((s) => s.opened);
  const setOpen = useExportOptions((s) => s.setOpened);
  const requiresCompactView = useMediaQuery("(min-width:400px)");

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="export-context-dialog"
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 6,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(20,20,20,0.7)"
                : "rgba(255,255,255,0.7)",
            backdropFilter: "blur(10px)",
            boxShadow: (theme) =>
              theme.shadows["10"] ?? "0 10px 30px rgba(0,0,0,0.4)",
            border: () => `1px solid rgba(255,255,255,0.06)`,
          },
        },
      }}
    >
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", gap: 2, py: 2, pb: 3 }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Export Designed Theme
        </Typography>

        <Box sx={{ flex: 1 }} />

        <IconButton size="small" aria-label="close" onClick={() => setOpen(false)}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            my: 1,
            mb: 2,
          }}
        >
          {requiresCompactView && <MergeWithDefaultsSwitch />}

          <Box
            sx={{
              marginLeft: "auto !important",
              display: "inherit",
              alignItems: "inherit",
              flexGrow: !requiresCompactView ? 1 : 0,
              justifyContent: !requiresCompactView ? "flex-end" : "inherit",
              columnGap: requiresCompactView ? 2 : 1,
            }}
          >
            {!requiresCompactView && (
              <FileExtensionToggle
                sx={{ m: "0 !important", marginInlineEnd: "auto !important" }}
              />
            )}

            <DownloadButton compactView={!requiresCompactView} />
            <CopyButton />
          </Box>
        </Stack>

        <Paper
          sx={{
            position: "relative",
            borderRadius: 4,
            overflow: "hidden",
            mb: 1,
          }}
        >
          {/* Tabs bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              pr: 2,
              position: "absolute",
              top: 0,
              insetInline: 0,
              zIndex: 2,
              bgcolor: (theme) => theme.palette.background.default,
            }}
          >
            {requiresCompactView ? <FileSelectTab /> : <FileSelectBox />}
            {requiresCompactView && <FileExtensionToggle />}
          </Box>

          <FileContent
            sx={{
              position: "relative",
              scrollbarWidth: "none",
              overflow: "auto",
              height: "60vh",
              paddingTop: "4rem !important",
            }}
          />
        </Paper>
      </DialogContent>
    </Dialog>
  );
}
