import ExportButton from "../Design/Export/ExportButton";
import HistoryButtons from "../Design/Current/HistoryButtons";
import DesignMobileActionMenu from "./DesignMobileActionMenu";
import CurrentDesignContext from "../Design/Current/Modify/Context";
import PropertiesPanelHeader from "../Properties/PropertiesPanelHeader";
import StrategiesDialogOpenButton from "../Design/Draft/StrategiesDialogOpenButton";
import CollectionDialogButton from "../Design/Collection/CollectionDialogButton";
import SaveButton from "../Design/Current/Save/SaveButton";
import useEditor from "../useEditor";
import StatusBar from "../Design/Versions/StatusBar";
import { isFeatureEnabled } from "../../config/featureFlags";
import { useCurrent } from "../Design/Current/useCurrent";
import { AppBar, Stack, Divider, Toolbar, type SxProps, Box } from "@mui/material";

export const inlineGapRem = 2;

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
        // px: { md: inlineGapRem, lg: "0px" },
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
        sx={{
          px: { xs: 1.5, sm: 2 },
        }}
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
        sx={{
          px: { xs: 1.5, sm: 2, lg: inlineGapRem },
        }}
      >
        {isFeatureEnabled("SHOW_VERSION_HISTORY") && isViewingVersion ? (
          <StatusBar
            sx={{ paddingInline: inlineGapRem }}
            actionSx={{ columnGap: inlineGapRem }}
          />
        ) : (
          <>
            <Stack direction={"row"} alignItems={"inherit"} columnGap={"inherit"}>
              <CollectionDialogButton />
              <StrategiesDialogOpenButton />
            </Stack>

            <Stack direction={"row"} alignItems={"inherit"} columnGap={"inherit"}>
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
        sx={{ display: { xs: "none", md: "block" }, opacity: isFullpage ? 0 : 1 }}
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
      justifyContent={"space-between"}
      columnGap={1.5}
      sx={{
        px: { xs: 1.5, sm: 2 },
      }}
    >
      <CurrentDesignContext
        sx={{ minWidth: 0, maxWidth: "var(--explorer-panel-width)" }}
      />

      <Box
        display={"inherit"}
        alignItems={"inherit"}
        justifyContent={"inherit"}
        columnGap={{ xs: 1.5, sm: 2 }}
      >
        <CollectionDialogButton />
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
        ...sx,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          flexGrow: 1,
          minHeight: "var(--toolbar-height)",
          height: "var(--toolbar-height)",
          px: "0px !important",
        }}
      >
        {children}
      </Toolbar>
    </AppBar>
  );
}
