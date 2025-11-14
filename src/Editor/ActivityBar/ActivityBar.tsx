import ThemeSheetSelectMenu from "./ThemeSheetSelectMenu";
import ThemeDesignExportButton from "./ThemeDesignExportButton";
import ThemingExperienceTab from "./ThemingExperienceTab";
import SaveThemeSheetButton from "./SaveThemeSheetButton";
import ThemingHistoryActions from "./ThemingHistoryActions";
import MobileActionGroup from "./MobileActionGroup";
import ThemeSheetColorSchemeToggle from "./ThemeSheetColorSchemeToggle";
import ThemeDesignListMenu from "./ThemeDesignListMenu";
import CurrentThemeDesignStatus from "./CurrentThemeDesignStatus";
import { AppBar, Box, Divider, Stack, Toolbar, type SxProps } from "@mui/material";

export default function EditorActivityBar() {
  return (
    <SectionLayout>
      <MobileToolbarContent />
      <DesktopToolbarContent />
    </SectionLayout>
  );
}

function DesktopToolbarContent() {
  return (
    <Stack
      flexGrow={1}
      direction="row"
      alignItems={"center"}
      justifyContent="space-between"
      divider={
        <Divider
          orientation="vertical"
          flexItem
          sx={{ height: "var(--toolbar-height)" }}
        />
      }
      borderColor={"divider"}
      display={{ xs: "none", md: "flex" }}
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent={"space-between"}
        paddingInline={{ lg: 1.5 }}
        width={"var(--explorer-panel-width)"}
      >
        {/* <ExplorerPanelVisibilityToggle /> */}
        {/* <Divider orientation="vertical" flexItem /> */}
        <CurrentThemeDesignStatus />
      </Stack>

      <Stack
        flexGrow={1}
        alignItems={"center"}
        direction={"row"}
        marginInline={"auto"}
        paddingInline={{ lg: 1.5 }}
        columnGap={1.5}
      >
        <ThemeDesignListMenu />

        <Stack
          direction={"row"}
          columnGap={"inherit"}
          sx={{ marginInlineStart: "auto" }}
        >
          <SaveThemeSheetButton />
          <ThemingHistoryActions />
          <ThemeDesignExportButton />
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
          <ThemeSheetColorSchemeToggle />
        </Box>

        <Box display="inherit" columnGap={"inherit"}>
          <ThemingExperienceTab />
        </Box>
      </Stack>
    </Stack>
  );
}

function MobileToolbarContent() {
  return (
    <Stack flexGrow={1} display={{ md: "none" }}>
      <Stack
        direction="row"
        alignItems={"center"}
        columnGap={1}
        paddingInline={{ xs: 1.5, sm: 2.5 }}
      >
        <ThemeSheetSelectMenu />
        <MobileActionGroup />
      </Stack>
      {/* <EditorThemeExperienceTab centered /> */}
    </Stack>
  );
}

type SectionLayoutProps = {
  sx?: SxProps;
  children: React.ReactNode;
};

function SectionLayout({ sx, children }: SectionLayoutProps) {
  return (
    <AppBar
      position="static"
      elevation={0}
      color={"inherit"}
      sx={{
        color: "text.primary",
        // borderBottom: 1,
        // borderColor: "divider",

        backgroundColor: "var(--editor-tools-unit-bgColor, revert)",
        // backgroundColor: "rgba(255, 255, 255, 0.5)",
        // backgroundImage:
        //   "linear-gradient(to bottom, rgba(255,255,255,0.25) 10%, rgba(255,255,255,0.12) 70%, rgba(0,0,0,0.04) 100%)",
        backgroundRepeat: "no-repeat",
        // backdropFilter: "blur(20px)",
        ...sx,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          flexGrow: 1,
          minHeight: "var(--toolbar-height)",
          height: "var(--toolbar-height)",
          paddingInline: "0 !important",
        }}
      >
        {children}
      </Toolbar>
    </AppBar>
  );
}
