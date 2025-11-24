import { MoreVertOutlined } from "@mui/icons-material";
import { Stack, Typography, IconButton } from "@mui/material";
import { useDesignStore } from "../Design/designStore";

function CurrentThemeDesignStatus() {
  const title = useDesignStore((s) => s.title);
  const hasUnsavedChanges = useDesignStore((s) => s.hasUnsavedChanges);

  return (
    <Stack direction="row" sx={{ px: 1, flexGrow: 1 }}>
      <Stack sx={{ overflow: "hidden", flexGrow: 1 }}>
        <Typography
          variant="caption"
          fontWeight={"bold"}
          color="primary"
          sx={{ whiteSpace: "nowrap", p: 0 }}
        >
          You're editing
        </Typography>

        <Typography
          variant="body2"
          sx={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            lineHeight: 1,
            mb: "3px",
            overflow: "hidden",
          }}
        >
          {title} {hasUnsavedChanges ? "(unsaved)" : ""}
        </Typography>
      </Stack>
      <IconButton>
        <MoreVertOutlined />
      </IconButton>
    </Stack>

    // rename, duplicate, copy, delete
  );
}

export default CurrentThemeDesignStatus;
