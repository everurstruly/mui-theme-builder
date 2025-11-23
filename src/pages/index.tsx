import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../Frontpage/theme/AppTheme";
import PageHeader from "../Frontpage/PageHeader";
import Hero from "../Frontpage/Hero";
import { Helmet } from "react-helmet";

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
        {/* Use absolute URLs for canonical and images. Configure `VITE_SITE_URL` in your env. */}
        <link
          rel="canonical"
          href={`${import.meta.env.VITE_SITE_URL || 'https://yourdomain.com'}/`}
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
        <meta
          property="og:image"
          content={`${import.meta.env.VITE_SITE_URL || 'https://yourdomain.com'}/temp-editor-screenshot.jpg`}
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MUI Theme Builder" />
        <meta
          name="twitter:description"
          content="Design and prototype Material UI themes with a visual and code editor."
        />
        <meta
          name="twitter:image"
          content={`${import.meta.env.VITE_SITE_URL || 'https://yourdomain.com'}/temp-editor-screenshot.jpg`}
        />
      </Helmet>

      <PageHeader />
      <Hero />
    </AppTheme>
  );
}
