import ThemeSelect from "./ThemeSelect";
import PropertiesPanelToggle from "./PropertiesPanelToggle";
import ActivitiesPanelToggle from "./ActivitiesPanelToggle/ActivitiesPanelToggle";
import PrimaryActionGroup from "./PirmaryActionGroup";
import { AppBar, Box, Stack, Toolbar } from "@mui/material";
import DragLockControl from "../Canvas/ZoomPanSurface/Controls/DragLockControl";

export default function EditorToolBar() {
  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",

          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.25) 10%, rgba(255,255,255,0.12) 70%, rgba(0,0,0,0.04) 100%)",
          backgroundRepeat: "no-repeat",
          backdropFilter: "blur(20px)",
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
              <DragLockControl />
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
              <PropertiesPanelToggle />
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}
