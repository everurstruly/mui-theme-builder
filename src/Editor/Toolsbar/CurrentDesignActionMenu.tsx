import { Stack, type SxProps } from "@mui/material";
import StoreDesignPopoverMenu from "../Design/Storage/CollectionPopoverMenuButton";
import OpenDesignCreationDialogButton from "../Design/Creation/OpenDesignCreationDialogButton";

export default function CurrentDesignActionMenu({ sx }: { sx?: SxProps }) {
  return (
    <Stack direction={"row"} sx={sx}>
      <StoreDesignPopoverMenu />
      <OpenDesignCreationDialogButton />
    </Stack>
  );
}
