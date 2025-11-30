import StylesAppearance from "./Styles/Styles";
import SpacingAppearance from "./Spacing/Spacing";
import { memo } from "react";

function AppearanceProperty() {
  return (
    <>
      <StylesAppearance title="Shape" />
      <SpacingAppearance title="Spacing" />
    </>
  );
}

export default memo(AppearanceProperty);
