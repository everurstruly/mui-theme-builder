import ButtonTypography from "./Variants/Button";
import FontFamilyBaselineTypography from "./FontFamilyBaseline";
import HeadlineTypography from "./Variants/Headline";

export default function TypographyProperty() {
  return (
    <>
      <FontFamilyBaselineTypography />
      <HeadlineTypography title="H1" />
      <HeadlineTypography title="H2" />
      <HeadlineTypography title="H3" />
      <HeadlineTypography title="H4" />
      <HeadlineTypography title="H5" />
      <HeadlineTypography title="H6" />
      <ButtonTypography />
    </>
  );
}
