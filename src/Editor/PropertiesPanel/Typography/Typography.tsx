import ButtonTypography from "./Elements/Button";
import FontFamilyTypography from "./FontFamily/FontFamily";
import HeadlineTypography from "./Elements/Headline";

export default function TypographyProperty() {
  return (
    <>
      <FontFamilyTypography />
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

