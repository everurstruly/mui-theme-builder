import { AddRounded } from "@mui/icons-material";
import FontFamilyOption from "./FontFamilyOption";
import { IconButton } from "@mui/material";
import { useThemeDesignTheme } from "../../../ThemeDesign";
import TypographyOptionGroup from "../TypographyOptionGroup";

function FontFamilyTypography() {
  const theme = useThemeDesignTheme();
  
  return (
    <TypographyOptionGroup title="Font Family">
      <IconButton size="small" style={{ float: "right", marginTop: -28 }}>
        <AddRounded sx={{ fontSize: "h6.fontSize", lineHeight: 1 }} />
      </IconButton>

      <FontFamilyOption
        name="Body & Captions"
        path="typography.fontFamily"
        templateValue={theme.typography.fontFamily as string}
      />

      <FontFamilyOption
        name="Headings & Subtitles"
        path="typography.h1.fontFamily"
        templateValue={(theme.typography.h1.fontFamily || theme.typography.fontFamily) as string}
      />
    </TypographyOptionGroup>
  );
}

export default FontFamilyTypography;

