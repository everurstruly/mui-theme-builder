import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { Close, HelpOutline } from "@mui/icons-material";
import { useHelpDialog } from "./useHelpDialog";
import GettingStarted from "./GettingStarted";
import KeyboardShortcuts from "./KeyboardShortcuts";
import Misc from "./Misc";

export default function HelpDialog() {
  const open = useHelpDialog((s) => s.opened);
  const currentTab = useHelpDialog((s) => s.currentTab);
  const setOpen = useHelpDialog((s) => s.setOpened);
  const setCurrentTab = useHelpDialog((s) => s.setCurrentTab);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue as "getting-started" | "keyboard-shortcuts" | "misc");
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case "getting-started":
        return <GettingStarted />;
      case "keyboard-shortcuts":
        return <KeyboardShortcuts />;
      case "misc":
        return <Misc />;
      default:
        return <GettingStarted />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="help-dialog"
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 6,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.85)"
                : "rgba(255,255,255,0.7)",
            backdropFilter: "blur(10px)",
            boxShadow: (theme) =>
              theme.shadows["10"] ?? "0 10px 30px rgba(0,0,0,0.4)",
            border: () => `1px solid rgba(255,255,255,0.06)`,
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 3,
          pt: 3,
          pb: 1,
        }}
      >
        <HelpOutline sx={{ color: "primary.main" }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Help Center
        </Typography>

        <Box sx={{ flex: 1 }} />

        <IconButton
          size="small"
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.04)",
            "&:hover": {
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          <Close />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: 3,
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="help tabs"
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
              transition: "all 0.2s",
              "&:hover": {
                color: "primary.main",
              },
            },
            "& .Mui-selected": {
              fontWeight: 600,
            },
          }}
        >
          <Tab
            label="Getting Started"
            value="getting-started"
            id="help-tab-getting-started"
            aria-controls="help-tabpanel-getting-started"
          />
          <Tab
            label="Keyboard Shortcuts"
            value="keyboard-shortcuts"
            id="help-tab-keyboard-shortcuts"
            aria-controls="help-tabpanel-keyboard-shortcuts"
          />
          <Tab
            label="Misc"
            value="misc"
            id="help-tab-misc"
            aria-controls="help-tabpanel-misc"
          />
        </Tabs>
      </Box>

      {/* Content */}
      <DialogContent
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          maxHeight: "70vh",
          overflow: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.2) transparent"
              : "rgba(0,0,0,0.2) transparent",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.2)",
            borderRadius: "4px",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.3)",
            },
          },
        }}
      >
        {renderTabContent()}
      </DialogContent>
    </Dialog>
  );
}
