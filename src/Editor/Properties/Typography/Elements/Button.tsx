import FontFamilyOption from "../FontFamily/FontFamilyOption";
import FontStyleFieldOption from "../FontStyleOptions/FontStyleFieldOption";
import FontWeightOption from "../FontWeightOption/FontWeightOption";
import TypographyOptionGroup from "../TypographyOptionGroup";

function ButtonTypography() {
  return (
    <TypographyOptionGroup title="Button">
      <FontFamilyOption
        title={"Font family"}
        path="typography.button.fontFamily"
      />

      <FontStyleFieldOption
        name={"Font size"}
        path={`typography.button.fontSize`}
      />

      <FontWeightOption
        name={"Font weight"}
        path="typography.button.fontWeight"
      />
    </TypographyOptionGroup>
  );
}

export default ButtonTypography;

