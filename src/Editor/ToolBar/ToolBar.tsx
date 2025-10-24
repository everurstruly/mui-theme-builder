import ThemeSelect from "./ThemeSelect";
import PropertiesPanelSwitch from "./PropertiesPanelSwitch";
import ActivitiesPanelToggle from "./ActivitiesPanelToggle/ActivitiesPanelToggle";
import PrimaryActionGroup from "./PirmaryActionGroup";
import { AppBar, Box, Stack, Toolbar } from "@mui/material";

export default function EditorToolBar() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        color: "text.primary",
        backgroundColor: "transparent",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          px: "0 !important",
          minHeight: "var(--toolbar-height)",
          height: "var(--toolbar-height)",
        }}
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
              flexGrow: 1,
            }}
          >
            <ActivitiesPanelToggle />
            <ThemeSelect />
            <PrimaryActionGroup />
          </Box>

          <Stack
            direction="row"
            columnGap={1}
            alignItems="center"
            sx={(theme) => ({
              [theme.breakpoints.down("sm")]: {
                display: "none",
              },
            })}
          >
            <PropertiesPanelSwitch />
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
