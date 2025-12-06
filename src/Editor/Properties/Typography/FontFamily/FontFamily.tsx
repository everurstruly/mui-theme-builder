import FontFamilyOption from "./FontFamilyOption";
import TypographyOptionGroup from "../TypographyOptionGroup";
import { Box } from "@mui/material";

function FontFamilyTypography() {
  return (
    <TypographyOptionGroup title="Font Family" defaultOpen={true}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        <FontFamilyOption title="Body & Captions" path="typography.fontFamily" />

        <FontFamilyOption
          title="Headings & Subtitles"
          path="typography.h1.fontFamily"
        />
      </Box>
    </TypographyOptionGroup>
  );
}

export default FontFamilyTypography;
