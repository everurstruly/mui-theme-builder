import { Box, Typography } from "@mui/material";
import {
  EmojiObjects,
  Celebration,
  Coffee,
  Favorite,
} from "@mui/icons-material";

export default function Misc() {
  const satirePieces = [
    {
      icon: <EmojiObjects />,
      title: "The Theme Builder Philosophy",
      content:
        "We believe that choosing the perfect shade of blue is not just a design decision—it's a spiritual journey. Some say enlightenment comes from meditation. We say it comes from adjusting HSL values at 2 AM.",
    },
    {
      icon: <Coffee />,
      title: "Productivity Tips",
      content:
        "Remember: A designer who says 'I'll just quickly tweak the padding' is the same as a developer who says 'I'll just quickly refactor this.' Three hours later, you've redesigned the entire component library. This is the way.",
    },
    {
      icon: <Favorite />,
      title: "On Color Choices",
      content:
        "There are 16,777,216 possible colors in RGB. But let's be honest, you'll spend 4 hours choosing between two nearly identical shades of grey that literally no one else will notice. And that's okay. Perfection is in the pixels.",
    },
    {
      icon: <Celebration />,
      title: "Export Achievement Unlocked",
      content:
        "Congratulations! You've successfully exported your theme. You are now legally allowed to tell people you're a 'Design Systems Engineer' on LinkedIn. Your theme's beauty/elegance ratio is off the charts (we don't actually measure this, but it sounds impressive).",
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
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Miscellaneous Wisdom
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Important information you definitely need to know
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {satirePieces.map((piece, index) => (
          <Box
            key={index}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(0, 0, 0, 0.02)",
              border: (theme) =>
                `1px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.08)"
                }`,
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(144, 202, 249, 0.16)"
                      : "rgba(25, 118, 210, 0.08)",
                  color: "primary.main",
                }}
              >
                {piece.icon}
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {piece.title}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              {piece.content}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(156, 39, 176, 0.1)"
              : "rgba(156, 39, 176, 0.08)",
          border: (theme) =>
            `1px solid ${
              theme.palette.mode === "dark"
                ? "rgba(186, 104, 200, 0.3)"
                : "rgba(156, 39, 176, 0.2)"
            }`,
          textAlign: "center",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 1, fontSize: "1rem" }}
        >
          🎨 The Ultimate Truth
        </Typography>
        <Typography variant="body2" color="text.secondary">
          "Design is not just what it looks like and feels like. Design is how
          it works... but mostly how it looks." — Steve Jobs (probably)
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="caption" color="text.secondary">
          Made with ☕ and an unhealthy obsession with border-radius values
        </Typography>
      </Box>
    </Box>
  );
}
