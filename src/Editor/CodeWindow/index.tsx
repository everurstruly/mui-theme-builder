import React from "react";
import {
  Collapse,
  Button,
  Typography,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import { DataObjectRounded } from "@mui/icons-material";

export default function CodeWindow() {
  const [codeWindowexpanded, setExpanded] = React.useState(false);

  const handleExpandCodeWindow = () => {
    setExpanded(!codeWindowexpanded);
  };

  return (
    <Stack
      sx={(theme) => ({
        borderBottom: 1,
        borderColor: "divider",
        maxHeight: "80vh",
        overflowY: "scroll",
        flexShrink: 0,
        marginBottom: 1,

        // show a very thin scrollbar as a visual affordance (still scrollable)
        msOverflowStyle: "auto", // IE and Edge
        scrollbarWidth: "thin", // Firefox
        "&::-webkit-scrollbar": {
          width: 4,
          height: 4,
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.18)"
              : "rgba(0,0,0,0.24)",
          borderRadius: 4,
        },
      })}
    >
      <Button
        color="inherit"
        variant="contained"
        onClick={handleExpandCodeWindow}
        aria-expanded={codeWindowexpanded}
        aria-label="show code window"
        startIcon={<DataObjectRounded sx={{ mr: 0 }} />}
        endIcon={codeWindowexpanded ? "▲" : "▼"}
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 0,
          position: "sticky",
          top: 0,
          minHeight: "var(--toolbar-height, 48px)",
          height: "var(--toolbar-height, 48px)",
          textTransform: "none",
          paddingInline: 2,
          "& .MuiButton-endIcon": {
            marginLeft: "auto",
          },
        }}
      >
        {codeWindowexpanded ? "Hide code window" : "Show code window"}
      </Button>

      <Collapse
        in={codeWindowexpanded}
        timeout="auto"
        unmountOnExit
        // sx={{ minHeight: codeWindowexpanded ? "600px" : "auto" }}
      >
        <Divider />

        <Box
          sx={{
            p: 2,
            backgroundColor: "rgb(39,40,34)",
            color: "rgb(140,156,152)",
            "*": {
              fontSize: "0.875rem !important",
              fontFamily: "Source Code Pro, monospace !important",
            },
          }}
        >
          <Typography sx={{ marginBottom: 2 }}>Method:</Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and
            set aside for 10 minutes.
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet
            over medium-high heat. Add chicken, shrimp and chorizo, and cook,
            stirring occasionally until lightly browned, 6 to 8 minutes.
            Transfer shrimp to a large plate and set aside, leaving chicken and
            chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes,
            onion, salt and pepper, and cook, stirring often until thickened and
            fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2
            cups chicken broth; bring to a boil.
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is
            absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved
            shrimp and mussels, tucking them down into the rice, and cook again
            without stirring, until mussels have opened and rice is just tender,
            5 to 7 minutes more. (Discard any mussels that don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then
            serve.
          </Typography>
        </Box>
      </Collapse>
    </Stack>
  );
}
