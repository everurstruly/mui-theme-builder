import ThemeSelect from "./ThemeSelect";
import ThemeActionsGroup from "./ThemeActionsGroup";
import PropertiesPanelSwitch from "./PropertiesPanelSwitch";
import DarkModeSwitch from "./DarkModeSwitch";
import CopyThemeButton from "./CopyThemeButton";
import { AppBar, Box, Stack, Toolbar } from "@mui/material";

export default function EditorToolBar() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={(theme) => ({
        backgroundColor: "transparent",
        color: "text.primary",
        borderColor: "divider",
        display: "none",
        [theme.breakpoints.up("md")]: {
          display: "block",
        },
      })}
    >
      <Toolbar sx={{ px: "0 !important" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          columnGap={2}
          px={1.7}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: 1,
            }}
          >
            <ThemeSelect />
            <ThemeActionsGroup />
            <CopyThemeButton />
          </Box>

          <Stack
            direction="row"
            columnGap={1}
            alignItems="center"
            marginInline={"auto"}
          >
            <DarkModeSwitch />
            <PropertiesPanelSwitch />
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
