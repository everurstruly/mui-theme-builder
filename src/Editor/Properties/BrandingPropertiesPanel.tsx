import ColorProperty from "./Color/Color";
import TypographyProperty from "./Typography/Typography";
import AppearanceProperty from "./Appearance/Appearance";
import { Tabs, Tab, Box, Typography, Paper } from "@mui/material";
import { useState } from "react";
// import { type DynamicResourceGeneratorFabData } from "./DynamicResourceGenerator";
// import { AutoAwesome } from "@mui/icons-material";

const properties = [
  { label: "Color", value: "palette" },
  { label: "Typography", value: "typography" },
  { label: "Appearance", value: "appearance" },
  // { label: "Font", value: "typography" },
  // { label: "Layout", value: "appearance" },
  // { label: "Effects", value: "effects" },
] as const;

type PropertyTabValue = (typeof properties)[number]["value"];
// type ResourceGeneratorMap = Partial<
//   Record<PropertyTabValue, DynamicResourceGeneratorFabData>
// >;

// const propertyToResourceGeneratorMap: ResourceGeneratorMap = {
//   palette: {
//     color: "info",
//     sx: (theme: any) => ({
//       backgroundImage: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
//       color: theme.palette.getContrastText(theme.palette.primary.main),
//       boxShadow: `0 6px 18px rgba(0,0,0,0.12)`,
//       "&:hover": { filter: "brightness(0.95)" },
//     }),
//     icon: <AutoAwesome />,
//     label: "Generate Colors",
//     variant: "extended",
//   },

//   typography: {
//     color: "primary",
//     sx: (theme: any) => ({
//       backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${
//         theme.palette.secondary?.main ?? theme.palette.info.main
//       })`,
//       color: theme.palette.getContrastText(theme.palette.primary.main),
//       boxShadow: `0 6px 18px rgba(0,0,0,0.12)`,
//       "&:hover": { filter: "brightness(0.95)" },
//     }),
//     icon: <AutoAwesome />,
//     label: "Generate Typography",
//     variant: "extended",
//   },

//   appearance: {
//     color: "success",
//     sx: (theme: any) => ({
//       backgroundImage: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
//       color: theme.palette.getContrastText(theme.palette.success.main),
//       boxShadow: `0 6px 18px rgba(0,0,0,0.12)`,
//       "&:hover": { filter: "brightness(0.95)" },
//     }),
//     icon: <AutoAwesome />,
//     label: "Generate Appearance",
//     variant: "extended",
//   },
// };

const thinScrollbar = {
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(0,0,0,0.5) transparent",
};

export const panelPaddingInlineRem = 2.8;

export default function BrandingPropertiesPanel() {
  const [selectedPropTab, setSelectedPropTab] =
    useState<PropertyTabValue>("palette");

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "auto",
        height: `100%`,
        px: 0,
        ...thinScrollbar,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "sticky",
          zIndex: 2,
          top: 0,
          pt: 2,
        }}
      >
        <Tabs
          aria-label="Editor Theme Design File Properties Panel Tabs"
          value={selectedPropTab}
          // variant="fullWidth"
          onChange={(event, newValue) => {
            void event;
            setSelectedPropTab(newValue);
          }}
          slotProps={{
            indicator: {
              children: <span />,
            },
          }}
          sx={[
            {
              zIndex: 1,
              height: 64,
              borderColor: "divider",

              // make the indicator a centered dot placed vertically in the middle
              "& .MuiTabs-indicator": {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent",
                // position in the middle vertically
                top: "70%",
                bottom: "auto",
                transform: "translateY(-50%)",
                height: "auto",
              },
              "& .MuiTabs-indicator > span": {
                width: 3,
                height: 3,
                borderRadius: "50%",
                backgroundColor: (theme) => theme.palette.primary.main,
                boxShadow: (theme) => `0 0 0 2px ${theme.palette.action.hover}`,
              },
            },
          ]}
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
                px: panelPaddingInlineRem,
              }}
            />
          ))}
        </Tabs>
      </Paper>

      <Box
        paddingInline={panelPaddingInlineRem}
        paddingBottom={12}
        minHeight={"100%"}
      >
        {selectedPropTab === "palette" && <ColorProperty />}
        {selectedPropTab === "typography" && <TypographyProperty />}
        {selectedPropTab === "appearance" && <AppearanceProperty />}
      </Box>

      {/* <DynamicResourceGeneratorFab
        activeKey={selectedPropTab}
        dataMap={propertyToResourceGeneratorMap}
        sx={{
          bottom: 8,
          position: "sticky",
          justifyItems: "flex-end",
          mx: panelPaddingInlineRem,
        }}
      /> */}

      <Typography
        variant="caption"
        component={"small"}
        textAlign={"center"}
        sx={{ mt: 8, py: 2 }}
        display="block"
      >
        -- You've reached the end --
      </Typography>
    </Paper>
  );
}
