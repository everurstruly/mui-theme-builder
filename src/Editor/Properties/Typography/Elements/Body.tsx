import FontFamilyOption from "../FontFamily/FontFamilyOption";
import FontStyleFieldOption from "../FontStyleOptions/FontStyleFieldOption";
import FontWeightOption from "../FontWeightOption/FontWeightOption";
import { useThemeDesignTheme } from "../../../Design";
import TypographyOptionGroup from "../TypographyOptionGroup";

function BodyTypography() {
  const theme = useThemeDesignTheme();

  return (
    <TypographyOptionGroup title="Body (p)">
      <FontFamilyOption
        name={"Font family"}
        path="typography.body1.fontFamily"
        templateValue={(theme.typography.body1.fontFamily || theme.typography.fontFamily) as string}
      />

      <FontStyleFieldOption
        name={"Font size"}
        path={`typography.body1.fontSize`}
        templateValue={theme.typography.body1.fontSize as string | number}
      />

      <FontWeightOption
        name={"Font weight"}
        path="typography.body1.fontWeight"
        templateValue={theme.typography.body1.fontWeight as string | number}
      />

      <FontStyleFieldOption
        name={"Line height"}
        path="typography.body1.lineHeight"
        templateValue={theme.typography.body1.lineHeight as string | number}
      />
    </TypographyOptionGroup>
  );
}

export default BodyTypography;

