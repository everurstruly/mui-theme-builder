import { Stack, type SxProps } from "@mui/material";
import CreateNewThemeDesign from "../Design/Creation/CreateNewThemeDesign";
import StoreDesignPopoverMenuButton from "../Design/Storage/StoreDesignPopoverMenuButton";

export default function DesignActionListMenu({ sx }: { sx?: SxProps }) {
  return (
    <Stack direction={"row"} sx={sx}>
      <StoreDesignPopoverMenuButton />
      <CreateNewThemeDesign />
    </Stack>
  );
}
