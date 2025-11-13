import FontStyleRangedOption from "../FontStyleOptions/FontStyleRangedOption";
import FontWeightOption from "../FontWeightOption/FontWeightOption";
import FontStyleFieldOption from "../FontStyleOptions/FontStyleFieldOption";
import { useThemeDesignTheme } from "../../../ThemeDesign";
import TypographyOptionGroup from "../TypographyOptionGroup";

type HeadlineTypographyProps = {
  title: string;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

function HeadlineTypography(props: HeadlineTypographyProps) {
  const theme = useThemeDesignTheme();
  const variant = props.variant;
  const variantTypography = theme.typography[variant];

  return (
    <TypographyOptionGroup title={props.title}>
      <FontWeightOption
        name={"Font weight"}
        path={`typography.${variant}.fontWeight`}
        templateValue={variantTypography.fontWeight as number | string}
      />

      <FontStyleFieldOption
        name={"Font size"}
        path={`typography.${variant}.fontSize`}
        templateValue={variantTypography.fontSize as string | number}
      />

      <FontStyleFieldOption
        name={"Letter Spacing"}
        path={`typography.${variant}.letterSpacing`}
        templateValue={variantTypography.letterSpacing as string | number}
      />

      <FontStyleRangedOption
        name={"Line height"}
        path={`typography.${variant}.lineHeight`}
        templateValue={variantTypography.lineHeight as string | number}
      />
    </TypographyOptionGroup>
  );
}

export default HeadlineTypography;

