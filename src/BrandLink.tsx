import { ArchitectureRounded } from "@mui/icons-material";
import { Box, Typography, type SxProps } from "@mui/material";
import { Link } from "react-router";

export default function BrandLink({ sx }: { sx?: SxProps }) {
  return (
    <Box
      component={Link}
      to="/"
      sx={{
        mr: "auto",
        ...sx,
      }}
    >
      <Typography
        noWrap
        variant="subtitle1"
        fontWeight="semibold"
        color="text.primary"
        sx={{
          display: "flex",
          alignItems: "center",
          px: (theme) => theme.spacing(1), // mimic padding of buttons
        }}
      >
        <ArchitectureRounded
          fontSize="small"
          sx={{ marginInlineStart: -0.5, mb: 0.2 }}
        />
        MUI Theme Editor
      </Typography>
    </Box>
  );
}
