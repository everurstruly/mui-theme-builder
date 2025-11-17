import { Stack } from "@mui/material";
import OpenLibraryButton from "./OpenLibraryButton";
import CreateNewThemeDesign from "./CreateNewThemeDesign";

export default function DesignActionListMenu() {
  return (
    <Stack direction={"row"} columnGap={3}>
      <OpenLibraryButton />
      <CreateNewThemeDesign />
    </Stack>
  );
}
