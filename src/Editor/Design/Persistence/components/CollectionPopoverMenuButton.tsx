/**
 * CollectionPopoverMenuButton
 * 
 * Button that opens a popover menu showing all saved designs.
 * Allows users to:
 * - Browse their design collection
 * - Load existing designs
 * - Delete designs
 * - See design metadata (created/updated dates)
 */

import {
  Button,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useState, useCallback } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useCollection, useLoad } from '../hooks';
import { getPersistenceDependencies } from '../persistenceRegistry';
import { usePersistenceStore } from '../persistenceStore';

export default function CollectionPopoverMenuButton() {
  const { collection, refreshCollection, isLoading } = useCollection();
  const { load, isLoading: isLoadingDesign } = useLoad();
  const { currentSnapshotId, setSnapshotId } = usePersistenceStore();
  
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    refreshCollection(); // Refresh when opening
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoadDesign = useCallback(async (id: string) => {
    try {
      await load(id);
      handleClose();
    } catch (error) {
      console.error('Failed to load design:', error);
    }
  }, [load]);

  const handleDeleteDesign = useCallback(async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this design?')) {
      return;
    }

    try {
      // If deleting the currently open design, clear the snapshot ID
      if (id === currentSnapshotId) {
        setSnapshotId(null);
      }

      const { adapter } = getPersistenceDependencies();
      await adapter.delete(id);
      await refreshCollection();
    } catch (error) {
      console.error('Failed to delete design:', error);
    }
  }, [refreshCollection, currentSnapshotId, setSnapshotId]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<FolderOpenIcon />}
        disabled={isLoading}
      >
        Designs ({collection.length})
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ minWidth: 350, maxWidth: 500, maxHeight: 500 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Saved Designs</Typography>
            <Typography variant="caption" color="text.secondary">
              {collection.length} design{collection.length !== 1 ? 's' : ''}
            </Typography>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : collection.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No saved designs yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
              {collection.map((item, index) => (
                <Box key={item.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    disablePadding
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => handleDeleteDesign(item.id, e)}
                        disabled={isLoadingDesign}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      onClick={() => handleLoadDesign(item.id)}
                      disabled={isLoadingDesign}
                    >
                      <ListItemText
                        primary={item.title}
                        secondary={
                          <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="caption" component="span">
                              Created: {formatDate(item.createdAt)}
                            </Typography>
                            {item.updatedAt && item.updatedAt !== item.createdAt && (
                              <Typography variant="caption" component="span">
                                Updated: {formatDate(item.updatedAt)}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
}
