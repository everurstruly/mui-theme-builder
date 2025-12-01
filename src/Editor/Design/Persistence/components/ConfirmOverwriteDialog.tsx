/**
 * ConfirmOverwriteDialog
 * 
 * Dialog shown when user attempts to save with a conflicting title.
 * Provides options to:
 * - Overwrite the existing design
 * - Save as new with a different title
 * - Cancel the operation
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useState } from 'react';

interface ConfirmOverwriteDialogProps {
  open: boolean;
  existingTitle: string;
  existingId: string;
  onClose: () => void;
  onOverwrite: () => void;
  onSaveAsNew: (newTitle: string) => void;
}

export default function ConfirmOverwriteDialog({
  open,
  existingTitle,
  existingId,
  onClose,
  onOverwrite,
  onSaveAsNew,
}: ConfirmOverwriteDialogProps) {
  const [newTitle, setNewTitle] = useState('');
  const [mode, setMode] = useState<'choose' | 'rename'>('choose');

  const handleSaveAsNew = () => {
    if (newTitle.trim()) {
      onSaveAsNew(newTitle.trim());
      setNewTitle('');
      setMode('choose');
    }
  };

  const handleClose = () => {
    setNewTitle('');
    setMode('choose');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'choose' ? 'Design Title Already Exists' : 'Choose New Title'}
      </DialogTitle>
      
      <DialogContent>
        {mode === 'choose' ? (
          <DialogContentText>
            A design with the title "{existingTitle}" already exists (ID: {existingId.slice(0, 8)}...).
            <br /><br />
            Would you like to overwrite it or save as a new design with a different title?
          </DialogContentText>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <DialogContentText>
              Enter a new title for your design:
            </DialogContentText>
            <TextField
              autoFocus
              fullWidth
              label="New Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newTitle.trim()) {
                  handleSaveAsNew();
                }
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        
        {mode === 'choose' ? (
          <>
            <Button onClick={() => setMode('rename')} color="primary">
              Save as New
            </Button>
            <Button onClick={onOverwrite} color="warning" variant="contained">
              Overwrite Existing
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleSaveAsNew} 
            color="primary" 
            variant="contained"
            disabled={!newTitle.trim()}
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
