import ColorProperty from "./Color/Color";
import TypographyProperty from "./Typography/Typography";
import AppearanceProperty from "./Appearance/Appearance";
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

const panelPaddingInline = 2;

export default function PrimitiesPropertiesPanelBody() {
  const [selectedPropTab, setSelectedPropTab] = useState("palette");

  return (
    <Paper sx={{ height: "100%", overflow: "auto", ...thinScrollbar }} elevation={0}>
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
          // backdropFilter: "blur(4px)",
          backgroundColor: (theme) => alpha(theme.palette.background.paper, .9),

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

      {/* <Typography
        variant="caption"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",

          py: 1,
          px: 1.5,
          pt: 1.5,
          background: "rgba(255, 255, 255, .2)",
          backdropFilter: "blur(30px)",
          color: "text.secondary",
          textTransform: "capitalize",
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        Colors: primary, secondary, success, warning, error, info, gray.
      </Typography> */}
    </Paper>
  );
}
