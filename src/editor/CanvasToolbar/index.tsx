import ThemeSelect from "./ThemeSelect";
import ThemeActionsGroup from "./ThemeActionsGroup";
import PropertiesPanelSwitch from "./PropertiesPanelSwitch";
import layoutStyles from "../layout-styles";
import DarkModeSwitch from "./DarkModeSwitch";
import { AppBar, Box, Stack, Toolbar } from "@mui/material";
import CopyThemeButton from "./CopyThemeButton";

export type CanvasToolbarProps = {
  isShowingPropertyPanel: boolean;
  handleShowPropertyPanel: (value: boolean) => void;
};

export default function CanvasToolbar(props: CanvasToolbarProps) {
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
          columnGap={2}
          px={1.7}
          justifyContent="space-between"
          sx={{ maxWidth: layoutStyles.board.maxWidth }}
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
            <PropertiesPanelSwitch
              isShowingPropertyPanel={props.isShowingPropertyPanel}
              handleShowPropertyPanel={props.handleShowPropertyPanel}
            />
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
