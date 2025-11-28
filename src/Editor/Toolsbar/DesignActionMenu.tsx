import { Stack, type SxProps } from "@mui/material";
import CollectionPopoverMenuButton from "../Design/Storage/CollectionPopoverMenuButton";
import CreationDialogOpenButton from "../Design/Creation/CreationDialogOpenButton";

export default function DesignActionMenu({ sx }: { sx?: SxProps }) {
  return (
    <Stack direction={"row"} sx={sx}>
      <CollectionPopoverMenuButton />
      <CreationDialogOpenButton />
    </Stack>
  );
}
