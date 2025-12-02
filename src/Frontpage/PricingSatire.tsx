import * as React from "react";
import Box from "@mui/material/Box";
import Button, { type ButtonProps } from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SponsorModal from "./SponsorModal";
import { Stack } from "@mui/material";

const tiers = [
  {
    title: "Hire",
    subheader: "Professional designs & development",
    price: "Get a Quote",
    description: [
      "Full-stack & tool development",
      "Consultation and my unsolicited opinions",
      "Delivery with documentation & support",
    ],
    buttonText: "Let's Work Together",
    buttonVariant: "contained",
    buttonColor: "secondary" as ButtonProps["color"],
    buttonAriaLabel: "Hire me for custom design and development work",
    microcopy: "Available for Work",
  },
  {
    title: "FREE",
    subheader: "Open source tool",
    price: "$0.00",
    description: [
      "Material UI theme editor & tools",
      "Production-ready code exports",
      "Community-driven development",
      "Bug reports welcome, fast fixes not guaranteed",
      "MIT licensed. No attribution required.",
    ],
    buttonText: "Start Customizing",
    buttonVariant: "outlined",
    buttonColor: "primary" as ButtonProps["color"],
    buttonAriaLabel: "Explore free open-source projects and tools",
    microcopy: "No sign-up. No tracking. No idea who you are.",
    highlighted: true,
  },
  {
    title: "Sponsor",
    subheader: "Fund open-source work",
    price: "Your Choice",
    description: [
      "Support ongoing tool development",
      "Influence roadmap priorities",
      "Recognition in project credits",
    ],
    buttonText: "via $BTC",
    buttonVariant: "outlined",
    buttonColor: "warning" as ButtonProps["color"],
    buttonAriaLabel: "Sponsor open-source development via Bitcoin",
    microcopy: "Keep the tools light on!",
  },
];

export default function PricingSatire() {
  const [sponsorOpen, setSponsorOpen] = React.useState(false);
  const sponsorAddress = "bc1...REPLACE_ME";

  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" },
        }}
      >
        <Typography
          component="h2"
          variant="h2"
          gutterBottom
          sx={{ color: "text.primary" }}
        >
          Give me all your money!
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Three ways to support my work: hire me for custom projects, use my free
          tools, or sponsor open-source development with Bitcoin.
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{ alignItems: "center", justifyContent: "center", width: "100%" }}
      >
        {tiers.map((tier) => (
          <Grid
            size={{ xs: 12, sm: tier.title === "Sponsor" ? 12 : 6, md: 4 }}
            key={tier.title}
          >
            <Card
              sx={[
                () => ({
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  height: "100%",
                  border: tier.highlighted ? "none" : undefined,
                  background: tier.highlighted
                    ? "radial-gradient(circle at 50% 0%, hsl(220, 20%, 35%), hsl(220, 30%, 6%))"
                    : undefined,
                  boxShadow: tier.highlighted
                    ? `0 8px 12px hsla(220, 20%, 42%, 0.2)`
                    : undefined,
                }),
                (theme) =>
                  theme?.applyStyles?.("dark", {
                    background:
                      "radial-gradient(circle at 50% 0%, hsl(220, 20%, 20%), hsl(220, 30%, 16%))",
                    boxShadow: `0 8px 12px hsla(0, 0%, 0%, 0.8)`,
                  }),
              ]}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography component="h3" variant="h4">
                    {tier.title}
                  </Typography>
                  {tier.highlighted && (
                    <Chip
                      icon={<AutoAwesomeIcon />}
                      label="Popular"
                      aria-label="Recommended option"
                    />
                  )}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: tier.highlighted ? "grey.300" : "text.secondary",
                    mb: 2,
                  }}
                >
                  {tier.subheader}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    mb: 2,
                  }}
                >
                  <Typography
                    component="span"
                    variant="h3"
                    sx={{ color: tier.highlighted ? "grey.50" : "text.primary" }}
                  >
                    {tier.price === "0" ? "$" : ""}
                    {tier.price}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2, opacity: 0.8, borderColor: "divider" }} />
                {tier.description.map((line) => (
                  <Box
                    key={line}
                    sx={{
                      py: 1,
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{
                        width: 20,
                        color: tier.highlighted ? "primary.light" : "primary.main",
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      component="span"
                      sx={{
                        color: tier.highlighted ? "grey.50" : "text.primary",
                      }}
                    >
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions sx={{ flexDirection: "column", gap: 1, px: 1.5 }}>
                {tier.title === "Sponsor" ? (
                  <>
                    <Stack
                      direction="row"
                      sx={{ width: "100%", alignItems: "center", columnGap: 2 }}
                    >
                      <Button
                        sx={{ flexGrow: 1 }}
                        variant={tier.buttonVariant as "outlined" | "contained"}
                        color={tier.buttonColor}
                        aria-label={tier.buttonAriaLabel}
                        onClick={() => setSponsorOpen(true)}
                        aria-haspopup="dialog"
                        aria-controls="sponsor-dialog"
                        size="small"
                      >
                        {tier.buttonText}
                      </Button>

                      <iframe
                        src="https://github.com/sponsors/everurstruly/button"
                        title="Sponsor everurstruly"
                        height="32"
                        width="114"
                        style={{ border: 0, borderRadius: 6 }}
                      ></iframe>
                    </Stack>

                    {tier.microcopy && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: tier.highlighted ? "grey.400" : "text.secondary",
                          textAlign: "center",
                          fontStyle: "italic",
                        }}
                      >
                        {tier.microcopy}
                      </Typography>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      fullWidth
                      variant={tier.buttonVariant as "outlined" | "contained"}
                      color={tier.buttonColor as "primary" | "secondary"}
                      aria-label={tier.buttonAriaLabel}
                    >
                      {tier.buttonText}
                    </Button>

                    {tier.microcopy && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: tier.highlighted ? "grey.400" : "text.secondary",
                          textAlign: "center",
                          fontStyle: "italic",
                        }}
                      >
                        {tier.microcopy}
                      </Typography>
                    )}
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <SponsorModal
        open={sponsorOpen}
        onClose={() => setSponsorOpen(false)}
        address={sponsorAddress}
      />
    </Container>
  );
}
