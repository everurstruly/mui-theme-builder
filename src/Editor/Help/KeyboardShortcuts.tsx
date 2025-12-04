import { Box, Typography, Chip } from "@mui/material";
import {
  getShortcutsByCategory,
  categoryNames,
} from "../keyboardMappings";

export default function KeyboardShortcuts() {
  const categories = getShortcutsByCategory();

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
          Keyboard Shortcuts
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Master these shortcuts to boost your productivity
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {Object.entries(categories).map(([categoryKey, shortcuts]) => {
          if (shortcuts.length === 0) return null;

          return (
            <Box key={categoryKey}>
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: "text.secondary",
                  display: "block",
                  mb: 2,
                }}
              >
                {categoryNames[categoryKey as keyof typeof categoryNames]}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {shortcuts.map((shortcut, shortcutIndex) => (
                  <Box
                    key={shortcutIndex}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      borderRadius: 2,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.03)"
                          : "rgba(0, 0, 0, 0.02)",
                      border: (theme) =>
                        `1px solid ${
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.06)"
                            : "rgba(0, 0, 0, 0.06)"
                        }`,
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.03)",
                        borderColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ flex: 1, fontWeight: 500 }}
                    >
                      {shortcut.description}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {shortcut.displayKeys.map((key, keyIndex) => (
                        <Chip
                          key={keyIndex}
                          label={key}
                          size="small"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            height: 24,
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.1)"
                                : "rgba(0, 0, 0, 0.08)",
                            color: "text.primary",
                            border: (theme) =>
                              `1px solid ${
                                theme.palette.mode === "dark"
                                  ? "rgba(255, 255, 255, 0.2)"
                                  : "rgba(0, 0, 0, 0.15)"
                              }`,
                            "& .MuiChip-label": {
                              px: 1,
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(66, 165, 245, 0.1)"
              : "rgba(25, 118, 210, 0.08)",
          border: (theme) =>
            `1px solid ${
              theme.palette.mode === "dark"
                ? "rgba(66, 165, 245, 0.3)"
                : "rgba(25, 118, 210, 0.2)"
            }`,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          💡 Platform Note
        </Typography>
        <Typography variant="body2" color="text.secondary">
          On macOS, use <strong>Cmd</strong> instead of <strong>Ctrl</strong>{" "}
          for most shortcuts.
        </Typography>
      </Box>
    </Box>
  );
}
