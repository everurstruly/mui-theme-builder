import { Stack } from "@mui/material";
import CreateNewThemeDesign from "./CreateNewThemeDesign";
import LoadTemplateButton from "./LoadTemplateButton";

export default function DesignActionListMenu() {
  return (
    <Stack direction={"row"} columnGap={3} mx={1.5}>
      <CreateNewThemeDesign />
      <LoadTemplateButton />
    </Stack>
  );
}
