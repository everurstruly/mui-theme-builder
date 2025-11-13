import { Box, Button, Typography, Paper, Stack, Divider } from "@mui/material";

function ButtonsSection() {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" mb={2}>
        Button Typography
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
        <Button variant="contained" size="small">
          Small Button
        </Button>
        <Button variant="contained" size="medium">
          Medium Button
        </Button>
        <Button variant="contained" size="large">
          Large Button
        </Button>
        <Button variant="outlined">Outlined Button</Button>
        <Button variant="text">Text Button</Button>
      </Stack>
    </Paper>
  );
}

function BackgroundsSection() {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" mb={2}>
        Backgrounds & Paper
      </Typography>
      <Stack spacing={2}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Default Paper (theme background.paper)
          </Typography>
          <Paper sx={{ p: 2, mt: 1 }} elevation={1}>
            This is default Paper using <strong>background.paper</strong>.
          </Paper>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Colored background (primary)
          </Typography>
          <Paper
            sx={{
              p: 2,
              mt: 1,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
            }}
            elevation={0}
          >
            Paper with primary background and contrast text
          </Paper>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Elevation samples
          </Typography>
          <Stack direction="row" spacing={2} mt={1}>
            <Paper sx={{ p: 1, width: 120 }}>elevation 0</Paper>
            <Paper sx={{ p: 1, width: 120 }} elevation={1}>
              elevation 1
            </Paper>
            <Paper sx={{ p: 1, width: 120 }} elevation={8}>
              elevation 8
            </Paper>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

function TypographyPlayground() {
  return (
    <>
      {/* Headlines Section */}
      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" mb={2}>
          Headlines
        </Typography>
        <Stack spacing={2}>
          <Typography variant="h1">H1 - The quick brown fox</Typography>
          <Typography variant="h2">H2 - The quick brown fox</Typography>
          <Typography variant="h3">H3 - The quick brown fox</Typography>
          <Typography variant="h4">H4 - The quick brown fox</Typography>
          <Typography variant="h5">H5 - The quick brown fox</Typography>
          <Typography variant="h6">H6 - The quick brown fox</Typography>
        </Stack>
      </Paper>
      <Divider sx={{ my: 2 }} />

      {/* Body Text Section */}
      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" mb={2}>
          Body Text
        </Typography>
        <Stack spacing={2}>
          <Typography variant="body1">
            Body 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
          <Typography variant="body2">
            Body 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
          <Typography variant="subtitle1">
            Subtitle 1 - A subtitle is a secondary title
          </Typography>
          <Typography variant="subtitle2">
            Subtitle 2 - A subtitle is a secondary title
          </Typography>
          <Typography variant="caption" display="block">
            Caption - This is a caption text
          </Typography>
          <Typography variant="overline" display="block">
            Overline - This is an overline text
          </Typography>
        </Stack>
      </Paper>
    </>
  );
}

export default function DevSandbox() {
  return (
    <Stack spacing={8} px={2} pb={16}>
      <TypographyPlayground />
      <BackgroundsSection />
      <ButtonsSection />
    </Stack>
  );
}
