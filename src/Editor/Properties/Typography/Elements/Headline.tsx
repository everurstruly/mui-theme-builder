import FontStyleRangedOption from "../FontStyleOptions/FontStyleRangedOption";
import FontWeightOption from "../FontWeightOption/FontWeightOption";
import FontStyleFieldOption from "../FontStyleOptions/FontStyleFieldOption";
import TypographyOptionGroup from "../TypographyOptionGroup";

type HeadlineTypographyProps = {
  title: string;
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

function HeadlineTypography(props: HeadlineTypographyProps) {
  const variant = props.variant;

  return (
    <TypographyOptionGroup title={props.title}>
      <FontWeightOption
        name={"Font weight"}
        path={`typography.${variant}.fontWeight`}
      />

      <FontStyleFieldOption
        name={"Font size"}
        path={`typography.${variant}.fontSize`}
      />

      <FontStyleFieldOption
        name={"Letter Spacing"}
        path={`typography.${variant}.letterSpacing`}
      />

      <FontStyleRangedOption
        name={"Line height"}
        path={`typography.${variant}.lineHeight`}
      />
    </TypographyOptionGroup>
  );
}

export default HeadlineTypography;
