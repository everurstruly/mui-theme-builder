import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Button, useMediaQuery } from "@mui/material";
import { useManageCollection } from "./useManageCollection";
import { useCollection } from ".";

export default function CollectionDialogButton() {
  const { collection, isLoading } = useManageCollection();
  const showCollection = useCollection((s) => s.setMenuOpened);
  const shouldBeCompact = useMediaQuery("(max-width:400px)");
  const onClick = () => showCollection(true);

  return (
    <Button
      onClick={() => onClick()}
      startIcon={<FolderOpenIcon />}
      disabled={isLoading}
      sx={{
        minWidth: shouldBeCompact ? "0px" : undefined,
        "& .MuiButton-startIcon": {
          mr: shouldBeCompact ? 0 : undefined,
        },
      }}
    >
      {shouldBeCompact ? null : `Designs (${collection.length})`}
    </Button>
  );
}
