import { Button } from '@mui/material';
import { useState } from 'react';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CollectionDialog from "./CollectionDialog";
import { useCollection } from "./useCollection";

export default function CollectionDialogButton() {
  const { collection, isLoading } = useCollection();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        startIcon={<FolderOpenIcon />}
        disabled={isLoading}
      >
        Designs ({collection.length})
      </Button>

      <CollectionDialog 
        open={open} 
        onClose={() => setOpen(false)} 
      />
    </>
  );
}
