import FontFamilyOption from "./FontFamilyOption";
import TypographyOptionGroup from "../TypographyOptionGroup";

function FontFamilyTypography() {
  return (
    <TypographyOptionGroup title="Font Family" defaultOpen={true}>
      <FontFamilyOption title="Body & Captions" path="typography.fontFamily" />

      <FontFamilyOption
        title="Headings & Subtitles"
        path="typography.h1.fontFamily"
      />
    </TypographyOptionGroup>
  );
}

export default FontFamilyTypography;
