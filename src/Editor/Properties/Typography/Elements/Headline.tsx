import { memo, useMemo } from "react";
import FontStyleRangedOption from "../FontStyleOptions/FontStyleRangedOption";
import FontWeightOption from "../FontWeightOption/FontWeightOption";
import FontStyleFieldOption from "../FontStyleOptions/FontStyleFieldOption";
import TypographyOptionGroup from "../TypographyOptionGroup";

type HeadlineTypographyProps = {
  title: string;
  defaultOpen?: boolean;
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

function HeadlineTypography({ title, defaultOpen, variant }: HeadlineTypographyProps) {
  // Memoize the subtree so it only re-creates when `title` or `variant` change.
  const content = useMemo(
    () => (
      <TypographyOptionGroup title={title} defaultOpen={defaultOpen}>
        <FontWeightOption name={"Font weight"} path={`typography.${variant}.fontWeight`} />

        <FontStyleFieldOption name={"Font size"} path={`typography.${variant}.fontSize`} />

        <FontStyleFieldOption name={"Letter Spacing"} path={`typography.${variant}.letterSpacing`} />

        <FontStyleRangedOption name={"Line height"} path={`typography.${variant}.lineHeight`} />
      </TypographyOptionGroup>
    ),
    [title, variant, defaultOpen]
  );

  return content;
}

// memo the component to avoid re-renders when parent updates don't change props
export default memo(HeadlineTypography);
