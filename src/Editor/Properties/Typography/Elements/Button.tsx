import FontFamilyOption from "../FontFamily/FontFamilyOption";
import FontStyleFieldOption from "../FontStyleOptions/FontStyleFieldOption";
import FontWeightOption from "../FontWeightOption/FontWeightOption";
import { useThemeDesignTheme } from "../../../Design";
import TypographyOptionGroup from "../TypographyOptionGroup";

function ButtonTypography() {
  const theme = useThemeDesignTheme();

  return (
    <TypographyOptionGroup title="Button">
      <FontFamilyOption
        name={"Font family"}
        path="typography.button.fontFamily"
        templateValue={(theme.typography.button.fontFamily || theme.typography.fontFamily) as string}
      />

      <FontStyleFieldOption
        name={"Font size"}
        path={`typography.button.fontSize`}
        templateValue={theme.typography.button.fontSize as string | number}
      />

      <FontWeightOption
        name={"Font weight"}
        path="typography.button.fontWeight"
        templateValue={theme.typography.button.fontWeight as string | number}
      />
    </TypographyOptionGroup>
  );
}

export default ButtonTypography;

