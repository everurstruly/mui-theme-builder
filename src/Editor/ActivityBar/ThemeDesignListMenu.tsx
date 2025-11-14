import { Stack } from "@mui/material";
import OpenLibraryButton from "./OpenLibraryButton";
import CreateNewThemeDesign from "./CreateNewThemeDesign";

function ThemeDesignListMenu() {
  return (
    <Stack direction={"row"} spacing={1.5}>
      <OpenLibraryButton />
      <CreateNewThemeDesign />
    </Stack>
  );
}

export default ThemeDesignListMenu;
