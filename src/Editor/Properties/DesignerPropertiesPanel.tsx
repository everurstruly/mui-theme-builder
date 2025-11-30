import React, { Suspense, lazy } from "react";
const ColorProperty = lazy(() => import("./Color/Color"));
const TypographyProperty = lazy(() => import("./Typography/Typography"));
const AppearanceProperty = lazy(() => import("./Appearance/Appearance"));
import { Box, Typography, Paper, type SxProps } from "@mui/material";
import useEditorStore from "../useEditor";
import PropertyTabs from "./PropertyTabs";

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

export default function DesignerPropertiesPanel({ sx }: { sx?: SxProps<any> }) {
  const selectedPropertyTab = useEditorStore((s) => s.selectedPropertyTab);

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "auto",
        height: `100%`,
        px: 0,
        ...thinScrollbar,
        ...(Array.isArray(sx) ? sx : [sx]),
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "sticky",
          zIndex: 2,
          top: 0,
          display: "flex",
          flexGrow: 1,
          alignItems: "center",
          paddingInline: panelPaddingInlineRem,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <PropertyTabs />
      </Paper>

      <Box paddingInline={panelPaddingInlineRem} paddingBottom={12} minHeight={"100%"}>
        <Suspense fallback={<div aria-hidden />}>
          {selectedPropertyTab === "palette" && <ColorProperty />}
          {selectedPropertyTab === "typography" && <TypographyProperty />}
          {selectedPropertyTab === "appearance" && <AppearanceProperty />}
        </Suspense>
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
