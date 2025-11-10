/**
 * Example: Complete ThemeSheet Demo
 * 
 * This file demonstrates all major features of the ThemeSheet module.
 */

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ThemePreviewPane,
  useThemeSheetEditValue,
  useThemeSheetStore,
  useThemeSheetHistory,
  listBaseThemeIds,
  listComposables,
} from './index';

// ===== Example 1: Simple Color Picker =====
function ColorPicker({ path, label }: { path: string; label: string }) {
  const { value, setValue, isControlledByFunction, isOverridden, resetToBase } =
    useThemeSheetEditValue(path);

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField
        label={label}
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        disabled={isControlledByFunction}
        size="small"
        sx={{ flex: 1 }}
        helperText={
          isControlledByFunction
            ? '⚠️ Controlled by function'
            : isOverridden
              ? 'Modified'
              : 'Default'
        }
      />
      {isOverridden && (
        <Button size="small" onClick={resetToBase}>
          Reset
        </Button>
      )}
    </Box>
  );
}

// ===== Example 2: Base Theme Selector =====
function BaseThemeSelector() {
  const store = useThemeSheetStore();
  const themes = listBaseThemeIds();

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Base Theme
      </Typography>
      <Select
        value={store.activeBaseThemeOption.ref}
        onChange={(e) =>
          store.setActiveBaseTheme({ type: 'static', ref: e.target.value })
        }
        size="small"
        fullWidth
      >
        {themes.map((id) => (
          <MenuItem key={id} value={id}>
            {id}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

// ===== Example 3: Composables Panel =====
function ComposablesPanel() {
  const store = useThemeSheetStore();
  const composables = listComposables();

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Appearance Composables
      </Typography>
      <Stack spacing={0.5}>
        {composables.map((comp) => (
          <FormControlLabel
            key={comp.id}
            control={
              <Switch
                checked={store.appearanceComposablesState[comp.id]?.enabled || false}
                onChange={(e) => store.toggleComposable(comp.id, e.target.checked)}
                size="small"
              />
            }
            label={comp.label}
          />
        ))}
      </Stack>
    </Box>
  );
}

// ===== Example 4: Save/Discard Controls =====
function SaveDiscardControls() {
  const store = useThemeSheetStore();
  const { canUndo, canRedo, undo, redo, historySize } = useThemeSheetHistory();

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          onClick={() => store.commitRawModifications()}
          disabled={!store.isDirty}
          size="small"
        >
          💾 Save Changes
        </Button>
        <Button
          variant="outlined"
          onClick={() => store.discardChanges()}
          disabled={!store.isDirty}
          size="small"
        >
          🗑️ Discard
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          variant="outlined"
          onClick={() => undo()}
          disabled={!canUndo}
          size="small"
        >
          ↶ Undo
        </Button>
        <Button
          variant="outlined"
          onClick={() => redo()}
          disabled={!canRedo}
          size="small"
        >
          ↷ Redo
        </Button>
        <Typography variant="caption" color="text.secondary">
          {historySize} {historySize === 1 ? 'revision' : 'revisions'}
        </Typography>
      </Stack>

      {store.isDirty && (
        <Typography variant="caption" color="warning.main">
          ⚠️ Unsaved changes
        </Typography>
      )}
    </Stack>
  );
}

// ===== Example 5: Preview Content =====
function PreviewContent() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Theme Preview</Typography>
      <Typography variant="body1">
        This content is rendered with the live theme. Changes appear instantly!
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
      </Stack>
      <TextField label="Sample Input" placeholder="Type here..." />
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Card Example</Typography>
        <Typography variant="body2">
          This is a paper component with theme-based styling.
        </Typography>
      </Paper>
    </Stack>
  );
}

// ===== Main Demo Component =====
export function ThemeSheetDemo() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Panel: Controls */}
      <Box
        sx={{
          width: 300,
          p: 2,
          borderRight: 1,
          borderColor: 'divider',
          overflow: 'auto',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Theme Controls
        </Typography>

        <Stack spacing={3}>
          <BaseThemeSelector />
          <ComposablesPanel />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Colors
            </Typography>
            <Stack spacing={1}>
              <ColorPicker path="palette.primary.main" label="Primary" />
              <ColorPicker path="palette.secondary.main" label="Secondary" />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Shape
            </Typography>
            <ColorPicker path="shape.borderRadius" label="Border Radius" />
          </Box>

          <SaveDiscardControls />
        </Stack>
      </Box>

      {/* Right Panel: Preview */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <ThemePreviewPane>
          <Box sx={{ p: 3 }}>
            <PreviewContent />
          </Box>
        </ThemePreviewPane>
      </Box>
    </Box>
  );
}

export default ThemeSheetDemo;

