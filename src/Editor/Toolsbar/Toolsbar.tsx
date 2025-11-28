import ExportCommand from "../Design/Edit/ExportCommand";
import ModificationHistoryButtons from "../Design/Edit/ModificationHistoryButtons";
import DesignMobileActionMenu from "./DesignMobileActionMenu";
import DesignActionMenu from "./DesignActionMenu";
import CurrentDesignContext from "../Design/Edit/Context";
import PropertiesPanelHeader from "../Properties/PropertiesPanelHeader";
import StoreCurrentButton from "../Design/Storage/StoreCurrentButton";
import CreationDialogOpenButton from "../Design/Creation/CreationDialogOpenButton";
import { AppBar, Stack, Divider, Toolbar, type SxProps, Box } from "@mui/material";

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
        px: { md: 1, lg: "0px" },
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
        px={{ md: 1.5 }}
      >
        <CurrentDesignContext />
      </Stack>

      <Stack
        flexGrow={1}
        alignItems={"center"}
        justifyContent={"space-between"}
        direction={"row"}
        marginInline={"auto"}
        paddingInline={1.5}
        columnGap={2}
      >
        <DesignActionMenu sx={{ columnGap: 2 }} />

        <Stack direction={"row"} alignItems={"inherit"} columnGap={2}>
          <StoreCurrentButton />
          <ModificationHistoryButtons />
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
        paddingInline={{ md: 1.5 }}
        height={"100%"}
        columnGap={1.5}
        display={{ xs: "none", lg: "flex" }}
        paddingInlineEnd={{ lg: 2 }}
      >
        <PropertiesPanelHeader />
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
        <CreationDialogOpenButton />
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
