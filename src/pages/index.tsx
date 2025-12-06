import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../Frontpage/theme/AppTheme";
import PageHeader from "../Frontpage/PageHeader";
import Hero from "../Frontpage/Hero";
import { Helmet } from "react-helmet";

const defaultOgImageUrl =
  `${import.meta.env.VITE_SITE_URL || "https://mui-theme-builder.netlify.app"}/editor-screenshot.png`;

export default function MarketingPage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <Helmet>
        <title>Design & Prototype Material UI Themes — MUI Theme Builder</title>
        <meta
          name="description"
          content="Generate ready-to-use Material UI themes (colors, components and more) with an intuitive visual and code editor."
        />
        <meta name="robots" content="index,follow" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="author" content="MUI Theme Builder" />
        <meta name="keywords" content="generator, mui theme creator, mui theme editor, mui v6, material ui, theme builder, theme generator, theme editor, MUI v6, MUI themes" />
        {/* Use absolute URLs for canonical and images. Configure `VITE_SITE_URL` in your env. */}
        <link
          rel="canonical"
          href={`${
            import.meta.env.VITE_SITE_URL || "https://mui-theme-builder.netlify.app"
          }`}
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Design & Prototype Material UI Themes — MUI Theme Builder"
        />
        <meta
          property="og:description"
          content="Generate ready-to-use Material UI themes (colors, components and more) with an intuitive visual and code editor."
        />
        <meta property="og:image" content={`${defaultOgImageUrl}`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MUI Theme Builder" />
        <meta
          name="twitter:description"
          content="Design and prototype Material UI themes with a visual and code editor."
        />
        <meta name="twitter:image" content={`${defaultOgImageUrl}`} />
      </Helmet>

      <PageHeader />
      <Hero />
    </AppTheme>
  );
}
