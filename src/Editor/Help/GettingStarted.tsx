import { Box, Stack, Typography } from "@mui/material";
import { AutoAwesome, Edit, FileDownload, Search } from "@mui/icons-material";

export default function GettingStarted() {
  const steps = [
    {
      icon: <Search />,
      title: "Find or Create",
      description:
        "Start by clicking the 'Create' button or press the 'n' shortcut. You can cycle through curated starter themes to get a head start, or choose a blank canvas to build your theme from scratch.",
    },
    {
      icon: <Edit />,
      title: "Edit & Generate",
      description:
        "Use the Properties panel to customize every aspect of your theme. Adjust colors, typography, spacing, and more with our intuitive controls. See your changes in real-time on the Canvas as you tweak your design.",
    },
    {
      icon: <FileDownload />,
      title: "Preview & Export",
      description:
        'When you\'re satisfied with your design, press Ctrl+P or click the "Export" button. Choose your preferred format (TypeScript or JavaScript), and download or copy your theme.',
    },
  ];

  return (
    <Box
      sx={{
        mx: "auto",
        pt: 1,
        pb: 4,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <AutoAwesome
          sx={{
            fontSize: 36,
            color: "primary.main",
            mb: 2,
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Welcome to MUI Theme Builder
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your visual companion for creating beautiful Material-UI themes
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 5 }}>
        {steps.map((step, index) => (
          <Stack key={index} sx={{ gap: 2 }}>
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
          </Stack>
        ))}
      </Box>
    </Box>
  );
}
