import ExportCommand from "../Design/Current/Export/ExportCommand";
import HistoryButtons from "../Design/Current/HistoryButtons";
import DesignMobileActionMenu from "./DesignMobileActionMenu";
import CurrentDesignContext from "../Design/Current/Modify/Context";
import PropertiesPanelHeader from "../Properties/PropertiesPanelHeader";
import { AppBar, Stack, Divider, Toolbar, type SxProps, Box } from "@mui/material";
import LaunchDialogOpenButton from "../Design/New/LaunchDialogOpenButton";
import CollectionDialogButton from "../Design/Collection/CollectionDialogButton";
import SaveButton from "../Design/Current/Save/SaveButton";
import { VersionHistoryButton } from "../Design/Versions";

const inlineGapRem = 2;

export default function EditorToolsbar() {
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
      borderColor={"divider"}
      display={{ xs: "none", md: "flex" }}
      sx={{
        px: { md: inlineGapRem, lg: "0px" },
        height: "var(--toolbar-height)",
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent={"space-between"}
        maxWidth={"var(--explorer-panel-width)"}
        width={"100%"}
        px={{ md: inlineGapRem }}
      >
        <CurrentDesignContext />
      </Stack>

      <Stack
        flexGrow={1}
        alignItems={"center"}
        justifyContent={"space-between"}
        direction={"row"}
        marginInline={"auto"}
        paddingInline={inlineGapRem}
        columnGap={inlineGapRem}
      >
        <Stack direction={"row"} sx={{ columnGap: inlineGapRem }}>
          <CollectionDialogButton />
          <LaunchDialogOpenButton />
        </Stack>

        <Stack direction={"row"} alignItems={"inherit"} columnGap={inlineGapRem}>
          <SaveButton />
          <HistoryButtons />
          <VersionHistoryButton />
          <ExportCommand />
        </Stack>
      </Stack>

      <Divider
        flexItem
        orientation="vertical"
        sx={{ display: { xs: "none", lg: "block" } }}
      />

      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent={"space-between"}
        flexShrink={0}
        width={{ lg: "var(--properties-panel-width)" }}
        height={"100%"}
        columnGap={inlineGapRem}
        paddingInline={inlineGapRem}
        display={{ xs: "none", lg: "flex" }}
      >
        <PropertiesPanelHeader sx={{ flexGrow: 1 }} />
      </Stack>
    </Stack>
  );
}

function MobileToolbarContent() {
  return (
    <Stack
      flexGrow={1}
      display={{ md: "none" }}
      direction="row"
      alignItems={"center"}
      columnGap={1.5}
      paddingInline={{ sm: "12px" }}
    >
      <CurrentDesignContext
        sx={{ minWidth: 0, maxWidth: "var(--explorer-panel-width)" }}
      />

      <Box
        display={"inherit"}
        alignItems={"inherit"}
        justifyContent={"inherit"}
        columnGap={{ xs: 1, sm: 3 }}
        marginInlineStart={"auto"}
        px={1}
      >
        <LaunchDialogOpenButton />
        <DesignMobileActionMenu />
      </Box>
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

        // backgroundColor: "var(--editor-tools-unit-bgColor, revert)",
        // backgroundColor: "rgba(255, 255, 255, 0.5)",
        // backgroundImage:
        //   "linear-gradient(to bottom, rgba(255,255,255,0.25) 10%, rgba(255,255,255,0.12) 70%, rgba(0,0,0,0.04) 100%)",
        // backgroundRepeat: "no-repeat",
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
