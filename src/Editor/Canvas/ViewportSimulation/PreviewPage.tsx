import { useEffect, useState, type StyleHTMLAttributes } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import type { Theme, ThemeOptions } from "@mui/material/styles";
import ViewportSimulationFrame from ".//Frame/Frame";

type PreviewPageProps = {
  samplesRegistry: Record<string, unknown>;
  componentId?: string;
  encodedTheme?: string; // base64-encoded theme

  slotsStyles?: {
    viewportOuterPaddingPx?: number;
    viewportWrapperElement: StyleHTMLAttributes<HTMLDivElement>;
  };

  renderNotFoundPageContent?: ({
    componentId,
  }: {
    componentId?: string;
  }) => React.ReactNode;

  renderPageContent?: ({
    errorObjectAsString,
  }: {
    errorObjectAsString: string;
  }) => React.ReactNode;

  renderThemeLoadingPageContent?: () => React.ReactNode;
};

export default function CanvasViewportSimulationPreviewPage(
  props: PreviewPageProps
) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [error, setError] = useState<string | null>(null);

  const componentId = props.componentId;
  const encodedTheme = props.encodedTheme;

  useEffect(() => {
    try {
      let themeObj: Theme;

      if (encodedTheme) {
        try {
          const decodedTheme = atob(encodedTheme);
          const themeOpts = JSON.parse(decodedTheme) as ThemeOptions;
          themeObj = createTheme(themeOpts);
          themeObj = responsiveFontSizes(themeObj);
        } catch (decodeError) {
          console.warn(
            "[ViewportPage] Failed to decode/parse theme from URL, using default:",
            decodeError
          );
          themeObj = createTheme();
          themeObj = responsiveFontSizes(themeObj);
        }
      } else {
        themeObj = createTheme();
        themeObj = responsiveFontSizes(themeObj);
      }

      setTheme(themeObj);
    } catch (err) {
      setError(
        `Failed to initialize theme: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }, [encodedTheme]);

  if (!componentId || !props.samplesRegistry[componentId]) {
    const renderView =
      props.renderNotFoundPageContent || defaultRenderNotFoundPageContent;
    return renderView({ componentId });
  }

  if (error) {
    const renderView = props.renderPageContent || defaultRenderPageContent;
    return renderView({ errorObjectAsString: error });
  }

  if (!theme) {
    const renderView =
      props.renderThemeLoadingPageContent ||
      defaultRenderThemeLoadingPageContent;
    return renderView();
  }

  const width =
    window.innerWidth - (props?.slotsStyles?.viewportOuterPaddingPx || 20);

  const height =
    window.innerHeight - (props?.slotsStyles?.viewportOuterPaddingPx || 20);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <ViewportSimulationFrame
          width={width}
          height={height}
          component={componentId}
          bordered
          style={{
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            ...props?.slotsStyles?.viewportWrapperElement,
          }}
        />
      </Box>
    </ThemeProvider>
  );
}

const defaultRenderNotFoundPageContent: NonNullable<
  PreviewPageProps["renderNotFoundPageContent"]
> = ({ componentId }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "system-ui, sans-serif",
        color: "#d32f2f",
        fontSize: "18px",
      }}
    >
      Component "{componentId}" not found in registry
    </Box>
  );
};

const defaultRenderPageContent: NonNullable<
  PreviewPageProps["renderPageContent"]
> = ({ errorObjectAsString }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "system-ui, sans-serif",
        color: "#d32f2f",
        fontSize: "18px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      {errorObjectAsString}
    </Box>
  );
};

const defaultRenderThemeLoadingPageContent: NonNullable<
  PreviewPageProps["renderThemeLoadingPageContent"]
> = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
};
