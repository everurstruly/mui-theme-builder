import ColorProperty from "./Color/Color";
import TypographyProperty from "./Typography/Typography";
import AppearanceProperty from "./Appearance/Appearance";
import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";

const properties = [
  { label: "Color", value: "palette" },
  { label: "Typography", value: "typography" },
  { label: "Appearance", value: "appearance" },
];

export default function PrimitiesPropertiesPanelBody() {
  const [selectedPropTab, setSelectedPropTab] = useState("palette");

  return (
    <>
      <Tabs
        value={selectedPropTab}
        onChange={(event, newValue) => {
          void event;
          setSelectedPropTab(newValue);
        }}
        aria-label="Property Tabs"
        sx={{
          mt: 4,
          borderBottom: 1,
          borderColor: "divider",
          backdropFilter: "blur(30px)",
        }}
      >
        {properties.map((prop) => (
          <Tab
            key={prop.value}
            label={prop.label}
            value={prop.value}
            sx={{
              minWidth: 0,
              textTransform: "none",
              paddingBottom: 3,
            }}
          />
        ))}
      </Tabs>

      <Box
        paddingInline={1.5}
        paddingBottom={16}
        paddingInlineEnd={3}
        height={"100%"}
        overflow={"auto"}
        sx={{
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
        }}
      >
        {selectedPropTab === "palette" && <ColorProperty />}
        {selectedPropTab === "typography" && <TypographyProperty />}
        {selectedPropTab === "appearance" && <AppearanceProperty />}
      </Box>

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
    </>
  );
}
