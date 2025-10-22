import ThemeSelect from "./ThemeSelect";
import ThemeActionsGroup from "./ChangesHistoryActions";
import PropertiesPanelSwitch from "./PropertiesPanelSwitch";
import CopyThemeButton from "./CopyThemeButton";
import SaveThemeButton from "./SaveThemeButton";
import { AppBar, Box, Stack, Toolbar } from "@mui/material";
import PreviewsPanelToggle from "./PreviewsPanelToggle";
import MinimizedPreviewsPanelPopOver from "../PreviewsPanel/FramesPopOver";

export default function EditorToolBar() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={(theme) => ({
        color: "text.primary",
        backgroundColor: "transparent",
        borderBottom: 1,
        borderColor: "divider",
        display: "none",

        [theme.breakpoints.up("md")]: {
          display: "block",
        },
      })}
    >
      <Toolbar
        variant="dense"
        sx={{ px: "0 !important", minHeight: 46, height: 46 }}
      >
        <Stack
          flexGrow={1}
          direction="row"
          justifyContent="space-between"
          px={1}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: 1,
            }}
          >
            <PreviewsPanelToggle />
            <MinimizedPreviewsPanelPopOver />
            <ThemeSelect />
            <CopyThemeButton />
            <ThemeActionsGroup />
            <SaveThemeButton />
          </Box>

          <Stack direction="row" columnGap={1} alignItems="center">
            <PropertiesPanelSwitch />
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
