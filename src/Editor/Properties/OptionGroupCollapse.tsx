import React from "react";
import { Box, Collapse, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type OptionGroupCollapseBoxProps = {
  heading?: string;
  headingContent?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  maintainOpenState?: boolean;
};

const ExpandIcon = styled(ExpandMoreIcon, {
  shouldForwardProp: (prop) => prop !== "expand",
})<{ expand?: boolean }>(({ theme, expand }) => ({
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function OptionGroupCollapse({
  heading,
  headingContent,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  maintainOpenState: persistOpen = false,
}: OptionGroupCollapseBoxProps) {
  const [open, setOpen] = React.useState<boolean>(controlledOpen ?? defaultOpen);

  React.useEffect(() => {
    if (controlledOpen !== undefined) {
      setOpen(controlledOpen);
    }
  }, [controlledOpen]);

  const toggle = () => {
    const next = open ? (persistOpen ? true : false) : true;
    if (controlledOpen === undefined) {
      setOpen(next);
    }
    onOpenChange?.(next);
  };

  return (
    <>
      <Box
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {headingContent ?? (
          <Typography
            variant="subtitle2"
            flexGrow={1}
            sx={{
              userSelect: "none",
              cursor: "pointer",
              pt: 6,
              pb: 3,
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
          >
            {heading}
          </Typography>
        )}

        <IconButton
          size="small"
          aria-expanded={open}
          aria-label={open ? "Collapse" : "Expand"}
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          sx={{
            color: "text.secondary",
            paddingInlineEnd: 0,
            mt: 2,
          }}
        >
          <ExpandIcon expand={open} />
        </IconButton>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box
          sx={{
            pb: 4,
          }}
        >
          {children}
        </Box>
      </Collapse>
    </>
  );
}
