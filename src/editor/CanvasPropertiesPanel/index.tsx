import * as React from "react";
import { Tab, Tabs, Box } from "@mui/material";
import CodeWindow from "../CodeWindow";
import type { Theme } from "@mui/material/styles";
import PrimaryColorsCompact from "./PrimaryColorsCompact";
import PrimaryColorsRelaxed from "./PrimaryColorsRelaxed";

type CanvasPropertiesPanelProps = {
  isVisible: boolean;
  styles?: {
    root: (theme: Theme) => React.CSSProperties;
  };
};

export default function CanvasPropertiesPanel({
  isVisible: isShowing,
  styles,
}: CanvasPropertiesPanelProps) {
  const [value, setValue] = React.useState(0);
  // const [design, setDesign] = React.useState(() => ["mui"]);

  // const handleDesign = (
  //   event: React.MouseEvent<HTMLElement>,
  //   newDesign: string[]
  // ) => {
  //   void event;
  //   setDesign(newDesign);
  // };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    void event;
    setValue(newValue);
  };

  if (!isShowing) {
    return null;
  }

  return (
    <Box
      sx={(theme) => ({
        ...styles?.root(theme),
        flexDirection: "column",
        borderLeft: 1,
        borderColor: "divider",
      })}
    >
      {/* <ToggleButtonGroup
        value={design}
        onChange={handleDesign}
        aria-label="design"
        exclusive
        hidden={true}
      >
        <ToggleButton
          sx={{
            borderRadius: "0",
            paddingInline: "1rem",
            flex: 1,
            minHeight: 40,
            height: 40,
            paddingBlock: 2,
            borderLeft: "none",
          }}
          value="mui"
          aria-label="mui"
        >
          Material
        </ToggleButton>

        <ToggleButton
          sx={{
            borderRadius: "0",
            paddingInline: "1rem",
            flex: 1,
            minHeight: 40,
            height: 40,
            paddingBlock: 2,
          }}
          value="ios"
          aria-label="ios"
        >
          Ios
        </ToggleButton>

        <ToggleButton
          sx={{
            borderRadius: "0",
            paddingInline: "1rem",
            flex: 1,
            minHeight: 40,
            height: 40,
            paddingBlock: 2,
          }}
          value="ios"
          aria-label="ios"
        >
          Ios
        </ToggleButton>
      </ToggleButtonGroup> */}

      <CodeWindow />

      <Tabs
        value={value}
        onChange={handleChange}
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
            // flexGrow: 1,
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

      <CustomTabPanel value={value} index={0}>
        <PrimaryColorsRelaxed />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <PrimaryColorsCompact />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
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
