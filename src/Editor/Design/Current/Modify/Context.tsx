import React from "react";
import useCurrent from "../useCurrent";
import useEditor from "../../../useEditor";
import useDelete from "./useDelete";
import { MoreVertRounded } from "@mui/icons-material";
import { Typography, Menu, MenuItem, Button, type SxProps } from "@mui/material";
import { useTitle } from "./useTitle";
import { isFeatureEnabled } from "../../../../config/featureFlags";

function Context({ sx }: { sx?: SxProps }) {
  const { title } = useTitle();
  const { canDelete } = useDelete();
  const isViewingVersion = useCurrent((s) => s.isViewingVersion);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const actionMenuOpen = Boolean(anchorEl);
  const setVersionHistoryOpen = useEditor((s) => s.setVersionHistoryOpen);
  const setRenameDialogOpen = useEditor((s) => s.setRenameDialogOpen);
  const setDeleteConfirmationDialogOpen = useEditor(
    (s) => s.setDeleteConfirmationDialogOpen
  );

  const handleMenuClose = () => setAnchorEl(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleVersionHistory = () => {
    setVersionHistoryOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    handleMenuClose();
    setDeleteConfirmationDialogOpen(true);
  };

  const handleRename = () => {
    setRenameDialogOpen(true);
    handleMenuClose();
  };

  return (
    <>
      <Button
        onClick={handleMenuOpen}
        sx={{
          display: "flex",
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: 1,
          ...sx,
        }}
      >
        <Typography
          variant="button"
          color="primary"
          sx={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {isViewingVersion ? "You're previewing —" : "You're editing —"}{" "}
          <Typography
            variant="caption"
            color="textPrimary"
            sx={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              lineHeight: 1,
              overflow: "hidden",
              alignItems: "center",
              display: "inline-flex",
              columnGap: 0.5,
            }}
          >
            {title} <MoreVertRounded sx={{ fontSize: "14px" }} />
          </Typography>
        </Typography>
      </Button>

      <Menu
        id="design-menu"
        anchorEl={anchorEl}
        open={actionMenuOpen}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: 230,
            },
          },
        }}
      >
        <MenuItem dense onClick={handleRename}>
          Rename
        </MenuItem>

        {isFeatureEnabled("SHOW_VERSION_HISTORY") && (
          <MenuItem dense onClick={handleVersionHistory} disabled={!canDelete}>
            Version History
          </MenuItem>
        )}

        <MenuItem dense onClick={handleDelete} disabled={!canDelete}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}

export default Context;
