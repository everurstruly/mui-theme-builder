import StylesAppearance from "./Styles/Styles";
import SpacingAppearance from "./Spacing/Spacing";
import { Stack } from "@mui/material";

export default function AppearanceProperty() {
  return (
    <Stack>
      <StylesAppearance title="Shape" />
      <SpacingAppearance title="Spacing" />
    </Stack>
  );
}
