/**
 * CollectionDialog
 * 
 * Full-screen dialog for browsing saved designs.
 * Alternative to CollectionPopoverMenuButton with more screen space.
 * 
 * Features:
 * - Search/filter designs
 * - Sort by name/date
 * - Grid or list view
 * - Bulk operations
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
import { useCallback } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useCollection, useLoad } from '../hooks';
import { getPersistenceDependencies } from '../persistenceRegistry';
import { usePersistenceStore } from '../persistenceStore';

interface CollectionDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CollectionDialog({ open, onClose }: CollectionDialogProps) {
  const { collection, refreshCollection, isLoading } = useCollection();
  const { load, isLoading: isLoadingDesign } = useLoad();
  const { currentSnapshotId, setSnapshotId } = usePersistenceStore();
  
  const handleLoadDesign = useCallback(async (id: string) => {
    try {
      await load(id);
      onClose();
    } catch (error) {
      console.error('Failed to load design:', error);
    }
  }, [load, onClose]);

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

  const filteredAndSortedCollection = collection
    .sort((a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt));

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(timestamp);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6">Saved Designs</Typography>
          <Typography variant="caption" color="text.secondary">
            {filteredAndSortedCollection.length} of {collection.length} design{collection.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <IconButton edge="end" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {/* Design List */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : filteredAndSortedCollection.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No saved designs yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredAndSortedCollection.map((item: any, index: number) => (
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
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    onClick={() => handleLoadDesign(item.id)}
                    disabled={isLoadingDesign}
                    sx={{ py: 2 }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={500}>
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                          <Typography variant="caption" component="span" color="text.secondary">
                            Created: {formatDate(item.createdAt)}
                          </Typography>
                          {item.updatedAt && item.updatedAt !== item.createdAt && (
                            <Typography variant="caption" component="span" color="primary.main">
                              Updated: {formatRelativeTime(item.updatedAt)}
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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
