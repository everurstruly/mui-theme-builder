import { Stack } from "@mui/material";
import OpenLibraryButton from "./OpenLibraryButton";
import CreateNewThemeDesign from "./CreateNewThemeDesign";

export default function DesignActionListMenu() {
  return (
    <Stack direction={"row"} spacing={2} sx={{ px: 1}}>
      <OpenLibraryButton />
      <CreateNewThemeDesign />
    </Stack>
  );
}