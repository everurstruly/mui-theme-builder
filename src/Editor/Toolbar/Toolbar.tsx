import ExportButton from "../Design/Current/Export/ExportButton";
import HistoryButtons from "../Design/Current/HistoryButtons";
import DesignMobileActionMenu from "./DesignMobileActionMenu";
import CurrentDesignContext from "../Design/Current/Modify/Context";
import PropertiesPanelHeader from "../Properties/PropertiesPanelHeader";
import StrategiesDialogOpenButton from "../Design/Draft/StrategiesDialogOpenButton";
import CollectionDialogButton from "../Design/Collection/CollectionDialogButton";
import SaveButton from "../Design/Current/Save/SaveButton";
import StatusBar from "../Design/Versions/StatusBar";
import { isFeatureEnabled } from "../../config/featureFlags";
import { useCurrent } from "../Design/Current/useCurrent";
import { AppBar, Stack, Divider, Toolbar, type SxProps, Box } from "@mui/material";
import useEditor from "../useEditor";

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
  const isFullpage = useEditor((s) => s.isFullpage);
  const isViewingVersion = useCurrent((s) => s.isViewingVersion);

  return (
    <Stack
      flexGrow={1}
      direction="row"
      alignItems={"center"}
      justifyContent="space-between"
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
        columnGap={inlineGapRem}
      >
        {isFeatureEnabled("SHOW_VERSION_HISTORY") && isViewingVersion ? (
          <StatusBar
            sx={{ paddingInline: inlineGapRem }}
            actionSx={{ columnGap: inlineGapRem }}
          />
        ) : (
          <>
            <Stack
              direction={"row"}
              sx={{ columnGap: inlineGapRem }}
              paddingInlineStart={inlineGapRem}
            >
              <CollectionDialogButton />
              <StrategiesDialogOpenButton />
            </Stack>

            <Stack
              direction={"row"}
              alignItems={"inherit"}
              columnGap={inlineGapRem}
              paddingInlineEnd={inlineGapRem}
            >
              <SaveButton />
              <HistoryButtons />
              <ExportButton />
            </Stack>
          </>
        )}
      </Stack>

      <Divider
        flexItem
        orientation="vertical"
        sx={{ display: { xs: "none", lg: "block" }, opacity: isFullpage ? 0 : 1 }}
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
      paddingInline={{ xs: 0.6, sm: "12px" }}
    >
      <CurrentDesignContext
        sx={{ minWidth: 0, maxWidth: "var(--explorer-panel-width)" }}
      />

      <Box
        display={"inherit"}
        alignItems={"inherit"}
        justifyContent={"inherit"}
        columnGap={{ xs: 1.2, sm: 3 }}
        marginInlineStart={"auto"}
      >
        <StrategiesDialogOpenButton />
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
        border: "none",

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
