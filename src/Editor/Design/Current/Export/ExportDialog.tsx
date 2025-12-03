import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import ExportFileTabs from "./ExportFileTabs";
import useExport from "./useExport";
import MergeWithDefaultsSwitch from "./MergeWithDefaultsSwitch";
import DownloadButton from "./DownloadButton";
import CopyButton from "./CopyButton";
import FormatToggle from "./FormatToggle";
import { Close } from "@mui/icons-material";
import { Box, Typography, Paper, Stack } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import useExportOptions from "./useExportOptions";

export default function ExportDialog() {
  const { getExportCode } = useExport();
  const open = useExportOptions((s) => s.opened);
  const setOpen = useExportOptions((s) => s.setOpened);

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
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
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
          <MergeWithDefaultsSwitch />

          <Box
            sx={{
              ml: "auto",
              display: "inherit",
              alignItems: "inherit",
              columnGap: 2,
            }}
          >
            <DownloadButton />
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
            <ExportFileTabs />
            <FormatToggle />
          </Box>

          {/* Code area */}
          <Box
            component={SyntaxHighlighter}
            language={"typescript"}
            style={vscDarkPlus}
            showLineNumbers
            sx={{
              position: "relative",
              scrollbarWidth: "none",
              overflow: "auto",
              height: "60vh",
              paddingTop: "4rem !important",
            }}
          >
            {getExportCode()}
          </Box>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}
