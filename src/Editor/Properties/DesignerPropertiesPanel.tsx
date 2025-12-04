import useEditor from "../useEditor";
import PropertiesTabs from "./PropertiesTabs";
import ColorProperty from "./Color/Color";
import TypographyProperty from "./Typography/Typography";
import AppearanceProperty from "./Appearance/Appearance";
import { Box, Typography, Paper, type SxProps } from "@mui/material";

const panelPaddingInlineRem = 2.8;
const thinScrollbar = {
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(0,0,0,0.5) transparent",
};

export default function DesignerPropertiesPanel({ sx }: { sx?: SxProps<any> }) {
  const selectedPropertiesTab = useEditor((s) => s.selectedPropertiesTab);

  return (
    <Paper
      sx={{
        position: "relative",
        overflow: "auto",
        height: `100%`,
        px: 0,
        borderRadius: 0,
        border: "none",
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
          border: "none",
          paddingInline: panelPaddingInlineRem,
          backgroundColor: (theme) => theme.palette.background.paper,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <PropertiesTabs />
      </Paper>

      <Box
        paddingInline={panelPaddingInlineRem}
        paddingTop={2}
        paddingBottom={12}
        minHeight={"100%"}
        display={"flex"}
      >
        {selectedPropertiesTab === "palette" && <ColorProperty />}
        {selectedPropertiesTab === "typography" && <TypographyProperty />}
        {selectedPropertiesTab === "appearance" && <AppearanceProperty />}
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
