import ThemeSelect from "./ThemeSelect";
import ThemeActionsGroup from "./ThemeActionsGroup";
import PropertiesPanelSwitch from "./PropertiesPanelSwitch";
import layoutStyles from "../layout-styles";
import DarkModeSwitch from "./DarkModeSwitch";
import { AppBar, Box, Toolbar } from "@mui/material";

export type CanvasToolbarProps = {
  isShowingPropertyPanel: boolean;
  handleShowPropertyPanel: (value: boolean) => void;
};

export default function CanvasToolbar(props: CanvasToolbarProps) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        color: "text.primary",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ px: "0 !important" }}>
        <Box
          sx={{
            ...layoutStyles.render,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            columnGap: 2,
            px: 1.7,
          }}
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
          </Box>

          <DarkModeSwitch />

          <PropertiesPanelSwitch
            isShowingPropertyPanel={props.isShowingPropertyPanel}
            handleShowPropertyPanel={props.handleShowPropertyPanel}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
