import ButtonTypography from "./Elements/Button";
import FontFamilyTypography from "./FontFamily/FontFamily";
import HeadlineTypography from "./Elements/Headline";
import { memo } from "react";

function TypographyProperty() {
  return (
    <>
      <FontFamilyTypography />
      <HeadlineTypography title="H1" variant="h1" />
      <HeadlineTypography title="H2" variant="h2" />
      <HeadlineTypography title="H3" variant="h3" />
      <HeadlineTypography title="H4" variant="h4" />
      <HeadlineTypography title="H5" variant="h5" />
      <HeadlineTypography title="H6" variant="h6" />
      <ButtonTypography />
    </>
  );
}

export default memo(TypographyProperty);

