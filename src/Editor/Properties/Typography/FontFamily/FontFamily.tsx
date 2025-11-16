import FontFamilyOption from "./FontFamilyOption";
import { useThemeDesignTheme } from "../../../Design";
import TypographyOptionGroup from "../TypographyOptionGroup";

function FontFamilyTypography() {
  const theme = useThemeDesignTheme();
  
  return (
    <TypographyOptionGroup title="Font Family">
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

