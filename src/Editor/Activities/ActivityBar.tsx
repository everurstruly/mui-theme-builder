import DesignTemplateSelectMenu from "./DesignTemplateSelectMenu";
import DesignExportButton from "./DesignExportButton";
import DesignSaveButton from "./DesignSaveButton";
import DesignChangeHistoryButtons from "./DesignChangeHistoryButtons";
import MobileActionGroup from "./MobileDesignActionGroup";
import DesignActionListMenu from "./DesignActionListMenu";
import CurrentDesignStatus from "./CurrentDesignStatus";
import { AppBar, Stack, Divider, Toolbar, type SxProps } from "@mui/material";
import PropertiesPanelHeader from "../Properties/PropertiesPanelHeader";

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
      borderColor={"divider"}
      display={{ xs: "none", md: "flex" }}
      sx={{
        px: { md: 1, lg: "8px" },
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
        <CurrentDesignStatus />
      </Stack>

      <Stack
        flexGrow={1}
        alignItems={"center"}
        direction={"row"}
        marginInline={"auto"}
        justifyContent={"space-between"}
        px={{ md: 1.5 }}
      >
        <DesignActionListMenu />

        <Stack direction={"row"} alignItems={"inherit"} columnGap={1.5}>
          <DesignSaveButton />
          <DesignChangeHistoryButtons />
          <DesignExportButton />
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
        width={"100%"}
        minWidth={"20vw"}
        flexShrink={0}
        maxWidth={"calc(var(--properties-panel-width) - 8px)"} // FIXME: sync static with dynamic px
        paddingInline={{ md: 1.5 }}
        height={"100%"}
        columnGap={1.5}
        display={{ xs: "none", lg: "flex" }}
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
      paddingInline={{ sm: 2.5 }}
    >
      <DesignTemplateSelectMenu />
      <MobileActionGroup />
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
