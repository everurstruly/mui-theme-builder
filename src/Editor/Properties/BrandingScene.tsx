import ColorProperty from "./Color/Color";
import TypographyProperty from "./Typography/Typography";
import AppearanceProperty from "./Appearance/Appearance";
// import TemplateSelectBox from "./TemplateSelectBox";
// import { Tabs, Tab, Box, Typography, alpha, Paper, Divider } from "@mui/material";
import { Tabs, Tab, Box, Typography, alpha, Paper } from "@mui/material";
import { useState } from "react";

const properties = [
  { label: "Color", value: "palette" },
  { label: "Typography", value: "typography" },
  { label: "Appearance", value: "appearance" },
];

const thinScrollbar = {
  "&::-webkit-scrollbar": {
    width: 4,
    height: 4,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 4,
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(0,0,0,0.5) transparent",
};

const panelPaddingInline = 2.5;

export default function PrimitiesPropertiesPanelBody() {
  const [selectedPropTab, setSelectedPropTab] = useState("palette");

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        overflow: "auto",
        ...thinScrollbar,
      }}
    >
      <Tabs
        aria-label="Editor Theme Design File Properties Panel Tabs"
        variant="fullWidth"
        value={selectedPropTab}
        onChange={(event, newValue) => {
          void event;
          setSelectedPropTab(newValue);
        }}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          borderBottom: 1,
          borderColor: "divider",
          backdropFilter: "blur(2px)",
          backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.95),

          "& .MuiTabs-indicator": {
            // backgroundColor: "text.primary",
            // borderInline: "12px solid",
            // borderColor: "white",
          },
        }}
      >
        {properties.map((prop) => (
          <Tab
            key={prop.value}
            label={prop.label}
            value={prop.value}
            disableRipple
            sx={{
              minWidth: 0,
              fontWeight: "semibold",
              textTransform: "none",
              height: "var(--toolbar-height)",
              px: 2,

              "&.Mui-selected": {
                // color: "text.primary",
              },
            }}
          />
        ))}
      </Tabs>

      <Box paddingInline={panelPaddingInline} paddingBottom={10}>
        {selectedPropTab === "palette" && <ColorProperty />}
        {selectedPropTab === "typography" && <TypographyProperty />}
        {selectedPropTab === "appearance" && <AppearanceProperty />}
      </Box>

      <Typography
        variant="caption"
        component={"small"}
        textAlign={"center"}
        py={2} // NB(nice to have): unintentionally center-aligns with the canvas bottom controls
        display="block"
      >
        -- You've reached the end --
      </Typography>
    </Paper>
  );
}
