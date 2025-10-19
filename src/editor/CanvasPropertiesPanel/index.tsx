import * as React from "react";
import { Tab, Tabs, Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import layoutStyles from "../layout-styles";
import CodeWindow from "../CodeWindow";

type CanvasPropertiesPanelProps = {
  isShowing: boolean;
};

export default function CanvasPropertiesPanel({
  isShowing,
}: CanvasPropertiesPanelProps) {
  const [value, setValue] = React.useState(0);
  const [design, setDesign] = React.useState(() => ["mui"]);

  const handleDesign = (
    event: React.MouseEvent<HTMLElement>,
    newDesign: string[]
  ) => {
    void event;
    setDesign(newDesign);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    void event;
    setValue(newValue);
  };

  if (!isShowing) {
    return null;
  }

  return (
    <Box
      sx={{
        ...layoutStyles.properties,
        display: "flex",
        flexDirection: "column",
        borderLeft: 1,
        borderColor: "divider",
      }}
    >
      <ToggleButtonGroup
        value={design}
        onChange={handleDesign}
        aria-label="design"
        color="primary"
        exclusive
      >
        <ToggleButton
          sx={{
            borderRadius: "0",
            paddingInline: "1rem",
            flex: 1,
            minHeight: 54,
            height: 54,
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
            minHeight: 54,
            height: 54,
            paddingBlock: 2,
          }}
          value="ios"
          aria-label="ios"
        >
          Ios
        </ToggleButton>
      </ToggleButtonGroup>

      <CodeWindow />

      <Tabs
        value={value}
        onChange={handleChange}
        sx={{
          marginTop: 2,
          padding: 0,
          minHeight: 40,
          height: 40,
          alignItems: "center",
          borderBottom: 1,
          borderBottomColor: "divider",

          "& .MuiTab-root": {
            minHeight: 40,
            height: 40,
            flexGrow: 1,
            fontSize: "0.75rem",
          },
        }}
      >
        <Tab label="Colors" {...a11yProps(0)} />
        <Tab label="Text" {...a11yProps(2)} />
        <Tab label="Other" {...a11yProps(1)} />
      </Tabs>

      <CustomTabPanel value={value} index={0}>
        Item One
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
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
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
