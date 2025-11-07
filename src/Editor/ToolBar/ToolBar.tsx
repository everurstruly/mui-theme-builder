import ThemeSelect from "./ThemeSelect";
import ExportThemeButton from "./ExportThemeButton";
import EditorThemeExperienceTab from "./EditorExperienceTab";
import SaveThemeButton from "./SaveThemeButton";
import ChangesHistoryActions from "./ChangesHistoryActions";
import MobileActionGroup from "./MobileActionGroup";
import ColorSchemeToggle from "../PropertiesPanel/ColorSchemeToggle";
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  type SxProps,
} from "@mui/material";
import { ArrowDropDownOutlined, MenuOpenOutlined } from "@mui/icons-material";
import useEditorUiStore from "../editorUiStore";

export default function EditorToolBar() {
  const hiddenPanels = useEditorUiStore((state) => state.hiddenPanels);
  const hidePanel = useEditorUiStore((state) => state.hidePanel);
  const showPanel = useEditorUiStore((state) => state.showPanel);

  const isExplorerPanelHidden = hiddenPanels.includes("explorer");

  function floatExplorerPanel() {
    hidePanel("explorer");
  }

  function pinExplorerPanel() {
    showPanel("explorer");
  }

  return (
    <ToolbarBackground>
      <Toolbar
        variant="dense"
        sx={{
          flexGrow: 1,
          minHeight: "var(--toolbar-height)",
          height: "var(--toolbar-height)",
          paddingInline: "0 !important",
        }}
      >
        {/* Mobile */}
        <Stack flexGrow={1} display={{ md: "none" }}>
          <Stack
            direction="row"
            alignItems={"center"}
            columnGap={1}
            paddingInline={{ xs: 1.5, sm: 2.5 }}
          >
            <ThemeSelect />
            <MobileActionGroup />
          </Stack>
          {/* <EditorThemeExperienceTab centered /> */}
        </Stack>

        {/* Desktop */}
        <Stack
          flexGrow={1}
          direction="row"
          alignItems={"center"}
          justifyContent="space-between"
          borderLeft={1}
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{ height: "var(--toolbar-height)" }}
            />
          }
          borderColor={"divider"}
          display={{ xs: "none", md: "flex" }}
        >
          <Stack
            direction="row"
            alignItems={"center"}
            justifyContent={"space-between"}
            paddingInline={{ lg: 1.5 }}
            width={"var(--explorer-panel-width)"}
          >
            <Typography
              variant="subtitle2"
              color="action"
              display={"flex"}
              alignItems={"center"}
              columnGap={0.5}
            >
              Previews{" "}
              {isExplorerPanelHidden && (
                <ArrowDropDownOutlined
                  sx={{ fontSize: "h6.fontSize", color: "text.secondary" }}
                />
              )}
            </Typography>

            <IconButton
              onClick={() =>
                isExplorerPanelHidden ? pinExplorerPanel() : floatExplorerPanel()
              }
            >
              <MenuOpenOutlined fontSize="small" />
            </IconButton>
          </Stack>

          <Stack
            flexGrow={1}
            alignItems={"center"}
            direction={"row"}
            marginInline={"auto"}
            paddingInline={{ lg: 1.5 }}
            columnGap={1.5}
          >
            <ThemeSelect />
            <SaveThemeButton />

            <Stack
              direction={"row"}
              columnGap={"inherit"}
              sx={{ marginInlineStart: "auto" }}
            >
              <EditorThemeExperienceTab />
            </Stack>
          </Stack>

          <Stack
            direction="row"
            alignItems={"center"}
            justifyContent={"space-between"}
            width={"var(--properties-panel-width)"}
            paddingInline={{ lg: 1.5 }}
            columnGap={1.5}
          >
            <Box display="inherit" columnGap={"inherit"}>
              <ExportThemeButton />
            </Box>

            <ColorSchemeToggle />

            <Box display="inherit" columnGap={"inherit"}>
              <ChangesHistoryActions />
            </Box>
          </Stack>
        </Stack>
      </Toolbar>
    </ToolbarBackground>
  );
}

function ToolbarBackground({
  sx,
  children,
}: {
  sx?: SxProps;
  children: React.ReactNode;
}) {
  return (
    <AppBar
      position="static"
      elevation={0}
      color={"inherit"}
      sx={{
        color: "text.primary",
        // borderBottom: 1,
        // borderColor: "divider",

        // backgroundColor: "rgba(255, 255, 255, 0.5)",
        // backgroundImage:
        //   "linear-gradient(to bottom, rgba(255,255,255,0.25) 10%, rgba(255,255,255,0.12) 70%, rgba(0,0,0,0.04) 100%)",
        backgroundRepeat: "no-repeat",
        // backdropFilter: "blur(20px)",
        ...sx,
      }}
    >
      {children}
    </AppBar>
  );
}
