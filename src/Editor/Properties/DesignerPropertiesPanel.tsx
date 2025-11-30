import useEditorStore from "../useEditor";
import PropertyTabs from "./PropertyTabs";
import ColorProperty from "./Color/Color";
import TypographyProperty from "./Typography/Typography";
import AppearanceProperty from "./Appearance/Appearance";
import { Box, Typography, Paper, type SxProps } from "@mui/material";

export const panelPaddingInlineRem = 2.8;
const thinScrollbar = {
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(0,0,0,0.5) transparent",
};

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

      <Box
        paddingInline={panelPaddingInlineRem}
        paddingBottom={12}
        minHeight={"100%"}
        height={"100%"}
        display={"flex"}
        data-bro-what-the-fuck="hi"
      >
        {selectedPropertyTab === "palette" && <ColorProperty />}
        {selectedPropertyTab === "typography" && <TypographyProperty />}
        {selectedPropertyTab === "appearance" && <AppearanceProperty />}
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
