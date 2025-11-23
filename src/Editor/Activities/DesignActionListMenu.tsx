import { Stack, type SxProps } from "@mui/material";
import CreateNewThemeDesign from "./CreateNewThemeDesign";

export default function DesignActionListMenu({ sx }: { sx?: SxProps }) {
  return (
    <Stack direction={"row"} sx={sx}>
      <CreateNewThemeDesign />
    </Stack>
  );
}
