import {
  ListItem,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import type { VersionMetadata } from "../storage/types";

interface VersionItemProps {
  version: VersionMetadata;
  onView: (versionId: string) => void;
  onRestore: (versionId: string) => void;
  onLoadAsNew: (versionId: string) => void;
  onDelete: (versionId: string) => void;
}

export function VersionItem({
  version,
  onView,
  onRestore,
  onLoadAsNew,
  onDelete,
}: VersionItemProps) {
  const formattedDate = new Date(version.createdAt).toLocaleString();
  const relativeTime = getRelativeTime(version.createdAt);

  return (
    <ListItem
      divider
      sx={{
        flexDirection: "column",
        alignItems: "flex-start",
        py: 2,
      }}
    >
      <Box sx={{ width: "100%", mb: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {relativeTime}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formattedDate}
        </Typography>
      </Box>

      {/* Color preview could go here */}
      
      <Box sx={{ display: "flex", gap: 0.5, mt: 1 }}>
        <IconButton
          size="small"
          onClick={() => onView(version.id)}
          title="View version"
        >
          <ViewIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onRestore(version.id)}
          title="Restore this version"
        >
          <RestoreIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onLoadAsNew(version.id)}
          title="Load as new design"
        >
          <CopyIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(version.id)}
          title="Delete version"
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </ListItem>
  );
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 1) return `${days} days ago`;
  if (days === 1) return "Yesterday";
  if (hours > 1) return `${hours} hours ago`;
  if (hours === 1) return "1 hour ago";
  if (minutes > 1) return `${minutes} minutes ago`;
  if (minutes === 1) return "1 minute ago";
  return "Just now";
}
