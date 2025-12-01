/**
 * CollectionDialogButton
 * 
 * Button that opens the CollectionDialog for browsing saved designs.
 * Drop-in replacement for CollectionPopoverMenuButton with the same API.
 */

import { Button } from '@mui/material';
import { useState } from 'react';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useCollection } from '../hooks';
import CollectionDialog from './CollectionDialog';

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
