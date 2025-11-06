import ColorProperty from "./Color/Color";
import TypographyProperty from "./Typography/Typography";
import AppearanceProperty from "./Appearance/Appearance";
import { Tabs, Tab, Box, Typography } from "@mui/material";
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

export default function PrimitiesPropertiesPanelBody() {
  const [selectedPropTab, setSelectedPropTab] = useState("palette");

  return (
    <Box height={"100%"} overflow={"auto"} sx={thinScrollbar}>
      <Tabs
        aria-label="Property Tabs"
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
          height: "var(--toolbar-height)",
          backgroundColor: "rgba(255, 255, 255, .3)",
          backdropFilter: "blur(13px)",
        }}
      >
        {properties.map((prop) => (
          <Tab
            key={prop.value}
            label={prop.label}
            value={prop.value}
            sx={{
              minWidth: 0,
              fontWeight: "semibold",
              textTransform: "none",
            }}
          />
        ))}
      </Tabs>

      <Box paddingInline={1.5} paddingBottom={16} paddingInlineEnd={3}>
        {selectedPropTab === "palette" && <ColorProperty />}
        {selectedPropTab === "typography" && <TypographyProperty />}
        {selectedPropTab === "appearance" && <AppearanceProperty />}
      </Box>

      <Typography
        variant="caption"
        component={"small"}
        textAlign={"center"}
        py={2}
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
    </Box>
  );
}
