import { Stack, type SxProps } from "@mui/material";
import CollectionPopoverMenuButton from "../Design/Storage/CollectionPopoverMenuButton";
import LoaderDialogOpenButton from "../Design/Loader/LoaderDialogOpenButton";

export default function DesignActionMenu({ sx }: { sx?: SxProps }) {
  return (
    <Stack direction={"row"} sx={sx}>
      <CollectionPopoverMenuButton />
      <LoaderDialogOpenButton />
    </Stack>
  );
}
