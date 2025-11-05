import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import AppTheme from "../Home/theme/AppTheme";
import AppAppBar from "../Home/components/AppAppBar";
import Hero from "../Home/components/Hero";
import LogoCollection from "../Home/components/LogoCollection";
import Highlights from "../Home/components/Highlights";
import Pricing from "../Home/components/Pricing";
import Features from "../Home/components/Features";
import Testimonials from "../Home/components/Testimonials";
import FAQ from "../Home/components/FAQ";
import Footer from "../Home/components/Footer";

export default function MarketingPage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar />
      <Hero />
      <div>
        <LogoCollection />
        <Features />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
