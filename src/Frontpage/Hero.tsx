import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router";
import { styled } from "@mui/material/styles";
import { TuneOutlined } from "@mui/icons-material";

const StyledBox = styled("div")(({ theme }) => ({
  alignSelf: "center",
  width: "100%",
  minHeight: 200,
  marginTop: theme.spacing(8),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  outline: "6px solid",
  outlineColor: "hsla(220, 25%, 80%, 0.2)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.grey[200],
  boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
  backgroundImage: `url(${
    import.meta.env.VITE_TEMPLATE_IMAGE_URL || "/temp-editor-screenshot.png"
  })`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",

  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(10),
    minHeight: 600,
  },

  ...theme.applyStyles("dark", {
    boxShadow: "0 0 24px 12px hsla(210, 100%, 25%, 0.2)",
    // backgroundImage: `url(${
    //   import.meta.env.VITE_TEMPLATE_IMAGE_URL || "https://mui.com"
    // }/static/screenshots/material-ui/getting-started/templates/dashboard-dark.jpg)`,
    outlineColor: "hsla(220, 20%, 42%, 0.1)",
    borderColor: (theme.vars || theme).palette.grey[700],
  }),
}));

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundRepeat: "no-repeat",

        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
        ...theme.applyStyles("dark", {
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
        }),
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: "center", width: { xs: "100%", md: "70%" } }}
        >
          <Typography
            variant="h1"
            sx={{
              textAlign: "center",
              fontSize: "clamp(3rem, 10vw, 3.5rem)",
            }}
          >
            <Typography
              component="span"
              sx={(theme) => ({
                lineHeight: "inherit",
                fontSize: "inherit",
                fontFamily: "'Great Vibes', cursive",
                display: "inline-block",
                verticalAlign: "middle",
                mr: 0.6,
                transform: "skewX(-8deg) translateY(-4px) scale(1.12)",
                letterSpacing: "0.02em",
                color: (theme.vars || theme).palette.text.primary,
                textShadow: `0 6px 14px rgba(0,0,0,0.18)`,
                WebkitTextStroke: `0.6px rgba(0,0,0,0.08)`,
                // make it pop more on dark
                ...theme.applyStyles("dark", {
                  color: (theme.vars || theme).palette.text.primary,
                  textShadow: `0 6px 18px rgba(0,0,0,0.28)`,
                }),
                // slightly larger on small screens
                [theme.breakpoints.down("sm")]: {
                  transform: "skewX(-6deg) translateY(-2px) scale(1.05)",
                },
              })}
            >
              Design
            </Typography>{" "}
            &{" "}
            <Typography
              component="span"
              sx={(theme) => ({
                lineHeight: "inherit",
                fontSize: "0.98em",
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace',
                fontWeight: 700,
                // bgcolor:
                //   (theme.vars || theme).palette.mode === "dark"
                //     ? (theme.vars || theme).palette.grey[800]
                //     : (theme.vars || theme).palette.grey[100],
                color: (theme.vars || theme).palette.text.primary,
                px: 0.6,
                py: 0.2,
                borderRadius: 1,
                border: "1px solid",
                mr: 0.5,
                ...theme.applyStyles("dark", {}),
              })}
            >
              Prototype
            </Typography>{" "}
            <br />{" "}
            <Typography
              component="span"
              sx={(theme) => ({
                lineHeight: "inherit",
                fontSize: "inherit",
                color: "primary.main",
                ...theme.applyStyles("dark", {
                  color: "primary.light",
                }),
              })}
            >
              Material UI
            </Typography>{" "}
            Themes
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
              width: { sm: "100%", md: "60%" },
            }}
          >
            Generate ready-to-use Material UI themes (colors, components and more)
            with an intuitive visual and code editor.
          </Typography>

          <Stack
            spacing={2}
            useFlexGap
            direction={"row"}
            sx={{ pt: 2, flexWrap: "wrap", justifyContent: "center" }}
          >
            <Button
              component={RouterLink}
              to="/editor"
              variant="contained"
              color="primary"
              size="large"
              endIcon={<TuneOutlined />}
            >
              Start Customizing
            </Button>

            {/* <Button
              component={RouterLink}
              to="#examples"
              variant="outlined"
              color="primary"
              size="large"
            >
              Examples
            </Button> */}
          </Stack>
        </Stack>

        <StyledBox id="image" />
      </Container>
    </Box>
  );
}
