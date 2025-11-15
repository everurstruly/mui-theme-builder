import { Stack } from "@mui/material";
import OpenLibraryButton from "./OpenLibraryButton";
import CreateNewThemeDesign from "./CreateNewThemeDesign";

function ThemeDesignListMenu() {
  return (
    <Stack direction={"row"} spacing={2} sx={{ px: 1}}>
      <OpenLibraryButton />
      <CreateNewThemeDesign />
    </Stack>
  );
}

export default ThemeDesignListMenu;
