import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Button } from "@mui/material";
import { useManageCollection } from "./useManageCollection";
import { useCollection } from ".";

export default function CollectionDialogButton() {
  const { collection, isLoading } = useManageCollection();
  const showCollection = useCollection((s) => s.setMenuOpened);
  const onClick = () => showCollection(true);

  return (
    <Button
      onClick={() => onClick()}
      startIcon={<FolderOpenIcon />}
      disabled={isLoading}
    >
      Designs ({collection.length})
    </Button>
  );
}
