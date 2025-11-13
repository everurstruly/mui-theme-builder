import { Stack, Button } from "@mui/material";
// import NewThemeSheetButton from "./NewThemeSheettButton";
import OpenLibraryButton from "./OpenLibraryButton";

function ThemeDesignListMenu() {
  return (
    <Stack
      direction={"row"}
      columnGap={1}
    >
      {/* <NewThemeSheetButton /> */}
      <OpenLibraryButton />
      <Button sx={{ minWidth: 0 }}>Try a Template</Button>
    </Stack>
  );
}

export default ThemeDesignListMenu;
