import * as React from "react";
import Drawer from "@mui/material/Drawer";
import useEditorStore from "../Editor.store";
import CodeWindow from "../CodeWindow";
import PrimaryColorsCompact from "./PrimaryColorsCompact";
import ColorProperty from "./Color";
import { Tab, Tabs, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

export default function EditorPropertiesPanel() {
  const theme = useTheme();
  const isUpSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const isUpLaptopScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const withHidePanel = useEditorStore((state) => state.hidePanel);

  const isVisible = useEditorStore((state) => {
    return !state.hiddenPanels.includes("properties");
  });

  const hidePanel = () => withHidePanel("properties");

  const [activePropertiesGroupTab, setActivePropertiesGroupTab] =
    React.useState(0);

  const gotoPropertiesGroupTab = (event: React.SyntheticEvent, tab: number) => {
    void event;
    setActivePropertiesGroupTab(tab);
  };

  return (
    <Drawer
      component="aside"
      open={isVisible}
      onClose={() => hidePanel()}
      anchor={isUpSmallScreen ? "right" : "bottom"}
      variant={isUpLaptopScreen ? "permanent" : "temporary"}
      sx={(theme) => ({
        flexShrink: 0,
        borderLeft: 1,
        borderColor: "divider",
        overflow: "hidden",
        WebkitOverflowScrolling: "touch",
        backgroundColor: "transparent",

        [theme.breakpoints.up("md")]: {
          display: isVisible ? "block" : "none",
        },

        // hide scrollbar but keep scrolling
        msOverflowStyle: "none", // IE and Edge
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": {
          display: "none", // WebKit
        },

        "& .MuiDrawer-paper": {
          height: "82vh",
          width: "var(--properties-panel-width)",

          [theme.breakpoints.up("sm")]: {
            height: "100%",
          },

          [theme.breakpoints.up("md")]: {},

          [theme.breakpoints.up("lg")]: {
            position: "static",
          },
        },
      })}
    >
      <CodeWindow />

      <Tabs
        value={activePropertiesGroupTab}
        onChange={gotoPropertiesGroupTab}
        sx={{
          padding: 0,
          paddingTop: 2,
          minHeight: 40,
          height: 40,
          alignItems: "center",
          borderBottom: 1,
          borderBottomColor: "divider",
          backgroundColor: "background.paper",

          "& .MuiTab-root": {
            minHeight: 40,
            height: 40,
            minWidth: 0,
            fontSize: "0.75rem",
            textTransform: "none",
          },
        }}
      >
        <Tab label="Colors" {...a11yProps(0)} />
        <Tab label="Typography" {...a11yProps(1)} />
        <Tab label="Layout" {...a11yProps(2)} />
        <Tab label="Styles" {...a11yProps(3)} />
      </Tabs>

      <CustomTabPanel value={activePropertiesGroupTab} index={0}>
        <ColorProperty />
      </CustomTabPanel>

      <CustomTabPanel value={activePropertiesGroupTab} index={1}>
        <PrimaryColorsCompact />
      </CustomTabPanel>

      <CustomTabPanel value={activePropertiesGroupTab} index={2}>
        Item Three
      </CustomTabPanel>
    </Drawer>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={(theme) => ({
        height: "100%",
        overflowY: "auto",

        // show a very thin scrollbar as a visual affordance (still scrollable)
        msOverflowStyle: "auto", // IE and Edge
        scrollbarWidth: "thin", // Firefox

        "&::-webkit-scrollbar": {
          width: 4,
          height: 4,
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.18)"
              : "rgba(0,0,0,0.24)",
          borderRadius: 4,
        },

        [theme.breakpoints.down("sm")]: {
          paddingInline: theme.spacing(2),
        },
      })}
      {...other}
    >
      {value === index && children}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
