import { Stack, type SxProps } from "@mui/material";
import CollectionPopoverMenuButton from "../Design/Storage/CollectionPopoverMenuButton";
import OpenCreationDialogButton from "../Design/Creation/OpenCreationDialogButton";

export default function DesignActionMenu({ sx }: { sx?: SxProps }) {
  return (
    <Stack direction={"row"} sx={sx}>
      <CollectionPopoverMenuButton />
      <OpenCreationDialogButton />
    </Stack>
  );
}
