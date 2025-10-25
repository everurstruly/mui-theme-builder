import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  ListItemButton,
  ListItemText,
  type ListItemTextProps,
} from "@mui/material";

export default function ListItemButtonWithMenu({
  text,
  children,
}: {
  text: ListItemTextProps;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        "& .listItemButtonMenu": { display: "none" },
        "&:hover .listItemButtonMenu": {
          display: "block",
        },

        "& .listItemButtonIcon__close": { display: "block" },
        "& .listItemButtonIcon__open": { display: "none" },
        "&:hover .listItemButtonIcon__open": { display: "block" },
        "&:hover .listItemButtonIcon__close": { display: "none" },
      }}
    >
      <ListItemButton>
        <ListItemText primary={text.primary} />
        <ExpandLess className="listItemButtonIcon__close" />
        <ExpandMore className="listItemButtonIcon__open" />
      </ListItemButton>

      <Box
        className="listItemButtonMenu"
        sx={{ borderLeft: 1, borderColor: "divider", ml: 2 }}
      >
        {children}
      </Box>
    </Box>
  );
}
