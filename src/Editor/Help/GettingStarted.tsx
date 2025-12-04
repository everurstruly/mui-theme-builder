import { Box, Typography } from "@mui/material";
import {
  AutoAwesome,
  Create,
  Search,
  Edit,
  FileDownload,
} from "@mui/icons-material";

export default function GettingStarted() {
  const steps = [
    {
      icon: <Create />,
      title: "Create Your Design",
      description:
        "Start by clicking the 'New Design' button or use the keyboard shortcut Ctrl+N. Choose from our collection of professionally crafted templates or start with a blank canvas to build your theme from scratch.",
    },
    {
      icon: <Search />,
      title: "Find & Navigate",
      description:
        "Use the Explorer panel to browse through your design components. Press Ctrl+P to quickly search and jump to any part of your theme. The folder structure keeps everything organized and easy to find.",
    },
    {
      icon: <Edit />,
      title: "Edit with Precision",
      description:
        "Customize every aspect of your Material-UI theme using the Properties panel. Adjust colors, typography, spacing, and more. See your changes reflected instantly in the preview canvas with hot reload.",
    },
    {
      icon: <FileDownload />,
      title: "Export Your Theme",
      description:
        "When you're satisfied with your design, press Ctrl+E or click the Export button. Choose your preferred format (TypeScript or JavaScript), toggle default merging, and download or copy your theme configuration.",
    },
  ];

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        py: 2,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <AutoAwesome
          sx={{
            fontSize: 48,
            color: "primary.main",
            mb: 2,
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Welcome to MUI Theme Builder
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your visual companion for creating beautiful Material-UI themes
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {steps.map((step, index) => (
          <Box key={index} sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                flexShrink: 0,
                width: 48,
                height: 48,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(144, 202, 249, 0.16)"
                    : "rgba(25, 118, 210, 0.08)",
                color: "primary.main",
              }}
            >
              {step.icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </Box>
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 3,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.02)",
          border: (theme) =>
            `1px solid ${
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.08)"
            }`,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Pro Tip
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Press <code style={{ padding: "2px 6px", borderRadius: 4 }}>?</code>{" "}
          anytime to open this help dialog. Check the Keyboard Shortcuts tab to
          discover more time-saving shortcuts!
        </Typography>
      </Box>
    </Box>
  );
}
